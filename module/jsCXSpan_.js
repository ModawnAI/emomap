class jsCXSpan extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='CXSpan';
        if(taskID===null) this.taskID='CXSpan'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='복합순서기억';
    }

    create_task_trial() {
        this.task_trial=new jsCXSpanTrial('trial',this);
    }

    set_task_trial(trial){
        super.set_task_trial(trial);
    }
    setup(){
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
        var ntot = jsPsych.data.get().select('score').count();
        var score = jsPsych.data.get().select('score').sum();
        let html = "%GUIDE%"+
        "잘하셨습니다!<br>"+
        "총 "+ntot+ "회 시행하여<br>"+
        "당신의 점수는 "+ score+"점 입니다.<br>"+
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
        this.trial_duration=10000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;  

        this.button_stimulus_mode=true;        
        this.wait_duration_after_multiresponses=1000;
        this.mark_responded_button=true;
        this.stimulus_height=30;
        this.stimulus_width=40;
        this.number_random_sequence=4;
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

        let img; let stimtype=false;  
        let stim1=[];for (let j=0;j<this.stimuli_set.length;j++) stim1.push(j); let cr=0;        //
        for (var i=0;i<this.ctask.sequence_length;i++)
        {
            var idx=jsPsych.randomization.sampleWithoutReplacement(stim, this.number_random_sequence); 
            this.stimuli_isi=[];for (let i=0;i<this.number_random_sequence;i++) this.stimuli_isi[i]=this.stimulus_isi;
            var a=new Object(); var d=new Object();
            a.stimulus=idx;
            a.stimuli_isi=this.stimuli_isi;
            d.stim_id=idx;
            d.correct_response=idx;

            let ridx=jsPsych.randomization.sampleWithoutReplacement(stim1, this.number_random_sequence); 
            a.prestimulus=[];d.pre_stimulus=[];d.pre_stim_type=[];d.pre_correct_response=[];
            for(let j=0;j<this.number_random_sequence;j++){
                if(ridx[j]<24) {stimtype=exp.CONGRUENT;cr=0;}
                else {stimtype=exp.INCONGRUENT;cr=1;}
                img=this.stimuli_set[ridx[j]];a.prestimulus.push(img);
                let dstim=jsFunc.get_filename(img);d.pre_stimulus.push(dstim);
                d.pre_stim_type.push(stimtype);
                d.pre_correct_response.push(cr);
            }
            d.pre_stim_id=ridx;
            a.data=d;    
            this.ctask.task_trial_sequence.push(a); 
        }
        this.stimuli_set=[];
        for(let i=1;i<49;i++) this.stimuli_set.push('img/symm'+i+'.png');
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        super.setup();   
    }

    compile(){
        let task_trials=[];
        for (let i=0;i<this.max_response_count;i++){
            let ptrial=this.create_pre_tasktrial();
            ptrial.taskID=i;
            
            let trial=this.create_main_tasktrial();
            trial.taskID=i;
            task_trials.push(trial);
            task_trials.push(ptrial);
        }   
        let rtrial=this.create_response_tasktrial();
        exp.add_task(rtrial);
        task_trials.push(rtrial);  
        let test_sequence = {
            timeline: task_trials,
            timeline_variables: this.ctask.task_trial_sequence,
        };
        this.trial=test_sequence;
        this.trial.tasktrial=rtrial;        
    }

    create_pre_tasktrial(){     
        let pre_test_trial = { //owner
            type: "unified-button-response",
            stimulus_type: "image",
            guide_image:uxm.guide_image,
            stimulus: function(){
                let img=jsPsych.timelineVariable('prestimulus',true);
                console.log('pre:'+img+' at '+jsPsych.currentTimelineNodeID())            
                return img[jsPsych.currentTrial().taskID];
            },
            button_html: uxm.sym_asym_buttons,
            choices: ['대칭','비대칭'],
            post_trial_gap: 1000,
            response_audio: uxm.sound_button_press,   
            on_finish: function (data) { 
                var score=0;data.correct=false;
                let pre_correct_response=0;
                let a=data.stimulus.slice(-6,-4); 
                if(a[0]<'0' || a[0]>'9') { //only numeric
                    a=a.slice(1, a.length);
                }
                let id=parseInt(a);
                if(id>24) pre_correct_response=1;
                if (pre_correct_response==data.button_pressed) score++;
                if(score>0) data.correct=true;                
            },
        };
        this.ctask.preload_images=this.ctask.preload_images.concat(this.image_button_symmetric,this.image_button_asymmetric);
        return pre_test_trial;
    }
    create_main_tasktrial(){
        this.stimuli_set=[];
        for(let i=1;i<49;i++) this.stimuli_set.push('img/symm'+i+'.png');
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        let test_trial = { //owner
            type: "unified-button-response",
            button_stimulus_mode:false,
            stimulus_width:30,
            stimulus_height:30,
            stimulus_type: "grid",
            trial_duration:1000,
            stimuli_isi:[],
            stimulus_nrow:this.stimulus_nrow,
            stimulus_ncol:this.stimulus_ncol,
            button_html:[],
            stimulus_audio: uxm.sound_stimulus_presented,
            stimulus: function(){
                let num=jsPsych.timelineVariable('stimulus',true);
                console.log('pre:'+num+' at '+jsPsych.currentTimelineNodeID())
                //return jsFunc.randidx(15);
                return num[jsPsych.currentTrial().taskID];
            },
        };     
        return test_trial;
    }
    create_response_tasktrial(){
        this.stimuli_set=[];
        for(let i=1;i<49;i++) this.stimuli_set.push('img/symm'+i+'.png');
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        this.stimuli_isi=[];//for(let i=0;i<this.max_response_count;i++) this.stimuli_isi.push(NaN);
        let test_trial = { //owner
            type: "unified-button-response",
            button_stimulus_mode:true,
            stimulus_width:30,
            stimulus_height:30,
            taskID:this.ctask.taskID,
            stimulus_type: "grid-numbers",
            trial_duration:20000,
            stimuli_isi:this.stimuli_isi,
            mark_responded_button:true,
            stimulus_nrow:this.stimulus_nrow,
            stimulus_ncol:this.stimulus_ncol,
            max_response_count:this.max_response_count,
            choices:['지우기','수락'],
            feedback_audios: this.feedback_audios,
            post_trial_gap: 1000,
            stimulus: function(){
                //let num= jsPsych.timelineVariable('stimulus',true);
                //console.log('pre:'+num+' at '+jsPsych.currentTimelineNodeID())
                return null;
            },  
            on_finish: function (data) { //unified_button_response                
                var ctask=exp.getTask(jsPsych.currentTrial().taskID);
                var ctrial=ctask.task_trial;
                ctrial.score = ctrial.callback_score_response(data);
                ctrial.callback_update_response_data(data);
                
                ctask.score = ctask.score + exp.ctask.task_trial.score;
 
                ctask.trial_count++; 
                var svar = "score:" + ctask.score;
                ctask.score_display();
                console.log('=== ctrial:'+ctask.taskID+" was finished with score:"+svar + " progress:" + ctask.trial_count);    
            },
            stimulus_audio: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_stimulus_audio();
                else return null;
            },
            response_audio: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_response_audio();
                else return null;
            }, 
            data: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_trial_data();
                else return null;
            },
   
            stimulus_audio: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_stimulus_audio();
                else return null;
            },
            response_audio: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_response_audio();
                else return null;
            },   
            feedback_audio_index: function(stimulus,responses) { 
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_feedback_audio_index(stimulus,responses); 
                else return null;
            },          
        };   
        return test_trial;
    }  

    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }

    callback_score_response =function(data){
        var score=0;data.correct=false;
        if(typeof data.responses=="undefined") return score;
        for(var i=0;i<data.responses.length;i++) {
            if (data.correct_response[i]==parseInt(data.responses[i].button)) score++;
        }
        if(data.responses.length==score)  data.correct=true;
        return score;
    }

    callback_feedback_audio_index(stimulus,responses){
        var data=jsPsych.timelineVariable('data',true);    
        var score=0;var aid=1;
        for(var i=0;i<responses.length;i++) {
            if (data.correct_response[i]==parseInt(responses[i].button)) score++;
        }
        if(score==responses.length) aid=0;    
        return aid;
    }
    callback_update_response_data(data)
    {
        data.score=this.score;
        data.phase=this.ctask.phasemode;
        data.start_time=this.trial_start_time;
        var responsestr='';
        if(data.hasOwnProperty('responses')) {
            for(var i=0;i<data.responses.length;i++) {
            if(i==data.responses.length-1) responsestr+=data.responses[i].button+':'+Math.round(data.responses[i].rt);
            else responsestr+=data.responses[i].button+':'+Math.round(data.responses[i].rt)+',';
            }
        }
        data.multi_responses=responsestr;
        data.response=data.button_pressed;
        data.session=this.nsession;

        if(data.hasOwnProperty('correct_response')) {
            if(Array.isArray(data.correct_response)){
                data.correct_response=jsFunc.array2csv(data.correct_response);
            }
        }
        this.ctask.responses.push(data); // 
    }
}
