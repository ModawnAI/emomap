class jsDigitSymbol extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='digitsymbol';
        if(taskID===null) this.taskID='d2s'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='암호코딩';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsDigitSymbolTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }

    callback_get_debrief(){
        this.evaluate_performance(exp.TARGET,exp.NONTARGET);
        var tot = jsPsych.data.get().filter({stim_type:exp.TARGET}).count();
        var correct=jsPsych.data.get().select('correct').sum();
        return "%GUIDE%"+"잘하셨습니다!<br>"+
        "총 "+this.sequence_length  + "회의 시행중에서 <strong>" + correct + "회</strong> 맞았습니다.<br>"+
        "다시 하시겠습니까?";
    }
}

class jsDigitSymbolTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='digitsymbol-v10';
        this.stimulus_type='html'; //image, numbers, html
        this.stimulus_duration=5000;
        this.trial_duration=5000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;
        this.poststimulus='fixation';
        this.button_stimulus_mode=false;
        this.wait_duration_after_multiresponses=1000;
        this.fixation_size=50;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.button_nrow=3;
        this.button_ncol=3;
        this.button_order=null;
        this.background_grid=null;
        this.charmode=false;
        this.stimulus_height=60;
        this.stimulus_width=60;
        this.set_default()
    }
    set_default(){

        if(this.charmode){
            this.stimuli_set=['👩🏻‍🏫','🧑🏼‍🏫','😯','😦','😮','😲','😑','😶','😐'];
        }
        else{
            this.stimuli_set=['img/s1.png','img/s2.png','img/s3.png','img/s4.png','img/s5.png','img/s6.png','img/s7.png','img/s8.png','img/s9.png'];
        }
    }
    init(){
        super.init()
        this.button_order=jsFunc.shuffleidx(9);//[3,2,5,6,0,1,8,4,7];
        if(typeof sequence_ext!=='undefined')
        {
            this.ctask.sequence_data=sequence_ext;//.slice(0,10);
            /*
            let sequence=[];
            for(let i=0;i<sequence_ext.length;i++) sequence.push(this.ctask.sequence_data[i].stimulus);
            this.stimuli_set=jsFunc.unique(sequence,true);sequence=[];
            */
            this.sequence_random=false;
            this.ctask.sequence_length=this.ctask.sequence_data.length;
        }

        if(this.charmode) {
            const style='style="font-size:2rem;text-align:center;margin:0 0;"';
            this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]='<p '+ style+'>'+element+ '</p>'); //add localpath
            this.response_choices=this.stimuli_set;
        }
        else {
            this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element ); //add localpath
            this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
            //this.response_choices=this.stimuli_set;
            this.response_choices=[];
            for(let ct=0;ct<this.stimuli_set.length;ct++){
                let choice='<img src="'+this.stimuli_set[ct]+'"></img>';
                let buthtml=`<button class="webrain-btn">`
                + choice+'</button>'; //border:2px solid black; border-radius:50%;
                this.response_choices.push(buthtml);
            }
        }
    }

    init_background_grid()
    {
        let nrows=2;let ncols=5; let stimulus_width=50; let stimulus_height=50;
        // create blank element to hold code that we generate
        var html_ = '<div id="digitspan_stimulus_background-dummy" css="display: none;">';
        html_ += '<table id="digitspan_stimulus_background table" '+
            'style="border-collapse:collapse; margin-left: auto; margin-right: auto;">';

        let ct=0;let done=false;let row0;
        for (var row = 0; row < nrows; row++) {
            if(done) break;
            row0=row*2;
            var html_0='';var html_1=''; let height=stimulus_height;
            for (var col = 0; col < ncols; col++) {
                if(ct==this.stimuli_set.length) {done=true;break;}
                const imgflag=jsFunc.isImage(this.stimuli_set[this.button_order[ct]]);
                row0=row*2;height=stimulus_height;
                html_0 += '<td id="digitspan_stimulus_background-table-' + row0 + '-' + col +'" '+
                'style="padding: '+ (height / 10) + 'px ' + (stimulus_width / 10) + 'px; ">'+
                '<div id="digitspan_stimulus_background-table-cell-' + row0 + '-' + col + '" style="width: '+stimulus_width+'px; height:32x;text-align: center;'+
                'border: 1px solid black; background-color:#aaa;border-radius:12px;color:white;font-size:25px;">'+(ct+1);
                html_0 += '</div></td>';

                row0=row*2+1;height=stimulus_height;
                let heightstr='height: '+height + 'px;';
                if(!imgflag) {height=30;heightstr="text-align:center;height:"+height+"px;";}
                html_1 += '<td id="digitspan_stimulus_background-table-' + row0 + '-' + col +'" '+
                'style="padding: '+ (height / 10) + 'px ' + (stimulus_width / 10) + 'px; ">'+
                '<div id="digitspan_stimulus_background-table-cell-' + row + '-' + col + '" style="width: '+stimulus_width+'px; '+heightstr;
                if(!imgflag) html_1 += ' border: 1.5px solid #555; border-radius:50%;">';
                else html_1 += ' border:none; ">';

                if(imgflag) html_1 += '<img src="'+this.stimuli_set[this.button_order[ct]]+'" style="width: '+stimulus_width+'px; height: '+height+'px;"></img>';
                else {html_1 +=this.stimuli_set[this.button_order[ct]];}

                html_1 += '</div></td>';
                ct=ct+1;
            }

            html_ += '<tr id="digitspan_stimulus_background-table-row-'+row0+'" css="height: '+stimulus_height+'px;background-color:#555;">';
            html_+=html_0+ '</tr>';

            row0=row*2+1;
            html_ += '<tr id="digitspan_stimulus_background-table-row-'+row0+'" css="height: '+stimulus_height+'px;">';
            html_+=html_1+ '</tr>';

        }
        html_ += '</table></div>';
        this.background_grid=html_;
    }
    // grid button 3x3
    setup(){
        this.init();   let idurationflag=false;

        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_sequence_length);
        if(this.sequence_random){
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
        } else {
            this.setup_ordered_sequence(idurationflag);
        }
        this.init_background_grid();
        this.ctask.sequence_data=[];
        super.setup();
    }
    setup_random_sequence(sequence_length){
        let task_trial_sequence = [];
        const conds = [0,1,2,3,4,5,6,7,8];
        let sidx=jsPsych.randomization.sampleWithReplacement(conds, sequence_length);
        jsFunc.sort_not_neighboring(sidx);

        for (let it=0;it<sequence_length;it++){
            var a=new Object(); var d=new Object();
            a.stimulus=`<p style="font-weight:bold;font-size:3rem; color:#941751;">${sidx[it]+1}</p>`;
            d.stim_type=exp.TARGET;
            d.stim_id=sidx[it];
            d.stimulus=this.button_order[sidx[it]];
            d.correct_response=d.stimulus;
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }

    setup_ordered_sequence(idurationflag){
        let stimulus_duration=[],trial_duration=[];
        for (let it=0;it<this.ctask.sequence_length;it++) {
            stimulus_duration.push(parseInt(this.ctask.sequence_data[it].stimulus_duration));
            trial_duration.push(parseInt(this.ctask.sequence_data[it].trial_duration));
        }
        let usd=jsFunc.unique(stimulus_duration);
        let utd=jsFunc.unique(trial_duration);
        if(usd.length==1 && utd.length==1) {
            idurationflag=false;
            this.stimulus_duration=usd[0];
            this.trial_duration=utd[0];
        } else idruationflag=true;

        for (let it=0;it<this.ctask.sequence_length;it++){
            var a=new Object(); var d=new Object();
            let sidx=parseInt(this.ctask.sequence_data[it].stimulus);
            a.stimulus=`<p style="font-weight:bold;font-size:3rem; color:#941751;">${sidx}</p>`;
            if(idurationflag) {
                a.stimulus_duration=this.ctask.sequence_data[it].stimulus_duration;
                a.trial_duration=this.ctask.sequence_data[it].trial_duration;
            }
            d.stim_type=exp.TARGET;
            d.stim_id=sidx-1;
            d.stimulus=sidx;
            d.correct_response=this.button_order[sidx-1];
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
    }
    //callback_stimulus_duration(){return this.stimulus_duration;};
    //callback_trial_duration(){return this.trial_duration;};

    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); }
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_prompt(){ return jsPsych.timelineVariable('prompt',true);}
    callback_on_start(trial) {
        let ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
        ctrial.ctask.statusbar_display();
        let cont= exp.get_DOM_top_message_container();
        if(cont!=null) {
            cont.style=' ';
            exp.set_DOM_top_message_container(ctrial.background_grid);
            cont.style='';
        } else {
            env.drawWebrainBars();
        }
        //document.querySelector(".jspsych-display-element").style.height='100px';
    }
    callback_score_response =function(data){
        data.correct = (data.correct_response==data.button_pressed) ? true : false;
        return data.correct ? 1:0;
    }
    callback_feedback_audio_index(stimulus,responses){
        var data=jsPsych.timelineVariable('data',true);
        var score=0;  if (data.correct_response==parseInt(responses[0].button)) {score++;};
        return (score>0) ? 0:1;
    }
}
