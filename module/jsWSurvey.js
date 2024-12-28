class jsWSurvey extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='WordSurvey';
        if(taskID===null) this.taskID='WordSurvey'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='단어서베이';
        this.task_session_info={};
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsWSurveyTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }

    callback_get_debrief(){
        //let rt = Math.round(jsPsych.data.get().filter({stim_type: true}).select('rt').mean());
        console.log(jsPsych.data.get().uniqueNames())
    
        let stim_id=jsPsych.data.get().select('stim_id').values.sort();
        let responsedata=jsPsych.data.get().select('button_pressed').values;
        let rtdata=jsPsych.data.get().select('rt').values;
        let nitem=responsedata.length; let nscore=5;
        let meanrt=jsPsych.data.get().select('rt').mean();
        let sdrt=jsPsych.data.get().select('rt').sd();
        let task_info={};
        task_info.rt_mean=Math.round(meanrt);
        task_info.rt_std=sdrt;
        this.task_session_info=Object.assign(this.task_session_info,task_info);
    
        return "%GUIDE%"+"<p>총 시행 설문수: <strong>" + nitem + "회</strong>.</p>"+
        "<p>평균 응답 속도: <strong>" + meanrt + "ms</strong>.</p>"+
        "<p>다시 하시겠습니까?</p>";
    }

}

class jsWSurveyTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='WSurvey-v10';
        this.stimulus_type='html'; //image, numbers, html 
        this.stimulus_duration=4000;
        this.trial_duration=5000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;
        this.stimulus_height=200;
        this.noresponse_warning=false;
        this.poststimulus='fixation';
        this.presentation_mode='circular';
        this.set_default()
    }
    set_default(){
        this.stimuli_set=[];
        this.response_choices=uxm.agreement_five_choices;
    }

    init(){ //task specific initialization
        super.init()
        if(typeof sequence_ext!=='undefined')
        {
            let sequence=[];
            if (this.stimulus_type=='image'){
                this.ctask.sequence_data=[];
                let cpath=this.ctask.localpath+'img/';
                for(let i=0;i<sequence_ext.length;i++) 
                {
                    sequence.push(sequence_ext[i].stimulus);
                    let a=sequence_ext[i];                  
                    a.stimulus=cpath + sequence_ext[i].stimulus + '.png';
                    this.ctask.sequence_data.push(a);
                }
                let stimuli_set=jsFunc.unique(sequence,true);
                stimuli_set.forEach((element,i) => stimuli_set[i]=cpath+element+ '.png' );
                this.ctask.preload_images=this.ctask.preload_images.concat(stimuli_set);
            } else
            {
                this.ctask.sequence_data=sequence_ext;
            }
            this.sequence_random=false;
            this.ctask.sequence_length=this.ctask.sequence_data.length;
            sequence=[];
        }
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);

        if (this.stimulus_type=='html') {
                    // Add CSS styles to the document
            let css = '.circle-container { position: relative; width: 300px; height: 300px; border-radius: 50%; margin: 0 auto; }' +
            '.circle-word-wrapper { position: absolute; display: flex; align-items: center; justify-content: center; width: 100px; height: 100px; border-radius: 50%; background-color: lightblue; transform-origin: bottom center; }' +
            '.circle-word { font-size: 20px; }';
            let style=document.getElementById('style')
            if (style==null) {
                let head = document.head || document.getElementsByTagName('head')[0];
                style = document.createElement('style');
                head.appendChild(style);
                style.type = 'text/css';
            }
            style.appendChild(document.createTextNode(css));
        }
    }
    setup(){
        this.init();
        //this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_sequence_length);
        if(this.sequence_random){
            //this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
        } else {
            this.setup_ordered_sequence();
        }
        this.ctask.sequence_data=[];
        super.setup();
    }
    setup_random_sequence(sequence_length,sampling_weights=this.sampling_weights){

    }

    circular_display(words) {
        var container = document.getElementById("jspsych-content");
        //var container=exp.get_DOM_contents_container();  //"jspsych-content"
        let rect=container.getBoundingClientRect();
        let width=container.offsetWidth;
        let height=container.offsetHeight;
        const centerx=(rect.left+rect.right)/2;
        const centery=(rect.top+rect.bottom)/2;
        if(this.aspect_ratio==1) {
            width=width<height ? width : height;
            height=width; var rto=ncol/nrow; if(rto>1) height=height/rto; else width=width*rto;
        }
        let circleRadius = 150; 
        let angleStep = 360 / words.length;
        let html=`<div id="stimulus" class="circle-container" >`; //style="height:${height}px;"
        let wordWrapper_clientHeight=100; let wordWrapper_clientWidth=100;
        for (let index=0;index<words.length;index++){
        //words.forEach(function(word, index) {
            let word=words[index];
            let angle = angleStep * index;angle=Math.floor(angle+0.5);
            let x =  circleRadius+circleRadius * Math.cos(angle * (Math.PI / 180)) - wordWrapper_clientWidth / 2; x=Math.floor(x+0.5);
            let y =  circleRadius+circleRadius * Math.sin(angle * (Math.PI / 180)) - wordWrapper_clientHeight ; y=Math.floor(y+0.5);
            let transform1 = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg)';
            let textRotation = -angle;//0;//angle > 90 && angle < 270 ? -180 : 0;
            let transform2 = 'rotate(' + textRotation + 'deg)';
            html+=`<div id="word-wrap-${index}" class="circle-word-wrapper" style="transform:${transform1};">`; 
            html+=`<div id="word-${index}" class="circle-word" style="transform:${transform2};"> ${word} </div>`; 
            html+=`</div>`;
        }
       // });
        html+='</div>'
      return html;
    }

    presentation_generation(stim) {
        let html;
        if (this.presentation_mode=='plain') html='<p style="color: blue; font-size:' + this.stimulus_height +'; font-weight: bold;">'+ stim.join(", ") + '</p>' ;
        else if (this.presentation_mode=='circular') {
            html=stim;//this.circular_display(stim);//`<div class="circle-container" id="circleContainer"></div>`;
        }
        return html;
    }
    setup_ordered_sequence(){
        this.ctask.task_trial_sequence = [];
        for (let i=0;i<this.ctask.sequence_length;i++)
        {
            let a=new Object(); let d=new Object();
            let s=this.ctask.sequence_data[i];
            a.stimulus=this.presentation_generation(s.stimulus); 
            d.stim_type=exp.TARGET
            d.stim_id=i;
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
    }
    callback_on_start(trial){ //trial is unified-button-response
        this.circular_display(trial.stimulus);
    }

    callback_trial_stimulus(){
        let words=jsPsych.timelineVariable('stimulus',true);
        let html=this.circular_display(words);
        return html; 
    }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    set_speech_text(){ return jsPsych.timelineVariable('speech_text',true);}
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }

    callback_score_response =function(data){
        data.correct=true;
        return 1;
    }
}
