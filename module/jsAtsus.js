class jsAtsus extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='atsus';
        if(taskID===null) this.taskID='atsus'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='지속주의';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsAtsusTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }

    callback_get_debrief(){
        this.evaluate_performance(exp.TARGET,exp.NONTARGET);

        var stim_id=jsPsych.data.get().select('stim_id').values.sort();
        var responsedata=jsPsych.data.get().select('button_pressed').values;
        var rtmean=jsPsych.data.get().select('rt').mean();
        var stimtype=jsPsych.data.get().select('stim_type').values;
        var correct=jsPsych.data.get().select('correct').values;
        var nitem=responsedata.length;

        var tp = jsPsych.data.get().filter({stim_type: exp.TARGET,correct: true}).count();
        var ntot = jsPsych.data.get().filter({stim_type: exp.TARGET}).count();
        var score = jsPsych.data.get().filter({stim_type: exp.TARGET}).select('score').sum();
        let html = "%GUIDE%"+
        "잘하셨습니다!<br>"+
        "평균 "+ Math.round(rtmean/1000 *100.0)/100.0 +"초 반응시간이 걸렸습니다.<br>"+
        "다시 하시겠습니까?"
        return html;
    }
}

class jsAtsusTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='atsus-v10';
        this.stimulus_type='array'; //image, numbers, html
        this.stimulus_duration=null;
        this.trial_duration=null; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;

        this.button_stimulus_mode=true;
        this.wait_duration_after_multiresponses=0;

        this.max_response_count=1;
        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.stimulus_nrow=3;
        this.stimulus_ncol=3;
        this.stimulus_width=150;
        this.stimulus_height=150;
        this.set_default();
    }
    set_default() {

        this.response_choices=['img/b.png','img/s1.png','img/s2.png','img/s3.png','img/s4.png','img/s5.png','img/s6.png','img/s7.png','img/s8.png','img/f.png'];
        this.stimulus_isi=500;
        this.number_random_sequence=1;
        this.stimuli_set=[4,6];
    }
    init(){ //task specific initialization
        super.init()
        // just one time for stimuli and stimuli_set when we assign like above
        this.response_choices.forEach((element,i)=> this.response_choices[i]=this.ctask.localpath+element ); //add localpath
        this.stimuli_isi=[];
        this.ctask.task_trial_sequence = [];
        this.max_response_count=this.number_random_sequence;
    }

    setup(){
        this.init();
        if(typeof sequence_ext!=='undefined')
        {
            this.ctask.sequence_data=sequence_ext;
            this.sequence_random=false;
            this.ctask.sequence_length=this.ctask.sequence_data.length;
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

    setup_random_sequence(sequence_length){
        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var positions=[]; for (let i=0;i<nbut;i++) positions.push(i);
        let task_trial_sequence=[];
        for (var it=0;it<sequence_length;it++) {
            var a=new Object(); var d=new Object(); a.stimuli_isi=[];
            let tdelay=parseInt(jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set,1));
            let pos=parseInt(jsPsych.randomization.sampleWithoutReplacement(positions,1));
            let ar=jsFunc.array2d(tdelay+1,nbut);
            a.stimuli_isi[0]=this.stimulus_isi;
            for(let j=0;j<nbut;j++) ar[0][j]=0;
            for (let i=1;i<tdelay;i++) {
                a.stimuli_isi[i]=1000;
                for(let j=0;j<nbut;j++) ar[i][j]=0;ar[i][pos]=i;
            }
            a.stimuli_isi[tdelay]=0;//response right after
            for(let j=0;j<nbut;j++) ar[tdelay][j]=0;ar[tdelay][pos]=this.response_choices.length-1;
            d.stim_id=pos;
            d.correct_response=pos;
            a.stimulus=ar;
            a.stim_type=exp.TARGET;
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }

    setup_ordered_sequence(){
        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var positions=[]; for (let i=0;i<nbut;i++)  positions.push(i);
        for (var it=0;it<this.ctask.sequence_length;it++) {
            var a=new Object(); var d=new Object(); a.stimuli_isi=[];
            let tdelay,pos;

            tdelay=parseInt(this.ctask.sequence_data[it].tdelay);
            pos=parseInt(this.ctask.sequence_data[it].pos)-1;

            let ar=jsFunc.array2d(tdelay+1,nbut);

            a.stimuli_isi[0]=this.stimulus_isi;
            for(let j=0;j<nbut;j++) ar[0][j]=0;
            for (let i=1;i<tdelay;i++) {
                a.stimuli_isi[i]=1000;
                for(let j=0;j<nbut;j++) ar[i][j]=0;ar[i][pos]=i;
            }
            a.stimuli_isi[tdelay]=0;//response right after
            for(let j=0;j<nbut;j++) ar[tdelay][j]=0;ar[tdelay][pos]=this.response_choices.length-1;
            d.stim_id=pos;
            d.correct_response=pos;
            a.stimulus=ar;
            a.stim_type=exp.TARGET;
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
    }
    callback_stimuli_isi(){return jsPsych.timelineVariable('stimuli_isi',true);}
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true);}
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); }
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }

    callback_score_response =function(data){
        var score=0;
        data.correct= data.stim_id==data.button_pressed ? true : false;
        score=data.correct? 1:0;
        //score=1000-parseInt(data.rt);
        return score;
    }
    callback_feedback_audio_index(stimulus,responses){
        var data=jsPsych.timelineVariable('data',true);
        var aid=data.stim_id==responses[0].button ? 0 : 1;
        return aid;
    }
}
