class jsCRSpan extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='CRSpan';
        if(taskID===null) this.taskID='CRSpan'+'-'+jsPsych.randomization.randomID(5);
        this.nickname='순서기억';
    }

    create_task_trial() {
        this.task_trial=new jsCRSpanTrial('trial',this);
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

class jsCRSpanTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='CRSpan-v10';
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
        this.noresponse_warning=true;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.num_question=2;
        this.stimulus_isi=1000;

        this.steps=[3,4,5,6,7];
        this.steps_max_iteration=2;
    }
    
    init(){ //task specific initialization
        this.stimuli_set=['img/S1.png','img/S2.png','img/S3.png','img/S4.png','img/S5.png','img/S6.png','img/S7.png','img/S8.png','img/S9.png'];
        this.responses_set=['img/A1.png','img/A2.png','img/A3.png','img/A4.png','img/A5.png','img/A6.png','img/A7.png','img/A8.png','img/A9.png'];
    }

    setup(){
        this.init();   
        this.steps_max_iteration=jsFunc.sequence_fill(this.steps.length,this.steps_max_iteration);
        this.response_choices=this.responses_set;
        // just one time for stimuli and response_choices when we assign like above
        this.response_choices.forEach((element,i)=> this.response_choices[i]=this.ctask.localpath+element );
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        //add localpath
        this.stimuli_isi=[];
        this.max_response_count=this.num_question;
        const myitems = []; for(let i=0;i<this.stimuli_set.length;i++) myitems.push(i);//0,1,2,..9
        let  ct=0;     let it=0;   
        for (let k=0;k<this.steps.length;k++){
            it=this.steps[k];if(it>myitems.length) continue;let stim=[];for (let j=1;j<=it;j++) stim.push(j);
            for (let i=0;i<this.steps_max_iteration[i];i++){
                const sidx=jsPsych.randomization.sampleWithoutReplacement(myitems, it);
                this.stimuli_isi=[];for (let i=0;i<it;i++) this.stimuli_isi[i]=this.stimulus_isi;
                let a=new Object(); let d=new Object();
                a.stimulus=[];
                for(var j=0;j<sidx.length;j++) a.stimulus.push(this.stimuli_set[sidx[j]]);
                a.stimuli_isi=this.stimuli_isi;
                d.stim_type=exp.TARGET;    
                
                //chose two 
                
                let idx=jsPsych.randomization.sampleWithoutReplacement(stim, this.num_question);    
                if(idx.length>1) idx.sort(function(a, b) {return a - b;});
                let cresp=[];let qstr='';
                for(let j=0;j<this.num_question;j++) {
                    qstr=qstr+ idx[j] +'번째';
                    cresp.push(sidx[idx[j]-1]);
                }
                d.stim_id=idx;
                d.stimulus=jsFunc.array_to_string(idx);
                d.correct_response=cresp;
                a.data=d;
                a.prompt='<div class="font-message"> '+ qstr+ '로 심었던 꽃 화분은 몇 개였나요?</div>';
                this.ctask.task_trial_sequence.push(a);
            }
        }
        this.ctask.sequence_length=this.ctask.task_trial_sequence.length;
        super.setup();   
    }
 
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
