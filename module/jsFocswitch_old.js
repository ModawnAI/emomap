class jsFocswitch extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='Focswitch';
        if(taskID===null) this.taskID='Focswitch'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='순서기억';
    }

    create_task_trial() {
        this.task_trial=new jsFocswitchTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    callback_get_debrief(){
        var tot = jsPsych.data.get().filter({stim_type:exp.TARGET}).count();
        var correct=jsPsych.data.get().select('correct').sum();
        return "%GUIDE%"+"잘하셨습니다!<br>"+  
        "총 "+this.sequence_length  + "회의 시행중에서 <strong>" + correct + "회</strong> 맞았습니다.<br>"+
        "다시 하시겠습니까?";
    }
}

class jsFocswitchTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='Focswitch-v10';
        this.stimulus_type='image';//'stimulus-response'; //image, numbers, html 
        this.stimulus_duration=1000;
        this.trial_duration=5000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;
        this.poststimulus='fixation';        
        this.button_stimulus_mode=false;
        this.wait_duration_after_multiresponses=1500;
        this.fixation_size=50;
        this.stimulus_height=100;
        this.max_response_count=1;
        this.noresponse_warning=true;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.complete_stimuli=null;
        this.response_choices=['다음'];
        this.response_ends_trial=true;
        this.item_types = [0,1,3];//,3,4];
        this.num_items=[5,6,7,8]; 
    }
    
    init(){ //task specific initialization
        this.stimuli_set=['img/S1.png','img/S2.png','img/S3.png','img/S4.png','img/S5.png'];
        this.complete_stimuli=this.ctask.localpath+'img/Complete.png'
        // just one time for stimuli and response_choices when we assign like above
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element ); //add localpath
        this.stimuli_isi=[];
        this.stimulus_isi=100000;
    }

    load_bgrid(nrows,ncols,choices,choiceid=null,style=null){ //button grid
        var width=50; var height=50;
        if(style===null){
            var style=`width: ${width}px; height: ${height}px; text-align: center; `;
            //align-self:center;align-items:center;justify-content: center;
        }
        var html_ = '<div id="jspsych-unified-grid-dummy" css="display: none;">';
        html_ += '<table id="jspsych-unified-grid table" '+
            'style="border-collapse: collapse; margin-left: auto; margin-right: auto;">';

        let ct=0; let done=false;
        for (var row = 0; row < nrows; row++) {
            if(done) break;
            html_ += '<tr id="jspsych-unified-grid-table-row-'+row+'" css="height:'+height+'px;">';
            for (var col = 0; col < ncols; col++) {
            
            html_ += '<td id="jspsych-unified-grid-table-' + row + '-' + col +'" '+
            'style="padding: '+ (height / 4) + 'px ' + (width / 10) + 'px; '; 
            if(choiceid===null) html_+='">';
            else html_+=' border: 1px solid #555; ">';
                
            /* */
            if(choiceid===null){ //fill all the grid with given choices
                html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style}">`; 
                if(ct==choices.length) {done=true; break;}
                if (choices[ct].length>0) { //not empty string
                    let choice;
                    if(isImage(choices[ct]))  choice='<img src="'+choices[ct]+'" style="width:100%; height:100%;"></img>';
                    else choice=choices[ct];
                    let buthtml=`<button style="width:${width-1}'px; height:${height-1}'px; align-items:center; background-color: Transparent;">`+ choice+'</button>';          
                    html_ += buthtml;
                }
                else {
                    let choice=choices[ct];
                    let buthtml=`<button style="width:${width-1}'px; height:${height-1}'px; align-items:center;">`+ choice+'</button>';          
                    html_ += buthtml;
                }
            } else {
                if (choiceid==ct){
                html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style}background-color:red;">`; 
                } else {
                html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style}background-color:white;">`;       
                }
            }
            /* */

            html_ += '</div></td>';
            ct=ct+1;
            }
            html_ += '</tr>';
        }
        html_ += '</table></div>';
        return html_;
    }

    setup(){
        this.init();   

        let  ct=0;
        this.ctask.task_trial_sequence=[];
        for (let it=0;it<this.ctask.sequence_length;it++){
            let itemidx=jsPsych.randomization.sampleWithReplacement(this.num_items, 1); let nitem=itemidx[0];
            const sidx=jsPsych.randomization.sampleWithReplacement(this.item_types, nitem);
            let ntid=jsPsych.randomization.sampleWithReplacement(this.item_types,1); ntid=ntid[0];
            this.stimuli_isi=[];var a=new Object(); var d=new Object();a.stimulus=[]; let ct=0;
            for(let i=0;i<nitem;i++){
                this.stimuli_isi[i]=NaN;                
                if(sidx[i]==ntid) ct++;
                a.stimulus.push(this.stimuli_set[sidx[i]]);
            }
                       
            a.stimuli_isi=this.stimuli_isi;
            a.prompt=this.stimuli_set[ntid];
            d.correct_response=ct;
            d.stim_type=exp.TARGET;    
            d.stim_id=sidx;
            d.stimulus=sidx;
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
            //append question trial... 
        }
        const choices=[1,2,3,4,5,6,7,8,9]; 
        this.prompt_button_html=this.load_bgrid(3,3,choices);
        super.setup();   
    }
 
    callback_trial_stimulus(){
        return jsPsych.timelineVariable('stimulus',true); 
    }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_prompt(trial){         
        let img=jsPsych.timelineVariable('prompt',true);
        let prompt='<img src="'+ img + '" width="'+(trial.stimulus_width-4)+'px" height="'+(trial.stimulus_height-4)+'px"></img>'; //-4 는 다시 생각해야 함.. 
        prompt=`<p>${prompt} 는 총 몇 개가 들어갔을까요?</p>`         
        return prompt;
    }

    callback_score_response =function(data){
        var score=0;data.correct=false;
        if(typeof data.responses=="undefined") return score;
        if (data.correct_response===parseInt(data.responses[0].button)) score++;
        if(score>0)  data.correct=true;
        return score;
    }
    callback_feedback_audio_index(stimulus,responses){
        var data=jsPsych.timelineVariable('data',true);    
        var score=0;var aid=1;
        if (data.correct_response===parseInt(responses[0].button)) score++;
        if(score>0) aid=0;    
        return aid;
    }

}
