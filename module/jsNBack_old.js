class jsNBack extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='NBack';
        if(taskID===null) this.taskID='NBack'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.how_many_back = 2;
        this.nickname='전전맞추기';
    }
    set_mode(mode){this.task_trial.mode=mode;}
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
        this.type='NBack';
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
        this.response_choices=["일치", "불일치"]; 
        this.sequence_random=true;

    }
    init(){ //task specific

        if(this.mode==='temporal')
        {
            if(typeof sequence_ext!=="undefined") 
            {
                this.sequence_data=sequence_ext;
                this.stimuli_set=[...new Set(sequence_ext)];
                this.sequence_random=false;                
            }
            if(this.stimuli_set===null) this.stimuli_set=['img/S1.png','img/S2.png','img/S3.png','img/S4.png','img/S5.png','img/S6.png','img/S7.png','img/S8.png'];
            this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
            this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        }
        else if(this.mode==='spatial'){
            this.stimuli_set=['img/S1.png'];                       
            this.stimulus_nrow=3;
            this.stimulus_ncol=3;  
            this.stimulus_type='complex'; 
        }
    }

    setup(){           
        this.init();   
        if(this.mode==='spatial'){ 
            this.ctask.type='SNBack';
            // Spatial locationi //
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
        };
        if(this.sequence_random) {

            this.ctask.task_trial_sequence = [
                {stim_type: exp.TARGET},
                {stim_type: exp.NONTARGET}
            ]
            this.ctask.pretest_sampling_method={
                type: 'with-replacement',
                size: this.ctask.pretest_sequence_length,
                weights: this.sampling_weights,
            };
            
            this.ctask.sampling_method={
                type: 'with-replacement',
                size: this.ctask.sequence_length,
                weights: this.sampling_weights,
            };
/*
            for (var i=0;i<this.ctask.sequence_length;i++)
            {
                var a=new Object(); var d=new Object();
                a.stimulus=this.callback_trial_stimulus_random1();
                d.stim_type=this.ctask.sequence_data[i].stim_type;
                d.correct_response=this.ctask.sequence_data[i].correct_response;
                d.stim_id=-1;
                a.data=d;    
                this.ctask.task_trial_sequence.push(a);
            }
*/
        } else {            
            this.ctask.task_trial_sequence = [];
            this.ctask.sequence_length=this.ctask.sequence_data.length;
            for (var i=0;i<this.ctask.sequence_length;i++)
            {
                var a=new Object(); var d=new Object();
                a.stimulus=this.ctask.localpath+this.ctask.sequence_data[i].stimulus;
                d.stim_type=this.ctask.sequence_data[i].stim_type;
                d.correct_response=this.ctask.sequence_data[i].correct_response;
                d.stim_id=-1;
                a.data=d;    
                this.ctask.task_trial_sequence.push(a);
            }
        }
        super.setup();   
    }

    callback_trial_stimulus(){ 
        let img;
        if(this.sequence_random) img= this.callback_trial_stimulus_random();
        else img=jsPsych.timelineVariable('stimulus',true);

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
            }
            else{
                let n=this.distractor_position.length;
                let pos = this.distractor_position[jsFunc.randidx(n)];
                x=pos[0]*wwidth-dwidth/2;y=pos[1]*wheight-dheight/2;
            }

            trial.stimulus_positionx=[trial.stimulus_positionx,centerx+x];
            trial.stimulus_positiony=[trial.stimulus_positiony,centery-y];
        }
        return img;
    }
    
    callback_trial_stimulus_random1(){ //jsTrial
        let img;
        if(this.ctask.sequence.length < this.ctask.how_many_back){
            img = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set, 1)[0];
        } else {
            let preseq2=this.ctask.sequence[this.ctask.sequence.length - this.ctask.how_many_back];
            let preseq1=this.ctask.sequence[this.ctask.sequence.length - 1];
            if(this.mode==='spatial'){
            }
            else{
                if(typeof preseq2!=='string') preseq2=preseq2[0];
                if(typeof preseq1!=='string') preseq1=preseq1[0];
            }            
            if(jsPsych.timelineVariable('stim_type',true) == exp.TARGET){
                img = preseq2;
            } else {
                let posstim = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set, 3);
                if(this.mode==='spatial'){
                    if(posstim[0][1] != preseq2[1] && posstim[0][1] != preseq1[1]){
                        img = posstim[0];
                    } else if(posstim[1][1] != preseq2[1] && posstim[1][1] != preseq1[1]){
                        img = posstim[1];
                    } else if(posstim[2][1] != preseq2[1] && posstim[2][1] != preseq1[1]){
                        img = posstim[2];
                    } else if(posstim[0][1] != preseq2[1]) img = posstim[0][0];
                    else img = posstim[1];    
                } else {
                    if(posstim[0] != preseq2 && posstim[0] != preseq1){
                        img = posstim[0];
                    } else if(posstim[1] != preseq2 && posstim[1] != preseq1){
                        img = posstim[1];
                    } else if(posstim[2] != preseq2 && posstim[2] != preseq1){
                        img = posstim[2];
                    } else if(posstim[0] != preseq2) img = posstim[0];
                    else img = posstim[1];    
                }        
            }
        }        
        return img;
    }


    callback_trial_stimulus_random(){ //jsTrial
        let img;
        if(this.ctask.sequence.length < this.ctask.how_many_back){
            img = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set, 1)[0];
        } else {
            let preseq2=this.ctask.sequence[this.ctask.sequence.length - this.ctask.how_many_back];
            let preseq1=this.ctask.sequence[this.ctask.sequence.length - 1];
            if(this.mode==='spatial'){
            }
            else{
                if(typeof preseq2!=='string') preseq2=preseq2[0];
                if(typeof preseq1!=='string') preseq1=preseq1[0];
            }            
            if(jsPsych.timelineVariable('stim_type',true) == exp.TARGET){
                img = preseq2;
            } else {
                let posstim = jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set, 3);
                if(this.mode==='spatial'){
                    if(posstim[0][1] != preseq2[1] && posstim[0][1] != preseq1[1]){
                        img = posstim[0];
                    } else if(posstim[1][1] != preseq2[1] && posstim[1][1] != preseq1[1]){
                        img = posstim[1];
                    } else if(posstim[2][1] != preseq2[1] && posstim[2][1] != preseq1[1]){
                        img = posstim[2];
                    } else if(posstim[0][1] != preseq2[1]) img = posstim[0][0];
                    else img = posstim[1];    
                } else {
                    if(posstim[0] != preseq2 && posstim[0] != preseq1){
                        img = posstim[0];
                    } else if(posstim[1] != preseq2 && posstim[1] != preseq1){
                        img = posstim[1];
                    } else if(posstim[2] != preseq2 && posstim[2] != preseq1){
                        img = posstim[2];
                    } else if(posstim[0] != preseq2) img = posstim[0];
                    else img = posstim[1];    
                }        
            }
        }        
        return img;
    }
   
    callback_trial_data(){
        let id=this.stimuli_set.indexOf(this.ctask.sequence[this.ctask.sequence.length-1]);
        let d= {
            stim_type: jsPsych.timelineVariable('stim_type'),
            stim_id: id,
            stimulus:jsFunc.get_filename(this.stimuli_set[id]),
        }
        return d;
    } 

    callback_trial_data1(){
        let id=this.stimuli_set.indexOf(this.ctask.sequence[this.ctask.sequence.length-1]);
        let d= {
            stim_type: jsPsych.timelineVariable('stim_type'),
            stim_id: id,
            stimulus:jsFunc.get_filename(this.stimuli_set[id]),
        }
        return d;
    } 

    callback_stimulus_audio(){  
        if(this.stimuli_distractor!==null && this.distractor_type=='audio'){
            return jsPsych.randomization.sampleWithoutReplacement(this.stimuli_distractor, 1)[0];    
        }
        else return uxm.sound_stimulus_presented; 
    }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_score_response(data){
        let correct=false;data.correct_response=0;  
        if(data.stim_type == exp.TARGET){
            correct = data.button_pressed == 0;     
            data.correct_response=1;
        } else { //unstim_type
            correct = data.button_pressed == 1;  
            data.correct_response=2;       
        }
        data.correct=correct;    
        var score=correct ? 1:0;
        if(correct && data.stim_type==exp.TARGET) score=2;
        return score;
    }
}
