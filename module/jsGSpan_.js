class jsGSpan extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='GSpan';
        if(taskID===null) this.taskID='GSpan'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 20;
        this.span_lengths=[2, 2, 3, 3, 4, 4, 5, 5];
        this.nickname='순서기억';
        this.use_debrief_trial=false;
        this.test_session_max_iteration=this.span_lengths.length;
        this.set_default();
    }
    set_default(){
    
    }
    init(){
        this.test_session_max_iteration=this.span_lengths.length;
        
    }
    create_task_trial() {
        this.task_trial=new jsGSpanTrial('trial',this);
        this.task_trial.number_random_sequence=this.span_lengths[this.nsession];
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    update_session_level(flag){
        this.task_trial.number_random_sequence=this.span_lengths[this.nsession];
        this.task_trial.init_sequence(false);
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

class jsGSpanTrial extends jsTrial {
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
    }
    init(){ //task specific initialization
        this.response_choices=['img/B.png','img/S.png'];
        // just one time for stimuli and response_choices when we assign like above
        this.response_choices.forEach((element,i)=> this.response_choices[i]=this.ctask.localpath+element ); //add localpath
        this.stimuli_isi=[];               
    }

    init_sequence(newarray=true) {
        if(newarray) this.ctask.task_trial_sequence=[];
        this.max_response_count=this.number_random_sequence;
        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var stim=[];for (var j=0;j<nbut;j++) stim.push(j);
        for (var i=0;i<this.ctask.sequence_length;i++)
        {
            var idx=jsPsych.randomization.sampleWithoutReplacement(stim, this.number_random_sequence); 
            this.stimuli_isi=[];for (let i=0;i<this.number_random_sequence;i++) this.stimuli_isi[i]=this.stimulus_isi;
            var a=new Object(); var d=new Object();
            if(i==0) {idx=[];for (var j=0;j<this.number_random_sequence;j++) idx.push(j);}
            a.stimulus=idx;
            a.stimuli_isi=this.stimuli_isi;
            d.stim_type=exp.TARGET;
            d.stim_id=idx;
            a.data=d;    
            if(newarray) this.ctask.task_trial_sequence.push(a);
            else this.ctask.task_trial_sequence[i]=a;
        }
    }
    setup(){
        this.init();   
        this.stimuli_set=[];
        this.init_sequence();
        super.setup();   
    }
 
    callback_trial_stimulus(){        
        return jsPsych.timelineVariable('stimulus',true); 
    }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }

    callback_score_response =function(data){
        var score=0;data.correct=false;
        if(typeof data.responses=="undefined") return score;
        for(var i=0;i<data.responses.length;i++) {
            if (data.stimulus[i]==parseInt(data.responses[i].button)) score++;
        }
        if(data.responses.length==score)  data.correct=true;
        return score;
    }
    callback_feedback_audio_index(stimulus,responses){
        var data=jsPsych.timelineVariable('data',true);    
        var score=0;var aid=1;
        for(var i=0;i<responses.length;i++) {
            if (stimulus[i]==parseInt(responses[i].button)) score++;
        }
        if(score==responses.length) aid=0;    
        return aid;
    }
}
