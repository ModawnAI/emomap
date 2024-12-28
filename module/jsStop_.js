class jsStop extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='stop';
        if(taskID===null) this.taskID='stop'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='화살표';
        this.instruction_keyword='빨간신호가 나오면 멈추세요';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=10;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsStopTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial(); //compile
    }
    callback_get_debrief(){
        this.evaluate_performance('s','g');
        let html; let acc=100*this.performance.target_unresponded_count/this.performance.target_count;
        let gacc=100*this.performance.nontarget_correct_count/this.performance.nontarget_count;

        html= "%GUIDE%"+
        "결과는 다음과 같습니다.<br>총 시행자극수: <strong>" + this.performance.total_count + "회 총점수: " +this.performance.total_score+ " </strong><br>"+
        "멈춤 자극에 대한 평균 정확도: <strong>" + Math.round(acc) + "%</strong>.<br>"+
        "멈춤 자극지연시간: <strong>" + Math.round(this.task_trial.ssd) + "ms</strong>.<br>"+
        "진행 자극에 대한 평균 정확도: <strong>" + Math.round(gacc) + "%</strong>.<br>"+
        "진행 자극에 대한 정답 반응 평균 응답 속도: <strong>" + Math.round(this.performance.nontarget_correct_rt_mean) + "ms</strong>.<br>"+
        "다시 하시겠습니까?";
        return html;
    }
}

class jsStopTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='stop-v10';

        this.stimulus_type='image'; //image, numbers, html
        this.stimulus_duration=1000;
        this.trial_duration=5000; //2000
        this.post_trial_gap=0;
        this.response_ends_trial=false;
        this.poststimulus='fixation';
        this.fixation_size=50;
        this.stimulus_height=120;
        this.sampling_weights=[2,2,1,1];
        this.ssd=200;
        this.response_fixation=500;
        this.stop_signal_duration=100;//0;
        this.adaptivemode=true;
        //this.post_blank_duration=2000;
        this.set_default();
    }
    set_default(){
        this.keyboard_choices=['j','k'];//['leftarrow','rightarrow'] //: left 37, 'rightarrow': 39,
        this.response_choices=["왼쪽", "오른쪽"];
        this.stimuli_set=['img/fix.png','img/go_left.png','img/stop_left.png','img/go_right.png','img/stop_right.png'];
        this.ctask.conditions = [
            { stimulus: ['img/fix.png','img/go_left.png','img/go_left1.png' ], data: { stim_type: exp.CONGRUENT,stim_id:0, correct_response:0, stim_delay: this.ssd, stimulus:"left/go"} },
            { stimulus: ['img/fix.png','img/go_right.png', 'img/go_right1.png'],  data: { stim_type: exp.CONGRUENT,stim_id:1, correct_response:1,stim_delay: this.ssd, stimulus:"right/go"} },
            { stimulus: ['img/fix.png','img/go_left.png','img/stop_left.png'], data: { stim_type: exp.INCONGRUENT,stim_id:2, correct_response:-1, stim_delay: this.ssd, stimulus:"left/stop"} },
            { stimulus: ['img/fix.png','img/go_right.png','img/stop_right.png'], data: { stim_type: exp.INCONGRUENT,stim_id:3, correct_response:-1,stim_delay: this.ssd, stimulus:"right/stop"} }
        ];
    }
    init(){ //task specific initialization
        super.init()
        for(let i=0;i<this.ctask.conditions.length;i++) for(let j=0;j<this.ctask.conditions[i].stimulus.length;j++)
                this.ctask.conditions[i].stimulus[j]=this.ctask.localpath+this.ctask.conditions[i].stimulus[j];

        if(typeof sequence_ext!=='undefined')
        {
            this.ctask.sequence_data=[...sequence_ext];
            this.sequence_random=false;
            let sequence=[];
            for(let i=0;i<this.ctask.sequence_data.length;i++) {sequence.push(this.ctask.sequence_data[i].stim_1);sequence.push(this.ctask.sequence_data[i].stim_2);}
            //this.stimuli_set=jsFunc.unique(sequence,true);sequence=[];
            this.ctask.sequence_length=this.ctask.sequence_data.length;
        }
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);

        //this.total_duration=1000-this.ssd+this.post_blank_duration;
        this.response_choices=[`${uxm.imagepath}button/left.png`,`${uxm.imagepath}button/right.png`]
        this.ctask.preload_images=this.ctask.preload_images.concat(this.response_choices);

    }
    setup(){
        this.init();
        this.stimuli_isi=this.ssd;

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
            let d=this.ctask.conditions[order[i]];
            d.ssd=Math.round(300+(Math.random()-0.5)*100);
            d.data.stim_delay=d.ssd;
            task_trial_sequence.push(d);
        }
        return task_trial_sequence;
    }
    setup_ordered_sequence(){
        this.ctask.task_trial_sequence = [];       let targetblock=1;
        for (var i=0;i<this.ctask.sequence_data.length;i++) {
            if(parseInt(this.ctask.sequence_data[i].block_number)!==targetblock) continue;
            var a=new Object(); var d=new Object();
            let s1='img/go_' + this.ctask.sequence_data[i].stim_direction +'.png';
            let str=this.ctask.sequence_data[i].stim_condition + '_';
            
            let s2;
            if(this.ctask.sequence_data[i].stim_condition=='stop') 
                s2='img/' + str+ this.ctask.sequence_data[i].stim_direction +'.png';
            else 
                s2='img/' + str+ this.ctask.sequence_data[i].stim_direction +'1.png'; //PHJ

            a.stimulus=['img/fix.png',s1,s2 ]
            a.stimulus.forEach((element,i)=> a.stimulus[i]=this.ctask.localpath+element );
            d.stim_type=this.ctask.sequence_data[i].stim_condition=='stop' ? 's' : 'g'
            d.correct_response=this.ctask.sequence_data[i].stim_direction == 'left' ? 0 : 1;

            if(d.stim_type=='s') {
                d.correct_response=-1;
                d.stim_id=this.ctask.sequence_data[i].stim_direction == 'left' ? 2 : 3;
                d.stimulus = d.stim_id==2 ? 'left/stop' : 'right/stop'
            } else {
                d.stim_id=this.ctask.sequence_data[i].stim_direction == 'left' ? 0 : 1;
                d.stimulus= d.stim_id==0 ? 'left/go' : 'right/go'
            }
            a.ssd=parseInt(this.ctask.sequence_data[i].SSD);
            d.stim_delay=a.ssd;

            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
        this.ctask.sequence_length=this.ctask.task_trial_sequence.length;
    }
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){
        return jsPsych.timelineVariable('data',true);
    }
    callback_stimuli_isi(){
        let ssd;
        if(this.adaptivemode){
            ssd = this.ssd;
        } else {
            ssd = jsPsych.timelineVariable('ssd',true);
        }
        console.log("SSD:"+ssd)
        return [this.response_fixation,ssd,this.stop_signal_duration];
    }
    callback_stimulus_duration(){
        return jsPsych.timelineVariable('ssd',true);
    }
    callback_stimulus_audio(){  return null; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_prompt = function(){        /*
        let last = jsPsych.data.get().last(1).values()[0];
        if(last.stim_type==exp.CONGRUENT){
            return uxm.image_button_yes;
        } else {
            return uxm.image_button_no;
        }  */
    }
    callback_adaptive_procedure(trial){

    }
    callback_score_response =function(data){
        data.correct=false; var score=0;
        if(data.button_pressed==null) {
            data.correct=data.correct_response == -1 ? true:false;
            if(data.correct) score=2;
        } else {
            data.correct = data.button_pressed == data.correct_response ? true: false
            if(data.correct) score=1;
        }
        if(this.adaptivemode){
            if(data.correct_response == -1){
                if (score==2) this.ssd=this.ssd+50;
                else this.ssd=this.ssd-50;
                if(this.ssd>400) this.ssd=400;
                if(this.ssd<50) this.ssd=50;
            }
        }
        return score;
    }
}
