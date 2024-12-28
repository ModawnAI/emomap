class jsDotProbe extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='DotProbe';
        if(taskID===null) this.taskID='DotProbe'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 50;
        this.nickname='탐침과제';
        this.set_default();
    }
    set_default(){
        this.keyboard_choices=['j','k'];
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsDotProbeTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial(); //compile
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
        "<p>평균 응답 속도: <strong>" + Math.round(meanrt) + "ms</strong>.</p>"+
        "<p>다시 하시겠습니까?</p>";
    }
}

class jsDotProbeTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='DotProbe-v10';
        this.stimulus_type='html'; //image, numbers, html
        this.stimulus_duration=2500;
        this.prefixataion_duration=500;
        this.stimulus_isi_words=2000;
        this.stimulus_isi_position=200;
        this.trial_duration=3000;
        this.post_trial_gap=500;
        this.response_ends_trial=true;
        this.poststimulus='fixation';
        this.fixation_size=50;
        this.stimulus_height=150;
        this.word_lpos=40;
        this.word_rpos=60;
        this.set_default()
        
        this.sequence_random=true;
    }
    set_default(){
        this.stimuli_set=[];
        this.keyboard_choices=['j','k'];//['leftarrow','rightarrow'] //: left 37, 'rightarrow': 39,
        this.response_choices=["왼쪽", "오른쪽"];
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
            } else // 
            {
                for (let i=0;i<sequence_ext.length;i++)
                {
                    let s=sequence_ext[i];
                    let stimulus=[];stimulus.push(s.stimulus1);stimulus.push(s.stimulus2);
                    sequence_ext[i].stimulus=stimulus;
                    sequence_ext[i].correct_response=parseInt(s.correct_response);
                }
                this.ctask.sequence_data=sequence_ext;
            }
            this.sequence_random=false;
            this.ctask.sequence_length=this.ctask.sequence_data.length;
            sequence=[];
        }

        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);

        if (this.stimulus_type=='html') {
            /*
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
            */
        }
    }
    setup(){
        this.init();
        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_sequence_length);
        if(this.sequence_random){
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
            this.ctask.sequence_length=this.ctask.task_trial_sequence.length;
        } else {
            this.setup_ordered_sequence();
        }
        this.ctask.sequence_data=[];
        super.setup();
    }

    setup_random_sequence(sequence_length){
        let conditions = [
            { valience: 'P',position:'C' },
            { valience: 'P',position:'I' },
            { valience: 'N',position:'C' },
            { valience: 'N',position:'I' },
        ];
        let task_trial_sequence = []; let sampling_weights=[1,1,1,1];
        if(typeof positive_words==='undefined' || typeof negative_words==='undefined' || typeof negative_words==='undefined'){
            console.log('No words list...')
            return task_trial_sequence;
        }
        let poswords=jsFunc.shuffle(positive_words);
        let negwords=jsFunc.shuffle(negative_words);
        let neutrals=jsFunc.shuffle(neutral_words);

        var order = [];for(var i=0; i<conditions.length; i++){order.push(i);}
        order = jsPsych.randomization.sampleWithReplacement(order, sequence_length, sampling_weights);
        let ni=0; let pi=0; let ii=0; let sequence=[];
        for (var i=0;i<sequence_length;i++){
            let a=new Object(); a.stimulus=[]; ii=i%neutrals.length;
            if (Math.random()<0.5) { 
                a.direction='L';
                if (order[i]==0){
                    a.stimulus.push(poswords[pi]);
                    a.stimulus.push(neutrals[ii]);
                    a.stim_type='PC';
                    a.correct_response=0; pi++;
                }
                else if (order[i]==1){
                    a.stimulus.push(neutrals[ii]);
                    a.stimulus.push(poswords[pi]);
                    a.stim_type='PI';
                    a.correct_response=0; pi++;
                }
                else if (order[i]==2){
                    a.stimulus.push(negwords[ni]);
                    a.stimulus.push(neutrals[ii]);
                    a.stim_type='NC';
                    a.correct_response=0; ni++;
                }
                else if (order[i]==3){
                    a.stimulus.push(neutrals[ii]);
                    a.stimulus.push(negwords[ni]);
                    a.stim_type='NI';
                    a.correct_response=0; ni++;
                }
            }
            else { 
                a.direction=='R';
                if (order[i]==0){
                    a.stimulus.push(neutrals[ii]);
                    a.stimulus.push(poswords[pi]);
                    a.stim_type='PC';
                    a.correct_response=1;pi++;
                }
                else if (order[i]==1){
                    a.stimulus.push(poswords[pi]);
                    a.stimulus.push(neutrals[ii]);
                    a.stim_type='PI';
                    a.correct_response=1;pi++;
                }
                else if (order[i]==2){
                    a.stimulus.push(neutrals[ii]);
                    a.stimulus.push(negwords[ni]);
                    a.stim_type='NC';
                    a.correct_response=1;ni++;
                }
                else if (order[i]==3){
                    a.stimulus.push(negwords[ni]);
                    a.stimulus.push(neutrals[ii]);
                    a.stim_type='NI';
                    a.correct_response=1;ni++;
                }
            }
            sequence.push(a);
        }
        sequence=jsFunc.shuffle(sequence);
        for (let i=0;i<sequence.length;i++)
        {
            let a=new Object(); let d=new Object();
            let s=sequence[i];
            a.stimuli_isi=[]; a.stimulus=[];
            a.stimuli_isi.push(this.prefixataion_duration);     
            a.stimulus.push(this.fixation_generation());
            a.stimuli_isi.push(this.stimulus_isi_words);     
            a.stimulus.push(this.presentation_generation(s.stimulus));
            a.stimuli_isi.push(this.stimulus_isi_position);     
            a.stimulus.push(this.position_generation(s.direction));
            d.stim_type=s.stim_type;
            d.stim_id=i;
            d.stim_isi=a.stimulus_isi;
            d.correct_response=s.correct_response;
            d.direction=s.direction;
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }

    presentation_generation(words) {
        var html = `<div style="position: fixed; top: 50%; left: ${this.word_lpos}%; transform: translate(-50%, -50%); display: flex; align-items: center; font-size: ${this.stimulus_height}pt;justify-content: center; color: black;">${words[0]}</div>` +
                 `<div style="position: fixed; top: 50%; left: ${this.word_rpos}%; transform: translate(-50%, -50%); display: flex; align-items: center; font-size: ${this.stimulus_height}pt;justify-content: center; color: black;">${words[1]}</div>`;
        return html;
    }
    position_generation(stim) {
        let html;
        if (stim=='L')
            html=`<div style="position: fixed; top: 50%; left: ${this.word_lpos}%; transform: translate(-50%, -50%); width: 50px; height: 50px; background-color: red;"></div>`;
        else 
            html=`<div style="position: fixed; top: 50%; left: ${this.word_rpos}%; transform: translate(-50%, -50%); width: 50px; height: 50px; background-color: red;"></div>`;
        return html;
    }
    fixation_generation() {
        var html = `<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; font-size: ${this.fixation_size}pt;justify-content: center; color: black;">+</div>` ;
        return html;
    }
    setup_ordered_sequence(){
        this.ctask.task_trial_sequence = [];
        for (let i=0;i<this.ctask.sequence_length;i++)
        {
            let a=new Object(); let d=new Object();
            let s=this.ctask.sequence_data[i];
            a.stimuli_isi=[]; a.stimulus=[];
            a.stimuli_isi.push(this.prefixataion_duration);     
            a.stimulus.push(this.fixation_generation());
            a.stimuli_isi.push(this.stimulus_isi_words);     
            a.stimulus.push(this.presentation_generation(s.stimulus));
            a.stimuli_isi.push(this.stimulus_isi_position);     
            a.stimulus.push(this.position_generation(s.direction));
            
            d.stim_type=s.stim_type;
            d.stim_id=i;
            d.stim_isi=a.stimulus_isi;
            d.correct_response=s.correct_response;
            d.direction=s.direction;
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
    }
    callback_stimuli_isi(){ return jsPsych.timelineVariable('stimuli_isi',true); }
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    set_speech_text(){ return jsPsych.timelineVariable('speech_text',true);}
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }

    callback_score_response =function(data){
        data.correct=data.button_pressed == data.correct_response  ? true : false;
        var score=data.correct ? 1:0;
        return score;
    }
}
