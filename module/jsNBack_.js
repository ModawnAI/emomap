class jsNBack extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='nback';
        if(taskID===null) this.taskID='nback'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.how_many_back = 2;
        this.nickname='전전맞추기';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=10;
        this.sequence_length=20;
    }
    set_mode(mode){this.task_trial.set_mode(mode);}
    create_task_trial(stimuli=null) {
        this.task_trial=new jsNBackTrial('trial',this);
        if(stimuli!==null) this.stimuli_set=stimuli;
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    callback_get_debrief(){
        return this.get_debrief_type('nback');
    }
}

class jsNBackTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='nback';
        this.stimulus_type='image'; //image, numbers, html
        this.sampling_weights=[1,2];
        this.stimulus_duration=1000;
        this.trial_duration=2000;
        this.post_trial_gap=0;
        this.response_ends_trial=false;
        this.poststimulus='fixation';
        this.fixation_size=50;
        this.stimulus_height=200;
        this.mode='temporal'; //spatial
        this.response_choices=["불일치", "일치"];
        this.sequence_random=true;
        this.set_default()
    }
    set_default(){
        this.keyboard_choices=['j','k'];//['leftarrow','rightarrow'] //: left 37, 'rightarrow': 39,
        if(this.mode==='temporal') {
            this.stimuli_set=['img/S1.png','img/S2.png','img/S3.png','img/S4.png','img/S5.png','img/S6.png','img/S7.png','img/S8.png'];
        }
        else if(this.mode==='spatial'){
            this.stimuli_set=['img/S1.png'];
            this.stimulus_nrow=3;
            this.stimulus_ncol=3;
            this.stimulus_type='complex';
            this.ctask.type='snback';        
        }
    }
    set_mode(mode){
        this.mode=mode;
        if(this.mode==='spatial'){
            this.stimuli_set=['img/S1.png'];
            this.stimulus_nrow=3;
            this.stimulus_ncol=3;
            this.stimulus_type='complex';
            this.ctask.type='snback';        
        }
    }

    init(){ //task specific
        super.init()
        if(this.mode==='temporal') {
            if(typeof sequence_ext!=='undefined') {
                if(sequence_ext.length>0) {
                    this.ctask.sequence_data=sequence_ext;
                    let sequence=[];
                    for(let i=0;i<sequence_ext.length;i++) sequence.push(this.ctask.sequence_data[i].stimulus);
                    let stimuli_set=jsFunc.unique(sequence,true);
                    this.sequence_random=false;
                    this.ctask.sequence_length=this.ctask.sequence_data.length;
                    sequence=[];
                    stimuli_set.forEach((element,i)=> stimuli_set[i]=this.ctask.localpath+element );
                    this.ctask.preload_images=this.ctask.preload_images.concat(stimuli_set);
                }                
            }
            this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
            this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        } else if(this.mode==='spatial'){
            const stimuli_img=this.ctask.localpath+this.stimuli_set[0];
            this.ctask.preload_images=this.ctask.preload_images.concat(stimuli_img);

            var ct=0; let ct1=0;this.stimuli_set=jsFunc.create_array(8, 2)
            for(var i=0;i<this.stimulus_nrow;i++) {
                for(var j=0;j<this.stimulus_ncol;j++) {
                    if(i==1 && j==1) {
                        ct=ct+1;
                        continue;
                    }
                    this.stimuli_set[ct1][0]=stimuli_img;
                    this.stimuli_set[ct1][1]=ct;
                    ct=ct+1;ct1=ct1+1;
                }
            }             
        } else {
            this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
            this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        }       
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
        let task_condition = [exp.TARGET,exp.NONTARGET]
        let sampling_method={ //unnecessary but reference
            type: 'with-replacement',
            size: sequence_length,
            weights: sampling_weights,
        }
        var task_trial_sequence=[];
        var order = [];for(var i=0; i<task_condition.length; i++){order.push(i);}
        order = jsPsych.randomization.sampleWithReplacement(order, sequence_length, sampling_weights);
        //for the first trials, we do not want to assign 2 back target
        let ct=0;
        for (let i=0;i<this.ctask.how_many_back;i++) if(order[i]==0) {ct=ct+1; order[i]=1;}
        let idx=[]; for(let j=this.ctask.how_many_back;j<order.length;j++) { if(order[j]==1) idx.push(j);}
        idx=jsPsych.randomization.sampleWithoutReplacement(idx, ct);
        for (let i=0;i<ct;i++) order[idx[i]]=0;
        //

        this.ctask.sequence=[];
        for (let i=0;i<sequence_length;i++)
        {
            var stype=task_condition[order[i]];
            var a=new Object(); var d=new Object();
            a.stimulus=this.get_stimulus_random(stype);
            d.stim_type=stype;
            d.correct_response=stype==exp.TARGET ? 1:0;
            d.stim_id=this.stimuli_set.indexOf(a.stimulus);
            a.data=d;
            task_trial_sequence.push(a);
        }
        this.ctask.sequence=[];
        return task_trial_sequence;
    }

    setup_ordered_sequence(){
        this.ctask.task_trial_sequence = [];
        for (var i=0;i<this.ctask.sequence_length;i++)
        {
            var a=new Object(); var d=new Object();
            a.stimulus=this.ctask.localpath+'img/' + this.ctask.sequence_data[i].stimulus + '.png';
            d.stim_type=this.ctask.sequence_data[i].stim_type;
            d.correct_response=this.ctask.sequence_data[i].correct_response;
            d.stim_id=this.stimuli_set.indexOf(a.stimulus);
            d.stimulus=this.ctask.sequence_data[i].stimulus;
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
    }
    get_stimulus_random(stype){ //jsTrial
        let img;
        if(this.ctask.sequence.length < this.ctask.how_many_back){
            img = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set, 1)[0];
        } else {
            let preseq2=null,preseq1=null,preseqt=null;
            if (this.ctask.sequence.length >= this.ctask.how_many_back) preseqt=this.ctask.sequence[this.ctask.sequence.length - this.ctask.how_many_back];
            if (this.ctask.sequence.length >= 2) preseq2=this.ctask.sequence[this.ctask.sequence.length - 2];
            if (this.ctask.sequence.length >= 1) preseq1=this.ctask.sequence[this.ctask.sequence.length - 1];
            if(stype == exp.TARGET){
                img = preseqt;
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
                        img = posstim[0];
                    } else if(posstim1 != preseq2 && posstim1 != preseq1){
                        img = posstim[1];
                    } else if(posstim2 != preseq2 && posstim2 != preseq1){
                        img = posstim[2];
                    } else if(posstim0 != preseq2) img = posstim[0];
                    else img = posstim[1];
                } else {
                    if(posstim0 != preseq1){
                        img = posstim[0];
                    } else if(posstim1 != preseq1){
                        img = posstim[1];
                    } else if(posstim2 != preseq1){
                        img = posstim[2];
                    } else img = posstim[1];
                }
            }
        }
        this.ctask.sequence.push(img);
        return img;
    }

    callback_trial_stimulus(){
        let img=jsPsych.timelineVariable('stimulus',true);
        if(this.stimuli_distractor!==null && this.distractor_type=='image'){
            let dimg = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_distractor, 1)[0];
            img=[img,dimg];
            let dwidth=100; let dheight=100;
            let trial=jsPsych.currentTrial(); let x,y;
            trial.stimulus_height=[trial.stimulus_height,dwidth];
            trial.stimulus_width=[trial.stimulus_width,dheight];
            //let brect=document.body.getBoundingClientRect();
            let rect=jsPsych.getDisplayElement().getBoundingClientRect();
            //jsPsych.getDisplayElement().style.border="1px solid black"
            let wwidth=jsPsych.getDisplayElement().clientHeight;
            let wheight=jsPsych.getDisplayElement().clientWidth
            const centerx = window.innerWidth / 2;//rect.left+rect.width/2;//let b=window.innerWidth / 2;
            const centery = window.innerHeight / 2;// rect.top + rect.height/2; //let a=window.innerHeight / 2;
            if(this.distractor_position===null){
                x=(Math.random()-0.5)*wwidth*0.8;
                y=(Math.random()-0.5)*wheight*0.8
            }else{
                let n=this.distractor_position.length;
                let pos = this.distractor_position[jsFunc.randidx(n)];
                x=pos[0]*wwidth-dwidth/2;y=pos[1]*wheight-dheight/2;
            }
            trial.stimulus_positionx=[trial.stimulus_positionx,centerx+x];
            trial.stimulus_positiony=[trial.stimulus_positiony,centery-y];
        }
        return img;
    }

    callback_stimulus_audio(){
        if(this.stimuli_distractor!==null && this.distractor_type=='audio'){
            return jsPsych.randomization.sampleWithoutReplacement(this.stimuli_distractor, 1)[0];
        }
        else return uxm.sound_stimulus_presented;
    }
    callback_response_audio(){ return uxm.sound_button_press; }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); }
    callback_score_response(data){
        data.correct=data.button_pressed == data.correct_response ? true: false;
        var score=data.correct ? 1:0;
        if(data.correct && data.button_pressed==1) score=2;
        return score;
    }
}
