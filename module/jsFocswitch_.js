class jsFocswitch extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='Focswitch';
        if(taskID===null) this.taskID='Focswitch'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='순서기억';
        this.use_debrief_trial=false;
        this.span_lengths=[16,16,18,18,20,20];
        this.test_session_max_iteration=this.span_lengths.length;
    }

    create_task_trial() {
        this.task_trial=new jsFocswitchTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    update_session_level(flag){
        this.task_trial.number_random_sequence=this.span_lengths[this.nsession];
        this.task_trial.init_sequence(false);
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
        this.trial_duration=null; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;  
        this.poststimulus='fixation';        
        this.button_stimulus_mode=false;
        this.wait_duration_after_multiresponses=1500;
        this.fixation_size=50;
        this.stimulus_height=100;
        this.max_response_count=1;
        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.complete_stimuli=null;
        this.response_choices=['다음'];
        this.response_ends_trial=true;
        this.item_types = [0,1,2];//,3,4];
        this.num_items=[5,6,7,8]; 
    }
    
    init(){ //task specific initialization
        this.stimuli_set=['img/S1.png','img/S2.png','img/S3.png','img/S4.png','img/S5.png'];
        this.complete_stimuli=this.ctask.localpath+'img/Complete.png'
        // just one time for stimuli and response_choices when we assign like above
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element ); //add localpath
        this.stimuli_isi=[];
        this.stimulus_isi=100000;
        this.nsession=0;
        this.number_random_sequence=this.ctask.span_lengths[this.ctask.nsession];
    }

    load_bgrid(nrows,ncols,choices,choiceid=null,style=null){ //button grid
        var width=50; var height=50;
        if(style===null){ 
            var style=`width: ${width}px; height: ${height}px; text-align: center; `;
            //align-self:center;align-items:center;justify-content: center;
        }
        var html_ = '<div id="jspsych-unified-grid-dummy" css="display: none;">';
        html_ += '<table id="jspsych-unified-grid table" '+
            'style="border-collapse: collapse; margin-left: auto; margin-right: auto; border: 2px;">';

        let ct=0; let done=false;
        for (var row = 0; row < nrows; row++) {
            if(done) break;
            html_ += '<tr id="jspsych-unified-grid-table-row-'+row+'" css="height:'+height+'px;width:'+width+'px;">';
            for (var col = 0; col < ncols; col++) {
            
            html_ += '<td id="jspsych-unified-grid-table-' + row + '-' + col +'" '+
            'style="padding: '+ (height / 10) + 'px ' + (width / 10) + 'px; '; 
            if(choiceid===null) html_+='">';
            else html_+=' border: 2px solid #555; ">';
                
            /* */
            if(choiceid===null){ //fill all the grid with given choices
                html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style}">`; 
                if(ct==choices.length) {done=true; break;}
                if (choices[ct].length>0) { //not empty string
                    let choice;
                    if(isImage(choices[ct]))  choice='<img src="'+choices[ct]+'" style="width:100%; height:100%;"></img>';
                    else choice=choices[ct];
                    let buthtml=`<button style="width:${width-1}'px; height:${height-1}'px; align-items:center; border-radius:50%; background-color: Transparent;">`+ choice+'</button>';          
                    html_ += buthtml;
                }
                else {
                    let choice=`<p style="height:90%;width:90%;font-size:30px;align-self:center;margin-top:5px; margin-bottom:0px;">${choices[ct]}</p>`;
                    let buthtml=`<button style="width:${width-1}px; height:${height-1}px; border-radius:50%; ">`+ choice+'</button>';          
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
    init_sequence(newarray=true){
        let  ct=0;
        if(newarray) this.ctask.task_trial_sequence=[];
        for (let it=0;it<this.ctask.sequence_length;it++){
            //let itemidx=jsPsych.randomization.sampleWithReplacement(this.num_items, 1); let nitem=itemidx[0];
            let nitem=this.number_random_sequence;
            const sidx=jsPsych.randomization.sampleWithReplacement(this.item_types, nitem);
            var sidxtype=this.item_types;
            if(sidx.length>1) sidxtype=[...new Set(sidx)]; 
            
            let ntid=jsPsych.randomization.sampleWithReplacement(sidxtype,1); ntid=ntid[0];
            let flag=true;let ct=0;
            while(flag){
                ct=0; for(let i=0;i<nitem;i++){if(sidx[i]==ntid) ct++;}   
                if(ct<=9 && ct>0) break;
                else {
                    ntid=jsPsych.randomization.sampleWithReplacement(sidxtype,1); ntid=ntid[0];
                }
            }    
            this.stimuli_isi=[];var a=new Object(); var d=new Object();a.stimulus=[]; ct=0;
            for(let i=0;i<nitem;i++){
                this.stimuli_isi.push(NaN);    //버턴 받을 것임..             
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
            if(newarray) this.ctask.task_trial_sequence.push(a);
            else this.ctask.task_trial_sequence[it]=a;
            if(a.stimuli_isi.length!==a.stimulus.length) console.log('mismatch in '+it)
            //append question trial... 
        }
        const choices=[1,2,3,4,5,6,7,8,9]; 
        this.prompt_button_html=this.load_bgrid(3,3,choices);
    }

    setup(){
        this.init();           
        this.init_sequence();        
        super.setup();   
    }
    callback_stimuli_isi(){
        let isi=jsPsych.timelineVariable('stimuli_isi',true); 
        let stim=jsPsych.timelineVariable('stimulus',true); 
        if (isi.length!==stim.length) {
            console.log('isi does not match');     
            isi=[]; for(let i=0;i<stim.length;i++) isi.push(NaN);       
        }
        return isi;
    }

    callback_trial_stimulus(){
        return jsPsych.timelineVariable('stimulus',true); 
    }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    callback_prompt(trial){         
        let img=jsPsych.timelineVariable('prompt',true);
        let prompt='<img src="'+ img + '" height="60px" width="60px" border="1" align="bottom">';
        prompt+=`<p style="height:46px;font-weight:bold;color:#942193;aligh-items:center;">  가 몇번 나왔습니까?</p>`         
        return prompt;
    }
    callback_on_start(trial) {
        exp.get_DOM_response_container().style='overflow:visible;margin-bottom:10vh;max-height:1000px;height:300px;';
    }
    callback_score_response =function(data){
        var score=0;data.correct=false;
        if(typeof data.responses=="undefined" || data.responses.length==0) return score;
        if (data.correct_response===parseInt(data.responses[0].button)+1) score++;
        if(score>0)  data.correct=true;
        return score;
    }
    callback_feedback_audio_index(stimulus,responses){
        if(typeof responses=="undefined" || responses.length==0) return 1;
        var data=jsPsych.timelineVariable('data',true);    
        var score=0;var aid=1;
        if (data.correct_response===parseInt(responses[0].button)+1) score++;
        if(score>0) aid=0;    
        return aid;
    }

}
