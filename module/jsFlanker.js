class jsFlanker extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='flanker';
        if(taskID===null) this.taskID='flanker'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='플랭커';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsFlankerTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial(); //compile
    }
    callback_get_debrief(){
        return this.get_debrief_type('congruent');
    }
}

class jsFlankerTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='flanker-v10';
        this.stimulus_type='image'; //image, numbers, html
        this.stimulus_duration=1000;
        this.trial_duration=2000;
        this.post_trial_gap=0;
        this.response_ends_trial=false;
        this.poststimulus='fixation';
        this.fixation_size=50;
        this.stimulus_height=150;
        this.sampling_weights=[1,1,1,1];
        this.set_default()
    }
    set_default(){
        this.keyboard_choices=['j','k'];//['leftarrow','rightarrow'] //: left 37, 'rightarrow': 39,
        this.stimuli_set=["img/congruent1.png","img/congruent2.png","img/incongruent1.png","img/incongruent2.png"];
        this.response_choices=["왼쪽", "오른쪽"];

        /* this.ctask.test_stimuli_text = [
            { stimulus: "<<<<<", data: { stim_type: exp.CONGRUENT} },
            { stimulus: ">>>>>", data: { stim_type: exp.CONGRUENT} },
            { stimulus: "<<><<", data: { stim_type: exp.INCONGRUENT} },
            { stimulus: ">><>>", data: { stim_type: exp.INCONGRUENT} }
        ]; */

    }
    init(){ //task specific initialization
        super.init()
        if(typeof sequence_ext!=='undefined')
        {
            this.ctask.sequence_data=sequence_ext;
            let sequence=[];
            for(let i=0;i<sequence_ext.length;i++) sequence.push(this.ctask.sequence_data[i].stimulus);
            //let stimuli_set=jsFunc.unique(sequence,true);
            sequence=[];
            this.sequence_random=false;
            this.ctask.sequence_length=this.ctask.sequence_data.length;
        }
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);

        this.ctask.conditions = [
            { stimulus: this.stimuli_set[0], data: { stim_type: exp.CONGRUENT,correct_response:0, stim_id:0, stimulus:"congruent1"} },
            { stimulus: this.stimuli_set[1], data: { stim_type: exp.CONGRUENT,correct_response:1, stim_id:1, stimulus:"congruent2"} },
            { stimulus: this.stimuli_set[2], data: { stim_type: exp.INCONGRUENT,correct_response:0, stim_id:2, stimulus:"incongruent1"} },
            { stimulus: this.stimuli_set[3], data: { stim_type: exp.INCONGRUENT,correct_response:1, stim_id:3, stimulus:"incongruent2"} }
        ];
    }
    setup(){
        this.init();
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
        var order = [];for(var i=0; i<this.ctask.conditions.length; i++){order.push(i);}
        order = jsPsych.randomization.sampleWithReplacement(order, sequence_length, sampling_weights);
        let task_trial_sequence = [];
        for (var i=0;i<sequence_length;i++){
            task_trial_sequence.push(this.ctask.conditions[order[i]]);
        }
        return task_trial_sequence;
    }
    setup_ordered_sequence(){
        this.ctask.task_trial_sequence = [];
        for (var i=0;i<this.ctask.sequence_length;i++)
        {
            var a=new Object(); var d=new Object();
            d.stim_type=this.ctask.sequence_data[i].stim_type;
            d.correct_response=parseInt(this.ctask.sequence_data[i].correct_response);
            d.stim_id=parseInt(this.ctask.sequence_data[i].stim_id);
            a.stimulus=this.stimuli_set[d.stim_id];//this.ctask.localpath+this.ctask.sequence_data[i].stimulus;
            d.stimulus=this.ctask.conditions[d.stim_id].data.stimulus;
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
    }
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){return jsPsych.timelineVariable('data',true); }
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
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
