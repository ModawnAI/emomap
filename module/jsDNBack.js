class jsDNBack extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='dnback';
        if(taskID===null) this.taskID='dnback'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.how_many_back = 2;
        this.nickname='전전맞추기';
        this.sequence2=[];
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=10;
        this.sequence_length=20;
    }
    set_mode(mode){this.task_trial.mode=mode;}
    create_task_trial(stimuli=null) {
        this.task_trial=new jsDNBackTrial('trial',this);
        if(stimuli!==null) this.stimuli_set=stimuli;
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    evaluate_performance(targetcode,nontargetcode)
    {
        let trial_sequence = jsPsych.data.get().filter({phase: 'test'}).last(this.sequence_length); 
        let result={};let sdata,cdata;

        result.total_count=trial_sequence.count();
        if(result.total_count>0){
            result.total_rt_mean = trial_sequence.select('rt').mean();
            result.total_rt_sd = trial_sequence.select('rt').sd();
            result.total_score = trial_sequence.select('score').sum();
        } else {
            result.total_rt_mean=null;
            result.total_rt_sd=null;
            result.total_score=null;
        }
        result.total_unresponded_count=trial_sequence.filter({button_pressed:undefined,}).count();

        /*
        var too_long = jsPsych.data.get().filterCustom(function(trial){
            return trial.rt > 2000;
        }).count()
        */

        sdata = trial_sequence.filterCustom(function(trial){
            return trial.correct_response==nontargetcode ? false:true;
        })
        result.target_count = sdata.count();
        if(result.target_count>0){
            result.target_rt_mean = sdata.select('rt').mean();
            result.target_rt_sd = sdata.select('rt').sd();
        } else {
            result.target_rt_mean=null;
            result.target_rt_sd=null;
        }
        result.target_unresponded_count=sdata.filter({button_pressed:undefined,}).count();

        cdata=sdata.filter({correct:true,});
        result.target_correct_count = cdata.count();
        if(result.target_correct_count>0){
            result.target_correct_rt_mean = cdata.select('rt').mean();
            result.target_correct_rt_sd = cdata.select('rt').sd();
        } else {
            result.target_correct_rt_mean=null;
            result.target_correct_rt_sd=null;
        }
        cdata=sdata.filter({correct:false,});
        result.target_incorrect_count = cdata.count();
        if(result.target_incorrect_count>0){
            result.target_incorrect_rt_mean = cdata.select('rt').mean();
            result.target_incorrect_rt_sd = cdata.select('rt').sd();
        } else {
            result.target_incorrect_rt_mean=null;
            result.target_incorrect_rt_sd=null;
        }
        
        sdata=trial_sequence.filter({correct_response:nontargetcode}); //
        result.nontarget_count = sdata.count();
        if(result.nontarget_count>0){
            result.nontarget_rt_mean = sdata.select('rt').mean();
            result.nontarget_rt_sd = sdata.select('rt').sd();
        } else {
            result.nontarget_rt_mean=null;
            result.nontarget_rt_sd=null;
        }
        result.nontarget_unresponded_count=sdata.filter({button_pressed:undefined,}).count();
        cdata=sdata.filter({correct:true,});
        result.nontarget_correct_count = cdata.count();
        result.nontarget_correct_rt_mean=null;
        result.nontarget_correct_rt_sd=null;

        cdata=sdata.filter({correct:false,});
        result.nontarget_incorrect_count = cdata.count();
        if(result.nontarget_incorrect_count>0){
            result.nontarget_incorrect_rt_mean = cdata.select('rt').mean();
            result.nontarget_incorrect_rt_sd = cdata.select('rt').sd();
        } else {
            result.nontarget_incorrect_rt_mean=null;
            result.nontarget_incorrect_rt_sd=null;
        }

        result.accuracy=(result.target_correct_count+result.nontarget_correct_count)*100/(result.target_count+result.nontarget_count);
        result.sensitivity=result.target_correct_count*100/(result.target_correct_count+result.nontarget_incorrect_count);
        result.specificity=result.target_incorrect_count*100/(result.target_incorrect_count+result.nontarget_correct_count);    
        this.performance=result;
    }
    callback_get_debrief(){
        this.evaluate_performance(null,"");  
        var trial_sequence = jsPsych.data.get().filter({phase: 'test'}).last(this.sequence_length);
        var ntot=trial_sequence.values().length; 
        
        var html = "%GUIDE%"+"잘하셨습니다!<br>"+  
            "총 시행횟수 "+ntot+"중에<br>"+
            "당신은 "+ this.score+"점 입니다.<br>"+
            "다시 하시겠습니까?"

        return html;
    }
}

class jsDNBackTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='dnback';
        this.stimulus_type='image'; //image, numbers, html 
        this.sampling_weights=[1,2,2,4];
        this.stimulus_duration=1000;
        this.trial_duration=2500;
        this.post_trial_gap=0;
        this.response_ends_trial=false;
        this.poststimulus='fixation';        
        this.fixation_size=50;
        this.stimulus_height=200;
        this.mode='temporal'; //spatial
        this.response_choices=["불일치", "일치"]; 
        this.max_response_count=2;
        this.stimuli_set2=[];
        this.stim2type='audio';//background//spatial
        this.set_default()
    }
    set_default(){
        this.keyboard_choices=['j','k'];//['leftarrow','rightarrow'] //: left 37, 'rightarrow': 39,
        this.stimuli_set=['img/S1.png','img/S2.png','img/S3.png','img/S4.png','img/S5.png','img/S6.png'];
        
        this.stimuli_audio=['sound/ga.mp3','sound/na.mp3','sound/da.mp3','sound/ra.mp3','sound/ma.mp3','sound/ba.mp3','sound/sa.mp3','sound/aa.mp3'];
        this.stimuli_position=[0,1,2,3,5,6,7,8]
    }
    set_mode(mode){
        this.mode=mode;
        if(this.mode==='spatial'){
            this.stimulus_nrow=3;
            this.stimulus_ncol=3;
            this.stimulus_type='complex';
            this.ctask.type='snback';        
        }
    }
    init(){ //task specific

        if(this.stim2type=='audio') {                        
            this.stimuli_audio.forEach((element,i)=> this.stimuli_audio[i]=this.ctask.localpath+element );
            this.ctask.preload_audio=this.ctask.preload_audio.concat(this.stimuli_audio);
            this.stimuli_set2=this.stimuli_audio;
            this.response_choices=[`${uxm.imagepath}button/obj4.png`,`${uxm.imagepath}button/obj6.png`]
        } else if(this.stim2type=='spatial') {
            this.ctask.type='sdnack';
            this.stimulus_nrow=3;
            this.stimulus_ncol=3;
            this.stimulus_type='complex';
            this.ctask.type='snback';        
            this.stimuli_set2=this.stimuli_position;
            this.response_choices=[`${uxm.imagepath}button/obj3.png`,`${uxm.imagepath}button/obj8.png`]
        }
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);    
        this.ctask.preload_images=this.ctask.preload_images.concat(this.response_choices);              
    }

    setup(){           
        this.init();
        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_sequence_length);
        if(this.sequence_random) {
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
        } else {
            this.setup_ordered_sequence();
        }
        super.setup();
    }
    setup_random_sequence(sequence_length,sampling_weights=this.sampling_weights){
        let task_condition = [
            {stim_type: [exp.TARGET,exp.TARGET]},
            {stim_type: [exp.TARGET,exp.NONTARGET]},
            {stim_type: [exp.NONTARGET,exp.TARGET]},
            {stim_type: [exp.NONTARGET,exp.NONTARGET]},
        ]
        let sampling_method={ //unnecessary but reference
            type: 'with-replacement',
            size: sequence_length,
            weights: sampling_weights,
        }
        var task_trial_sequence=[];
        var order = [];for(var i=0; i<task_condition.length; i++){order.push(i);}
        order = jsPsych.randomization.sampleWithReplacement(order, sequence_length, sampling_weights);
        //for the first trials, we do not want to assign 2 back target
        let iidx=[];
        for (let i=0;i<this.ctask.how_many_back;i++) if(order[i]<3) {iidx.push(i);}
        let idx=[]; for(let j=this.ctask.how_many_back;j<order.length;j++) { if(order[j]==3) idx.push(j);}
        idx=jsPsych.randomization.sampleWithoutReplacement(idx, iidx.length);
        for (let i=0;i<iidx.length;i++) { let a=order[iidx[i]]; order[iidx[i]]=3;order[idx[i]]=a;}
        //

        this.ctask.sequence=[];
        for (let i=0;i<sequence_length;i++)
        {
            var stype=task_condition[order[i]].stim_type;
            var a=new Object(); var d=new Object();
            let obj1=this.get_stimulus_random(stype[0]);
            d.stim_type=stype;
            d.correct_response=[]
            if(stype[0]==exp.TARGET) d.correct_response.push(0);
            if(stype[1]==exp.TARGET) d.correct_response.push(1);
            if(this.stim2type=='audio') {
                a.stimulus=obj1; 
                let obj2=this.get_stimulus_random2(stype[1]);
                a.audio=obj2;
                d.stim_id=[this.stimuli_set.indexOf(obj1),this.stimuli_set2.indexOf(obj2)];
                d.stimulus=jsFunc.get_filename(obj1) + ',' + jsFunc.get_filename(obj2);
            }
            else if(this.stim2type=='spatial') {
                
                let obj2=this.get_stimulus_random2(stype[1]);
                a.stimulus= [obj1,obj2];
                d.stim_id=[this.stimuli_set.indexOf(obj1),obj2];
                d.stimulus=jsFunc.get_filename(obj1) + ',' + obj2;
            }else {       
                a.stimulus=obj1; 
                let obj2=this.get_stimulus_random2(stype[1]);         
                a.stimulus2=obj2;
                d.stim_id=[this.stimuli_set.indexOf(obj1),this.stimuli_set2.indexOf(obj2)];
                d.stimulus=jsFunc.get_filename(obj1) + ',' + jsFunc.get_filename(obj2);
            }           
            
            a.data=d;
            task_trial_sequence.push(a);
        }
        this.ctask.sequence=[];this.ctask.sequence2=[];
        return task_trial_sequence;
    }

    setup_ordered_sequence(){

    }
    get_stimulus_random(stype){ //jsTrial
        let sobj;
        if(this.ctask.sequence.length < this.ctask.how_many_back){
            sobj = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set, 1)[0];
        } else {
            let preseq2=null,preseq1=null,preseqt=null;
            if (this.ctask.sequence.length >= this.ctask.how_many_back) preseqt=this.ctask.sequence[this.ctask.sequence.length - this.ctask.how_many_back];
            if (this.ctask.sequence.length >= 2) preseq2=this.ctask.sequence[this.ctask.sequence.length - 2];
            if (this.ctask.sequence.length >= 1) preseq1=this.ctask.sequence[this.ctask.sequence.length - 1];
            if(stype == exp.TARGET){
                sobj = preseqt;
            } else {
                let posstim = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set, 3);
                let posstim0,posstim1,posstim2;

                if(this.mode==='spatial'){
                    if(preseq1!==null) preseq1=preseq1[1];
                    if(preseq2!==null) preseq2=preseq2[1];
                    posstim0=posstim[0][1];posstim1=posstim[1][1];posstim2=posstim[2][1];
                }  
                else {
                    posstim0=posstim[0];posstim1=posstim[1];posstim2=posstim[2];
                }
                if(preseq2!=null){
                    if(posstim0 != preseq2 && posstim0 != preseq1){
                        sobj = posstim[0];
                    } else if(posstim1 != preseq2 && posstim1 != preseq1){
                        sobj = posstim[1];
                    } else if(posstim2 != preseq2 && posstim2 != preseq1){
                        sobj = posstim[2];
                    } else if(posstim0 != preseq2) sobj = posstim[0];
                    else sobj = posstim[1];
                } else {
                    if(posstim0 != preseq1){
                        sobj = posstim[0];
                    } else if(posstim1 != preseq1){
                        sobj = posstim[1];
                    } else if(posstim2 != preseq1){
                        sobj = posstim[2];
                    } else sobj = posstim[1];
                }
            }
        }
        this.ctask.sequence.push(sobj);
        return sobj;
    }
    get_stimulus_random2(stype){ //jsTrial
        let sobj;
        if(this.ctask.sequence2.length < this.ctask.how_many_back){
            sobj = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set2, 1)[0];
        } else {
            let preseq2=null,preseq1=null,preseqt=null;
            if (this.ctask.sequence2.length >= this.ctask.how_many_back) preseqt=this.ctask.sequence2[this.ctask.sequence2.length - this.ctask.how_many_back];
            if (this.ctask.sequence2.length >= 2) preseq2=this.ctask.sequence2[this.ctask.sequence2.length - 2];
            if (this.ctask.sequence2.length >= 1) preseq1=this.ctask.sequence2[this.ctask.sequence2.length - 1];
            if(stype == exp.TARGET){
                sobj = preseqt;
            } else {
                let posstim = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set2, 3);
                let posstim0,posstim1,posstim2;

                if(this.mode==='spatial'){
                    if(preseq1!==null) preseq1=preseq1[1];
                    if(preseq2!==null) preseq2=preseq2[1];
                    posstim0=posstim[0][1];posstim1=posstim[1][1];posstim2=posstim[2][1];
                }  
                else {
                    posstim0=posstim[0];posstim1=posstim[1];posstim2=posstim[2];
                }
                if(preseq2!=null){
                    if(posstim0 != preseq2 && posstim0 != preseq1){
                        sobj = posstim[0];
                    } else if(posstim1 != preseq2 && posstim1 != preseq1){
                        sobj = posstim[1];
                    } else if(posstim2 != preseq2 && posstim2 != preseq1){
                        sobj = posstim[2];
                    } else if(posstim0 != preseq2) sobj = posstim[0];
                    else sobj = posstim[1];
                } else {
                    if(posstim0 != preseq1){
                        sobj = posstim[0];
                    } else if(posstim1 != preseq1){
                        sobj = posstim[1];
                    } else if(posstim2 != preseq1){
                        sobj = posstim[2];
                    } else sobj = posstim[1];
                }
            }
        }
        this.ctask.sequence2.push(sobj);
        return sobj;
    }
    callback_trial_stimulus(){ //jsTrial
        return jsPsych.timelineVariable('stimulus',true);
    }
    
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); }

    callback_stimulus_audio(){  
        return jsPsych.timelineVariable('audio',true);
    }

    callback_response_audio(){  return uxm.sound_button_press; }
    callback_score_response(data){
        var score=0;data.correct=false;
        if(data.responses.length==0) {
            if(data.correct_response.length==0) {data.correct=true; score=1;}//안눌러야 할때 안눌러도 맞다고 함.
            return score;
        }
        for(let i=0;i<data.responses.length;i++) {
            let r=parseInt(data.responses[i].button);
            for(let j=0;j<data.correct_response.length;j++) if (data.correct_response[j]==r) score+=2;
        }
        if(score>0)  data.correct=true; //하나라도 맞으면 맞다고 함.
        return score;
    }
}
