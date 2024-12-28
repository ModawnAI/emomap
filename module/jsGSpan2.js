class jsGSpan2 extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='gspan';
        if(taskID===null) this.taskID='gspan'+'-'+jsPsych.randomization.randomID(5);
        
        this.nickname='순서기억';
        this.set_default();
    }
    set_default(){
        this.pretest_span_lengths=[2,3];
        this.span_lengths=[2, 2, 3, 3, 4, 4, 5, 5];
    }

    create_task_trial() {
        this.task_trial=new jsGSpan2Trial('trial',this);
        this.task_trial.number_random_sequence=this.span_lengths[this.nsession];
    }
    set_task_trial(trial){
        super.set_task_trial();
    }

    callback_get_debrief(){
        var stim_id=jsPsych.data.get().select('stim_id').values.sort();
        var responsedata=jsPsych.data.get().select('button_pressed').values;
        var rtdata=jsPsych.data.get().select('rt').values;
        var stimtype=jsPsych.data.get().select('stim_type').values;
        var correct=jsPsych.data.get().select('correct').values;
        var nitem=responsedata.length; 
    
        var tp = jsPsych.data.get().filter({stim_type: exp.TARGET,correct: true}).count();
        var ntot = jsPsych.data.get().filter({stim_type: exp.TARGET}).count();
        var score = jsPsych.data.get().filter({stim_type: exp.TARGET}).select('score').sum();
        let html = "%GUIDE%"+
        "잘하셨습니다!<br>"+
        "총 시행횟수 "+ntot+ "중에 " + tp +"개를 맞추어<br>"+
        "총 "+ score+"점 입니다.<br>"+
        "다시 하시겠습니까?"
        return html;
    }
}

class jsGSpan2Trial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='GSpan-v10';
        this.stimulus_type='numbers'; //image, numbers, html 
        this.stimulus_duration=1000;
        this.trial_duration=6000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;  

        this.button_stimulus_mode=true;        
        this.wait_duration_after_multiresponses=1000;

        this.stimulus_height=100;
        this.max_response_count;
        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.stimulus_nrow=4;
        this.stimulus_ncol=5;
        this.number_random_sequence=3;
        this.stimulus_isi=500; 
        this.user_stim_style_flag=true;
        this.set_default()
    }
    set_default(){
           this.stimuli_isi=[];this.stimuli_set=[];
           this.stimulus_isi=500; 
    }
    init(){ //task specific initialization
        this.response_choices=['img/B.png','img/S.png'];
        // just one time for stimuli and response_choices when we assign like above
        this.response_choices.forEach((element,i)=> this.response_choices[i]=this.ctask.localpath+element ); //add localpath
        this.ctask.preload_images=this.ctask.preload_images.concat(this.response_choices);             
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
        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var stim=[];for (var j=0;j<nbut;j++) stim.push(j);
        for (let i=0;i<number_random_sequence.length;i++){
            let nitem=number_random_sequence[i];
            const idx=jsPsych.randomization.sampleWithoutReplacement(stim, nitem);
            var a=new Object(); var d=new Object();
            a.stimulus=idx; a.stimuli_isi=[]; 
            for(let i=0;i<nitem;i++) a.stimuli_isi.push(this.stimulus_isi);         
            d.stim_type=exp.TARGET;    
            d.stim_id=idx;
            d.stimulus=idx;
            a.data=d;
            d.correct_response=idx;
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
        return jsPsych.timelineVariable('stimulus',true).length; 
    }
    callback_trial_stimulus(){        
        return jsPsych.timelineVariable('stimulus',true); 
    }
    callback_stimuli_isi(){return jsPsych.timelineVariable('stimuli_isi',true); };
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_score_response =function(data){
        var score=0;data.correct=false;
        if(typeof data.responses=="undefined") return score;
        for(var i=0;i<data.responses.length;i++) {
            if (data.correct_response[i]==parseInt(data.responses[i].button)) score++;
        }
        if(data.responses.length==score)  data.correct=true;
        return score;
    }
    callback_feedback_audio_index(stimulus,responses){
        var data=jsPsych.timelineVariable('data',true);    
        var score=0;var aid=1;
        for(var i=0;i<responses.length;i++) {
            if (data.correct_response[i]==parseInt(responses[i].button)) score++;
        }
        if(score==responses.length) aid=0;    
        return aid;
    }
}
