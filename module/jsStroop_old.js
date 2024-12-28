class jsStroop extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='Stroop';
        if(taskID===null) this.taskID='Stroop'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='일치하니?';
    }
    create_task_trial() {
        this.task_trial=new jsStroopTrial('trial',this);
    }
    set_task_trial(trial){        
        super.set_task_trial(); //compile
    }
    callback_get_debrief(){
        return this.get_debrief_type('congruent');
    }
}

class jsStroopTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='Stroop-v10';
        this.stimulus_type='image'; //image, numbers, html 
        this.stimulus_duration=1000;
        this.trial_duration=3000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=false;
        this.poststimulus='fixation';        
        this.fixation_size=50;
        this.stimulus_height=200;
        this.sampling_weights=[];
    }

    init(){ //task specific initialization
        this.response_choices=['img/text_red.png','img/text_blue.png','img/text_green.png','img/text_yellow.png'];
        this.response_choices.forEach((element,i)=> this.response_choices[i]=this.ctask.localpath+element );
    }
    setup(){
        this.init();   
          
        let colors=['red','blue','green','yellow'];
        let texts=['red','blue','green','yellow', 'school', 'mind', 'next', 'friend'];
        let rulestr=['texts','colors'];

        let img; 
        this.ctask.task_trial_sequence =[]; var stimtype=false;  let ct=0;
        for(var j=0;j<texts.length;j++)
            for(var k=0;k<colors.length;k++)
            {
                img=this.ctask.localpath+'img/'+texts[j]+colors[k]+'.png';
                if(j==k) stimtype=exp.CONGRUENT;
                else if(j>3) stimtype=exp.NEUTRAL;
                else stimtype=exp.INCONGRUENT;
                let dstim=jsFunc.get_filename(img);
                var stim={stimulus:img,data:{stim_type: stimtype,correct_response:k, stim_id:ct,stimulus:dstim}};
                this.ctask.task_trial_sequence.push(stim);
                this.ctask.preload_images.push(img);   
                this.sampling_weights[ct] =1;     
                ct=ct+1;
            }

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
        super.setup();   
    }
 
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_score_response =function(data){
        let correct1=data.button_pressed !== data.correct_response;         
        let score=correct1 ? 1:0;
        if(correct1 && data.stim_type==exp.INCONGRUENT) score=2;
        data.correct=correct1;
        return score;
    }

}
