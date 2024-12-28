class jsStroop extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='stroop';
        if(taskID===null) this.taskID='stroop'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='스트룹';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=10;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsStroopTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial(); //compile
    }
    callback_get_debrief(){
        return this.get_debrief_type('congruent');
    }
}

class jsStroopTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='Stroop-v10';
        this.stimulus_type='image'; //image, numbers, html
        this.stimulus_duration=1000;
        this.trial_duration=3000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=false;
        this.poststimulus='fixation';
        this.fixation_size=50;
        this.stimulus_height=200;
        this.sampling_weights=[];
        this.set_default()
    }
    set_default(){
        this.response_choices=['img/text_red.png','img/text_blue.png','img/text_green.png','img/text_yellow.png'];
    }
    init(){ //task specific initialization
        super.init()
        if(typeof sequence_ext!=='undefined')
        {
            this.ctask.sequence_data=sequence_ext;
            let sequence=[];
            for(let i=0;i<sequence_ext.length;i++) sequence.push(this.ctask.sequence_data[i].stimulus);
            this.stimuli_set=jsFunc.unique(sequence,true);
            this.sequence_random=false;
            sequence=[];
            this.ctask.sequence_length=this.ctask.sequence_data.length;
        }
        this.response_choices.forEach((element,i)=> this.response_choices[i]=this.ctask.localpath+element );
    }
    setup(){
        this.init();
        let colors=['red','blue','green','yellow'];
        let texts=['red','blue','green','yellow', 'school', 'mind', 'next', 'friend'];
        let rulestr=['texts','colors'];
        let img;

        this.ctask.conditions=[]; var stimtype;  let ct=0;
        for(var j=0;j<texts.length;j++){
            for(var k=0;k<colors.length;k++){
                img=this.ctask.localpath+'img/'+texts[j]+colors[k]+'.png';
                if(j==k) stimtype=exp.CONGRUENT;
                else if(j>3) stimtype=exp.NEUTRAL;
                else stimtype=exp.INCONGRUENT;
                let dstim=texts[j]+colors[k];
                var stim={stimulus:img,data:{stim_type:stimtype, correct_response:k, stim_id:ct, stimulus:dstim}};
                this.ctask.conditions.push(stim);
                this.ctask.preload_images.push(img);
                this.sampling_weights.push(1);
                ct=ct+1;
            }
        }

        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_sequence_length);
        if(this.sequence_random){
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
        } else {
            this.setup_ordered_sequence();
        }
        this.ctask.sequence_data=[];
        super.setup();
    }
    setup_random_sequence(sequence_length,sampling_weights=this.sampling_weights){
        let sampling_method={ // just referece,, without use
            type: 'with-replacement',
            size: sequence_length,
            weights: sampling_weights,
        };
        var order = [];for(var i=0; i<this.ctask.conditions.length; i++){order.push(i);}
        order = jsPsych.randomization.sampleWithReplacement(order, sequence_length, sampling_weights);

        let task_trial_sequence = [];
        for (var i=0;i<sequence_length;i++){
            task_trial_sequence.push(this.ctask.conditions[order[i]]);
        }
        return task_trial_sequence;
    }
    setup_ordered_sequence(){
        let colors=['red','blue','green','yellow'];
        let texts=['red','blue','green','yellow', 'school', 'mind', 'next', 'friend'];
        this.ctask.task_trial_sequence = [];
        for (var i=0;i<this.ctask.sequence_length;i++){
            let tid=texts.indexOf(this.ctask.sequence_data[i].text);
            let cid=colors.indexOf(this.ctask.sequence_data[i].color);
            let id=cid+tid*colors.length;
            let a=this.ctask.conditions[id];
            this.ctask.task_trial_sequence.push(a);
        }
    }
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); }
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_score_response =function(data){
        data.correct=data.button_pressed === data.correct_response;
        let score=data.correct ? 1:0;
        if(data.correct && data.stim_type==exp.INCONGRUENT) score=2;
        return score;
    }
}
