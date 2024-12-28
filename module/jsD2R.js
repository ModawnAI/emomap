class jsD2R extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='D2R';
        if(taskID===null) this.taskID='D2R'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='순서기억';
    }

    create_task_trial() {
        this.task_trial=new jsD2RTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    callback_get_debrief(){
        //this.evaluate_performance(exp.INCONGRUENT,exp.CONGRUENT);
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

class jsD2RTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='D2R-v10';
        this.stimulus_type='numbers'; //image, numbers, html 
        this.stimulus_duration=1000;
        this.trial_duration=60000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;  

        this.button_stimulus_mode=true;        
        this.wait_duration_after_multiresponses=0;

        this.stimulus_height=100;
        this.max_response_count=10000;
        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.stimulus_nrow=4;
        this.stimulus_ncol=30;
        this.mark_responded_button=true;
        this.aspect_ratio=0;
    }
    init(){ //task specific initialization
        this.response_choices=['img/d1.png','img/d2.png','img/d3.png','img/d4.png','img/d5.png','img/d6.png','img/d7.png','img/d8.png',
        'img/p1.png','img/p2.png','img/p3.png','img/p4.png','img/p5.png','img/p6.png','img/p7.png','img/p8.png','img/next.png'];
        // just one time for stimuli and response_choices when we assign like above
        this.response_choices.forEach((element,i)=> this.response_choices[i]=this.ctask.localpath+element ); //add localpath
        this.stimuli_isi=[];
    }

    setup(){
        this.init();   
        if(window.innerHeight/window.innerWidth>1.6) {
            this.stimulus_ncol=Math.round(this.stimulus_ncol/2);
            this.stimulus_nrow*=2;
        }
        this.stimuli_set=[];
        this.ctask.task_trial_sequence = [];
        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var stim=[];for (var j=0;j<this.response_choices.length-1;j++) stim.push(j); //except for the next arrow
        for (var i=0;i<this.ctask.sequence_length;i++)
        {
            var idx=jsPsych.randomization.sampleWithReplacement(stim, nbut-1); 
            idx.push(16); //arrow
            var a=new Object(); var d=new Object();
            a.stimulus=idx;
            a.stimuli_isi=[];
            d.stim_type=exp.TARGET;
            d.stim_id=idx;
            a.data=d;    
            this.ctask.task_trial_sequence.push(a);
        }        
        super.setup();   
    }
 
    calc_layout(trial){        
        var container=exp.get_DOM_contents_container();
        //let rect=exp.get_DOM_contents_container().getBoundingClientRect();
        let height=container.offsetHeight; //window.innerWidth-
        let width=container.offsetWidth; 
        var nrow=this.stimulus_nrow;var ncol=this.stimulus_ncol;
        let gapwidthratio = 0.05;let gapheightratio = 0.01;
        const centery=container.offsetHeight/2;//(rect.top+rect.bottom)/2;
        
        if(height>width) height=width;   //if(height<width*4/3) height=width*3/4;
        //PHJ recent if(height<width*3/4) width=width*3/4;   //if(height<width*4/3) height=width*3/4;
        if(this.aspect_ratio==1) {
            width=width<height ? width : height;
            height=width; var rto=ncol/nrow; if(rto>1) height=height/rto; else width=width*rto;
        }
        const bheight=height*0.9;const bwidth=width*0.95;
        let button_width = Math.round(bwidth / (ncol + gapwidthratio * (ncol - 1)));
        let button_height=Math.round(button_width*3.2);
        for (let i=0;i<100;i++){ //when overflow
            if(button_height*nrow>container.offsetHeight) {
                button_height=button_height*0.95;
                button_width=button_width*0.95;
            } else break;
        }
        const widthstep = button_width * (1 + gapwidthratio);
        const heightstep = button_height * (1 + gapheightratio);
        const offset_x = (container.offsetWidth-widthstep*ncol)/2;
        const offset_y = centery - heightstep*nrow/2;

        trial.stimulus_width=button_width;
        trial.stimulus_height=button_height;
        if(this.aspect_ratio==1) {
            trial.stimulus_width=trial.stimulus_height>trial.stimulus_width?trial.stimulus_width:trial.stimulus_height;
            trial.stimulus_height=trial.stimulus_width;
        }
        trial.stimulus_positionx = [];
        trial.stimulus_positiony = [];      
        var ct = 0;
        for (var i = 0; i < nrow; i++) {
            for (var j = 0; j < ncol; j++) {
                trial.stimulus_positionx[ct] = Math.round(j * widthstep + offset_x);
                trial.stimulus_positiony[ct] = Math.round(i * heightstep + offset_y);//relative to the current content element, a parent
                ct = ct + 1;
            }
        }
    }
    callback_on_start(trial){ //trial is unified-button-response
        this.calc_layout(trial);
        this.callback_adaptive_procedure(trial);
    }
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }

    callback_score_response =function(data){
        //d4,d5
        let score=0;
        for (let i=0;i<data.responses.length;i++)
        {
            let choice=data.responses[i].button;
            var stid=data.stimulus[choice];
            if (stid==2 || stid==3 || stid==4) score++;
        }
        return score;
    }

    callback_feedback_audio_index(stimulus,responses){ //0: true, 1:false
        var data=jsPsych.timelineVariable('data',true);    
        let score=0;let aid=1; //false
        const choice=responses[responses.length-1].button;
        var stid=stimulus[choice];
        if(stid==stimulus[stimulus.length-1]) return null;
        if (stid==2 || stid==3 || stid==4) score++;
        if(score>0) aid=0;    
        return aid;
    }
}
