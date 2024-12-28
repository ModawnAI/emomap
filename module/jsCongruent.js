class jsCongruent extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='congruent';
        if(taskID===null) this.taskID='congruent'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='일치불일치';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsCongruentTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial(); //compile
    }
    callback_get_debrief(){
        return this.get_debrief_type('congruent');
    }
}

class jsCongruentTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='congruent-v10';
        this.stimulus_type='html'; //image, numbers, html
        this.sampling_weights=[1,1];
        this.stimulus_duration=3000;
        this.trial_duration=5000;
        this.post_trial_gap=0;
        this.response_ends_trial=true;
        this.poststimulus='fixation';
        this.fixation_size=50;
        this.stimulus_height=200;
        this.noresponse_warning=false;
        this.font_color='white'
        this.font_weight='bold'
        this.set_default()
    }
    set_default(){
        this.keyboard_choices=['j','k'];//['leftarrow','rightarrow'] //: left 37, 'rightarrow': 39,
        this.stimuli_set=[];
        this.response_choices=["일치", "불일치"];
    }
    init(){ //task specific initialization
        super.init()
        if(typeof sequence_ext!=='undefined')
        {
            let sequence=[];
            if (this.stimulus_type=='image'){
                this.ctask.sequence_data=[];
                for(let i=0;i<sequence_ext.length;i++) 
                {
                    let cpath=this.ctask.localpath+'img/';
                    sequence.push(sequence_ext[i].stimulus);
                    let a=sequence_ext[i];                  
                    a.stimulus=cpath + sequence_ext[i].stimulus + '.png';
                    this.ctask.sequence_data.push(a);
                }
                let stimuli_set=jsFunc.unique(sequence,true);
                stimuli_set.forEach((element,i) => stimuli_set[i]=cpath+element+ '.png' );
                this.ctask.preload_images=this.ctask.preload_images.concat(stimuli_set);
            } else
            {
                this.ctask.sequence_data=sequence_ext;
            }
            this.sequence_random=false;
            this.ctask.sequence_length=this.ctask.sequence_data.length;
            sequence=[];
        }
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
    }
    setup(){
        this.init();
        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_sequence_length);
        if(this.sequence_random){
            //this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
        } else {
            this.setup_ordered_sequence();
        }
        this.ctask.sequence_data=[];
        super.setup();
    }
    setup_random_sequence(sequence_length){
        let task_trial_sequence = [];
        let sequence_data = jsPsych.randomization.sampleWithoutReplacement(this.ctask.sequence_data, sequence_length);
        for (let i=0;i<sequence_length;i++)
        {
            var a=new Object(); var d=new Object();
            let s=sequence_data[i];
            if (s.stim_type=='c' || s.stim_type=='0'){d.stim_type=exp.CONGRUENT; d.stimulus=s.response_type;}
            else if(s.stim_type=='i' || s.stim_type=='1') {d.stim_type==exp.INCONGRUENT; d.stimulus=s.response_type;}
            d.correct_response=parseInt(s.correct_response);
            d.stim_id=s.stim_id;
            if (this.stimulus_type=='image') {
                a.stimulus=s.stimulus;
            } else {
                let stim=s.stimulus;
                a.stimulus = '<p style="color:' + this.font_color + '; font-size:' + this.stimulus_height + '; font-weight:' + this.font_weight + ';">' + stim + '</p>';
                a.speech_text=stim; 
            }
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }
    setup_ordered_sequence(){
        this.ctask.task_trial_sequence = [];
        for (let i=0;i<this.ctask.sequence_length;i++)
        {
            var a=new Object(); var d=new Object();
            let s=this.ctask.sequence_data[i];
            if (s.stim_type=='c' || s.stim_type=='0'){d.stim_type=exp.CONGRUENT; d.stimulus=s.response_type;}
            else if(s.stim_type=='i' || s.stim_type=='1') {d.stim_type==exp.INCONGRUENT; d.stimulus=s.response_type;}
            d.correct_response=parseInt(s.correct_response);
            d.stim_id=s.stim_id;
            if (this.stimulus_type=='image') {
                a.stimulus=s.stimulus;
            } else {
                let stim=s.stimulus;
                a.stimulus = '<p style="color:' + this.font_color + '; font-size:' + this.stimulus_height + '; font-weight:' + this.font_weight + ';">' + stim + '</p>';
                a.speech_text=stim; 
            }
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
    }
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){return jsPsych.timelineVariable('data',true); }
    set_speech_text(){ return jsPsych.timelineVariable('speech_text',true);}
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    //callback_response_audio(){  return uxm.sound_button_press; }
    callback_prompt = function(){
        /*
        let last = jsPsych.data.get().last(1).values()[0];
        if(last.stim_type==exp.CONGRUENT){
            return uxm.image_button_yes;
        } else {
            return uxm.image_button_no;
        }
        */
    }
    callback_adaptive_procedure(trial){
        if(this.adaptivemode){
            let flag=0;let nadapt=3;
            if (this.responses.length<nadapt) return;
            for (i=1;i<=nadapt;i++)
            {
                if(this.responses[this.responses.length - i].correct) {  flag=flag+1;   }
                else { flag=flag-1;}
            }
            if (flag==nadapt) trial.stimulus_duration=trial.stimulus_duration*0.5;
            else if(flag==-nadapt) trial.stimulus_duration=trial.stimulus_duration*5;
            console.log(trial.stimulus_duration);
        }
    }
    callback_score_response =function(data){
        data.correct=data.button_pressed == data.correct_response  ? true : false;
        var score=data.correct ? 1:0;
        return score;
    }
}
