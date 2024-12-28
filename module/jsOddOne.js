class jsOddOne extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='oddone';
        if(taskID===null) this.taskID='oddone'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='이상한것';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsOddOneTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }

    callback_get_debrief(){
        this.evaluate_performance(exp.TARGET,exp.NONTARGET);
        var rtmean=this.performance.total_rt_mean;
        let html = "%GUIDE%"+
        "잘하셨습니다!<br>"+
        "총 "+ this.performance.total_count +"회 중에서 "+ this.performance.total_score+ "회를 맞추었습니다.<br>"+
        "평균 "+ Math.round(rtmean/1000 *100.0)/100.0 +"초 반응시간이 걸렸습니다.<br>"+
        "다시 하시겠습니까?"
        return html;
    }
}

class jsOddOneTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='OddOne-v10';
        this.stimulus_type='array'; //image, numbers, html
        this.stimulus_duration=null;
        this.trial_duration=null; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;
        this.button_stimulus_mode=true;
        this.max_response_count=1;
        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.stimulus_nrow=4;
        this.stimulus_ncol=4;
        this.stimulus_width=100;
        this.stimulus_height=100;
        this.sequence_random=true;
        this.responses=[];
        this.stimuli_set=[];
        this.user_stim_style_flag=true; //important
        this.set_default();

    }
    set_default() {
        this.responses=[];
        this.stimulus_isi=1000;
        this.trial_duration=null; //total duration
        this.number_random_sequence=1;
        this.stimuli_set_pos=[];
        this.stimuli_set_neg=[];
        this.response_choices=[];
    }
    init(){ //task specific initialization
        super.init()
        // just one time for stimuli and stimuli_set when we assign like above
        this.stimuli_set_pos.forEach((element,i)=> this.stimuli_set_pos[i]=this.ctask.localpath+element ); //add localpath
        this.stimuli_set_neg.forEach((element,i)=> this.stimuli_set_neg[i]=this.ctask.localpath+element ); //add localpath
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set_pos);   
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set_neg);             
        this.stimuli_isi=[];
        this.ctask.task_trial_sequence = [];
        this.max_response_count=1;
        this.calc_layout();
    }

    calc_layout() {
        let ncol=this.stimulus_ncol; let nrow=this.stimulus_nrow;
        let height=400;
        let width=400; let aspectratio=1;
        let gapwidthratio = 0.05;let gapheightratio = 0.05;
        let centerx=width/2;
        let centery=height/2;
        if(height>width*3/4) height=width*3/4;   //if(height<width*4/3) height=width*3/4;
        if(aspectratio==1) {
          width=width<height ? width : height;
          height=width; var rto=ncol/nrow; if(rto>1) height=height/rto; else width=width*rto;
        }

        const bheight=height*0.95;const bwidth=width*0.95;
  
        const button_height = Math.round(bheight / (nrow + gapheightratio * (nrow - 1)));
        const button_width = Math.round(bwidth / (ncol + gapwidthratio * (ncol - 1)));
   
        const widthstep = button_width * (1 + gapwidthratio);
        const heightstep = button_height * (1 + gapheightratio);
        const offset_x =centerx-width/2;
        const offset_y =centery-height/2;
        if(this.stimulus_width===null) this.stimulus_width=button_width;
        if(this.stimulus_height===null) this.stimulus_height=button_height;
        if(aspectratio==1) {
          this.stimulus_width=this.stimulus_height>this.stimulus_width?this.stimulus_width:this.stimulus_height;
          this.stimulus_height=this.stimulus_width;
        }
        this.stimulus_positionx = [];
        this.stimulus_positiony = [];      
        var ct = 0;
        for (var i = 0; i < nrow; i++) {
          for (var j = 0; j < ncol; j++) {
            this.stimulus_positionx[ct] = Math.round(j * widthstep + offset_x);
            this.stimulus_positiony[ct] = Math.round(i * heightstep + offset_y);
            ct = ct + 1;
          }
        }
    }
    setup(){
        this.init();
        if(typeof sequence_ext!=='undefined')
        {
            this.ctask.sequence_data=sequence_ext;//.slice(0,10);
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
    generate_random_bit(n) {
        var halfN = Math.floor(n / 2);
        var sampleList = Array(halfN).fill(true).concat(Array(halfN).fill(false));
        if (n % 2 !== 0) {
          sampleList.push(false);
        }
        for (var i = sampleList.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          [sampleList[i], sampleList[j]] = [sampleList[j], sampleList[i]];
        }
        return sampleList;
      }

    setup_random_sequence(sequence_length){
        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var positions=[]; for (let i=0;i<nbut;i++) positions.push(i);
        let task_trial_sequence=[];let stimmain,stimsub;
        let positive=this.generate_random_bit(sequence_length);
        for (var it=0;it<sequence_length;it++) {
            var a=new Object(); var d=new Object(); let ct=0; let items=[];
            if (positive[it]==true) {
                stimmain=this.stimuli_set_pos;
                stimsub=this.stimuli_set_neg;
            } else {
                stimmain=this.stimuli_set_neg;
                stimsub=this.stimuli_set_pos;
            }
            let pos=parseInt(jsPsych.randomization.sampleWithoutReplacement(positions,1));
            let itemsn=jsPsych.randomization.sampleWithoutReplacement(stimmain,nbut-1); 
            let itemsp=jsPsych.randomization.sampleWithoutReplacement(stimsub,1); 
            
            for(let i=0;i<pos;i++) items.push(itemsn[ct++]);
            items.push(itemsp);
            for(let i=pos+1;i<nbut;i++) items.push(itemsn[ct++]);

            d.stim_id=pos;
            d.correct_response=pos;
            a.stimulus=items;
            a.stim_type=exp.TARGET;
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }

    callback_stimuli_isi(){return jsPsych.timelineVariable('stimuli_isi',true);}
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',false);}
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
        var aid=data.stim_id==parseInt(responses[0].button) ? 0 : 1;
        return aid;
    }
}
