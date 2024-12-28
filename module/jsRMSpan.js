class jsRMSpan extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='rmspan';
        if(taskID===null) this.taskID='rmspan'+'-'+jsPsych.randomization.randomID(5);
        this.nickname='순서기억';
        this.set_default();
    }
    set_default(){
        this.pretest_span_lengths=[3,4];
        this.span_lengths=[3, 3, 4, 4, 5, 5];
        this.num_question=1;
    }
    
    create_task_trial() {
        this.task_trial=new jsRMSpanTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    callback_get_debrief(){
        var tot = jsPsych.data.get().filter({stim_type:exp.TARGET}).count();
        var correct=jsPsych.data.get().select('correct').sum();
        return "%GUIDE%"+"잘하셨습니다!<br>"+  
        "총 "+this.sequence_length  + "회의 시행중에서 <strong>" + correct + "회</strong> 맞았습니다.<br>"+
        "다시 하시겠습니까?";
    }
}

class jsRMSpanTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='RMSpan-v10';
        this.stimulus_type='image'; //image, numbers, html 
        this.stimulus_duration=1000;
        this.trial_duration=5000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;
        this.poststimulus='fixation';        
        this.button_stimulus_mode=false;
        this.wait_duration_after_multiresponses=1000;
        this.fixation_size=50;
        this.stimulus_height=100;
        this.max_response_count=2;
        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.num_question=2;
        this.stimulus_isi=1000;

        this.question_string=['한마리','두마리','세마리','네마리','다섯마리','여섯마리','일곱마리','여덟마리','아홉마리','열마리'];
        this.set_default()
    }
    set_default(){
           this.stimuli_isi=[];
           this.stimulus_isi=1000; 
    }
    
    init(){ //task specific initialization
        this.stimuli_set=['img/S1.png','img/S2.png','img/S3.png','img/S4.png','img/S5.png','img/S6.png','img/S7.png','img/S8.png','img/S9.png'];
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element ); //add localpath
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);    
        this.response_choices=this.stimuli_set;    
        this.max_response_count=this.num_question;    
    }

    setup(){
        this.init();        
        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_span_lengths);
        this.ctask.pretest_sequence_length=this.ctask.pretest_span_lengths.length;

        if(this.sequence_random){
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.span_lengths);
            this.ctask.sequence_length=this.ctask.task_trial_sequence.length;
        } else {
            this.setup_ordered_sequence(this.ctask.sequence);
        }    
        super.setup();   
    }

    setup_random_sequence(number_random_sequence){        
        let task_trial_sequence = [];
        if (!Array.isArray(number_random_sequence)) number_random_sequence=[number_random_sequence];
        const myitems = []; for(let i=0;i<this.stimuli_set.length;i++) myitems.push(i);//0,1,2,..9
        for (let i=0;i<number_random_sequence.length;i++){
            let nitem=number_random_sequence[i];
            
            const sidx=jsPsych.randomization.sampleWithoutReplacement(myitems, nitem);
            var a=new Object(); var d=new Object();
            a.stimulus=[]; a.stimuli_isi=[]; 
            for(let i=0;i<nitem;i++) {
                a.stimuli_isi.push(this.stimulus_isi);     
                a.stimulus.push(this.stimuli_set[sidx[i]]);    
            }
            
           
            //chose one 
            let stim=[];            
            if(nitem<=3) stim.push(0);
            for (let j=1;j<=2;j++) stim.push(j);
            let n=jsPsych.randomization.sampleWithoutReplacement(stim, 1)[0];   //0,1,2, 0 only for 3
            let numstr=this.question_string[n];
            let cresp=[];
            for(let j=nitem-n-1;j<nitem;j++) {
                cresp.push(sidx[j]);
            }
            d.stim_type=exp.TARGET;    
            d.stim_id=n;            
            d.stimulus=jsFunc.array_to_string(sidx);
            d.correct_response=cresp;
            
            a.data=d;
            a.prompt=`<div class="font-message"> 마지막으로 본 ${numstr} 아기 오리들의 번호는 무엇이었을까요?</div>`;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }
    setup_ordered_sequence(){
        return null;
    }

    compile(){
        let mtrial=[];let ctrial=null;
        if(this.trial===null) {super.compile();ctrial=this.trial;}
        for (let it=0;it<this.ctask.span_lengths.length;it++){
            let test_sequence = {                
                timeline: [this.trial],
                timeline_variables: [this.ctask.task_trial_sequence[it]],
            };
            mtrial=mtrial.concat(test_sequence);
        }
        this.trial=mtrial;

        // pretest
        this.ctask.pretest_sequence=[];
        for (let it=0;it<this.ctask.pretest_span_lengths.length;it++){   
            let test_sequence = {
                timeline: [ctrial],
                timeline_variables: [this.ctask.pretest_trial_sequence[it]],
            };
            this.ctask.pretest_sequence.push(test_sequence);            
        }
    }
    callback_max_response_count(){
        let data=jsPsych.timelineVariable('data',true);
        return data.correct_response.length; 
    }
    callback_stimuli_isi(){ return jsPsych.timelineVariable('stimuli_isi',true); }
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_prompt(){ return jsPsych.timelineVariable('prompt',true);}
    callback_score_response =function(data){
        var score=0;data.correct=false;
        if(typeof data.responses=="undefined") return score;
        for(var i=0;i<data.responses.length;i++) {
            if (data.correct_response[i]===parseInt(data.responses[i].button)) score++;
        }
        if(data.responses.length==score)  data.correct=true;
        return score;
    }
    callback_feedback_audio_index(stimulus,responses){
        var data=jsPsych.timelineVariable('data',true);    
        var score=0;var aid=1;
        for(var i=0;i<responses.length;i++) {
            if (data.correct_response[i]===parseInt(responses[i].button)) score++;
        }
        if(score==responses.length) aid=0;    
        return aid;
    }
}
