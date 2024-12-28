class jsCXSpan extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='CXSpan';
        if(taskID===null) this.taskID='CXSpan'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='복합순서기억';
    }
    create_pre_tasktrial(){
        this.stimuli_set=[];
        for(let i=1;i<49;i++) this.stimuli_set.push('img/symm'+i+'.png');
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.localpath+element );
        this.preload_images=this.preload_images.concat(this.stimuli_set);

        let pre_test_trial = { //owner
            type: "unified-button-response",
            taskID:this.taskID,
            stimulus_type: "image",
            guide_image:uxm.guide_image,
            stimulus: function(){
                let img=jsPsych.timelineVariable('prestimulus',true);
                console.log('pre:'+img+' at '+jsPsych.currentTimelineNodeID())
                return img;
            },
            button_html: uxm.yes_no_buttons,
            choices: ['예','아니오'],
            post_trial_gap: 1000,
            on_finish: function (data) { 
                var score=0;data.correct=false;
                let pre_correct_response=0;
                let id=parseInt(data.stimulus.slice(-5,-4));
                if(id>24) pre_correct_response=1;
                if (pre_correct_response==data.button_pressed) score++;
                if(score>0) data.correct=true;
            },
        };
        super.set_pre_tasktrial(pre_test_trial);
    }

    create_pre_tasktrial1(){
        var pretrial=new jsPreTrial('pretrial',this);
        pretrial.ctask=this;
        pretrial.setup();
        pretrial.compile();
        
        pretrial.trial.stimulus=pretrial.callback_trial_stimulus;
        super.set_pre_tasktrial(pretrial.trial);
    }

    create_task_trial() {
        this.task_trial=new jsCXSpanTrial('trial',this);
    }

    set_task_trial(trial){
        super.set_task_trial();
    }
    setup(){
        this.create_pre_tasktrial();
        super.setup();
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

class jsCXSpanTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='CXSpan-v10';
        this.stimulus_type='grid-numbers'; //image, numbers, html,complex, 'grid-numbers' 
        this.stimulus_duration=1000;
        this.trial_duration=6000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;  

        this.button_stimulus_mode=true;        
        this.wait_duration_after_multiresponses=1000;
        this.mark_responded_button=true;
        this.stimulus_height=30;
        this.stimulus_width=40;
        this.max_response_count=4;
        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.stimulus_nrow=4;
        this.stimulus_ncol=4;
        this.prompt='<p class="font-message">첫번째 두개의 위치를 선택하세요</p>';
    }

    init(){ //task specific initialization
        this.response_choices=['지우기'];
        this.stimuli_isi=[];
        this.stimulus_isi=500;
        this.number_random_sequence=4;

        this.stimuli_set=[];
        for(let i=1;i<49;i++) this.stimuli_set.push('img/symm'+i+'.png');
    }

    setup(){
        this.init();   
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        this.ctask.task_trial_sequence = [];
        this.max_response_count=this.number_random_sequence;

        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var stim=[];for (var j=0;j<nbut;j++) stim.push(j);

        let img; let stimtype=false;  let ct=0;
        let stim1=[];for (let j=0;j<this.stimuli_set.length;j++) stim1.push(j); let cr=0;
        let ridx=jsPsych.randomization.sampleWithoutReplacement(stim1, this.ctask.sequence_length); 


        for (var i=0;i<this.ctask.sequence_length;i++)
        {
            var idx=jsPsych.randomization.sampleWithoutReplacement(stim, this.number_random_sequence); 
            this.stimuli_isi=[];for (let i=0;i<this.number_random_sequence;i++) this.stimuli_isi[i]=this.stimulus_isi;
            var a=new Object(); var d=new Object();
            a.stimulus=idx;
            a.stimuli_isi=this.stimuli_isi;
            d.stim_id=idx;
            d.correct_response=idx;

            if(ridx[i]<24) {stimtype=exp.CONGRUENT;cr=0;}
            else {stimtype=exp.INCONGRUENT;cr=1;}
            img=this.stimuli_set[ridx[i]];
            let dstim=jsFunc.get_filename(img);
            a.prestimulus=img;

            d.pre_stim_type=stimtype;
            d.pre_correct_response=cr;
            d.pre_stim_id=ridx[i];
            d.pre_stimulus=dstim;

            a.data=d;    

            this.ctask.task_trial_sequence.push(a);
        }
        super.setup();   
    }
 
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
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
