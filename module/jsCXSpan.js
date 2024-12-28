class jsCXSpan extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='cxspan';
        if(taskID===null) this.taskID='cxspan'+'-'+jsPsych.randomization.randomID(5);

        this.nickname='복합기억';
        //this.use_debrief_trial=false;
        //this.use_test_end_trial=false;
        //this.multi_session_task=true;
        this.set_default();
        this.task_finished=false;
    }
    set_default(){
        this.instruction_keyword='빨간 벌집의 위치와 순서를 기억하세요';
        this.pre_instruction_keyword='벌집 왼쪽 오른쪽이 서로 대칭인가요?';
        this.response_instruction_keyword='빨간 벌집이 나온 위치를 순서대로 선택하세요?';

        this.pretest_span_lengths=[2, 2];
        this.pretest_sequence_length=this.pretest_span_lengths.length;
        this.span_lengths=[2,2,3,3,3,4,4,4,5,5,5];
    }

    init(){
        //this.test_session_max_iteration=this.span_lengths.length; PHJ
        this.task_trial.number_random_sequence=this.span_lengths[0];
    }
    create_task_trial() {
        this.task_trial=new jsCXSpanTrial('trial',this);
        this.task_trial.number_random_sequence=this.span_lengths[this.nsession];
    }

    set_task_trial(trial){
        super.set_task_trial(trial);
    }
    setup(){
        this.init();
        super.setup();
    }
    callback_get_debrief(){
        const SYMMETRIC=1; const NONSYMMETRIC=2;let result={};
        var prertmean=jsPsych.data.get().filter({phase:'prestim'}).select('rt').mean();
        var prertsd=jsPsych.data.get().filter({phase:'prestim'}).select('rt').sd();
        var pretruecnt=jsPsych.data.get().filter({phase:'prestim',correct:true}).count();
        var precnt=jsPsych.data.get().filter({phase:'prestim'}).count();
        result.nontarget_count=precnt;
        result.nontarget_correct_count=pretruecnt;
        result.nontarget_rt_mean=prertmean;
        result.nontarget_rt_sd=prertsd;

        var rtmean=jsPsych.data.get().filter({phase:'test'}).select('rt').mean();
        var rtsd=jsPsych.data.get().filter({phase:'test'}).select('rt').sd();
        var tp = jsPsych.data.get().filter({phase:'test',correct: true}).count();
        var ntot = jsPsych.data.get().filter({phase:'test'}).count();
        var score = jsPsych.data.get().filter({phase:'test'}).select('score').sum();

        result.total_count=ntot;
        result.total_correct_count=tp;
        if(result.total_count>0){
            result.total_rt_mean = rtmean;
            result.total_rt_sd = rtsd;
            result.total_score = score;
        } else {
            result.total_rt_mean=null;
            result.total_rt_sd=null;
            result.total_score=null;
        }
        result.total_unresponded_count=jsPsych.data.get().filter({phase:'test',button_pressed:undefined,}).count();
        this.performance=result;

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
        this.type='cxspan-v10';
        this.stimulus_type='grid-numbers'; //image, numbers, html,complex, 'grid-numbers'
        this.stimulus_duration=1000;
        this.trial_duration=10000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=true;

        this.button_stimulus_mode=true;
        this.wait_duration_after_multiresponses=1000;
        this.mark_responded_button=true;
        this.stimulus_height=60;
        this.stimulus_width=60;

        this.noresponse_warning=false;
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.stimulus_nrow=4;
        this.stimulus_ncol=4;
        this.stimuli_image_set=[];
        this.prompt='<p class="font-message">첫번째 두개의 위치를 선택하세요</p>';

        this.response_trial=null;
        this.set_default()
    }
    set_default(){
        this.pre_stimulus_height=70;
        this.number_random_sequence=4;
        this.stimuli_isi=[];
        this.stimulus_isi=500;
    }
    init(){ //task specific initialization
        this.response_choices=['지우기'];
        this.stimuli_set=[]; const NIMG=24;
        for(let i=1;i<=NIMG;i++) this.stimuli_set.push('img/symm'+i+'.png');
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        if(typeof sequence_ext!=='undefined') { //external
            if(sequence_ext.length>0) {
                this.ctask.sequence_data=[];
                for(let i=0;i<sequence_ext.length;i++) {
                    let a=new Object(); let s=sequence_ext[i];
                    a.symidx=[];a.nspan=parseInt(s.nspan);a.stimulus=[];
                    let val1,val2;
                    for(let j=1;j<=s.nspan;j++) {
                        let v='val1=s.symm'+j; let p='val2=s.pos_SQ'+j;
                        eval(v); eval(p);    val1=val1.trim();
                        let id=val1.indexOf('.'); val1=val1.slice(4,id); val1=parseInt(val1)-1;
                        val2=parseInt(val2)-1;
                        a.symidx.push(val1);
                        a.stimulus.push(val2);
                    }
                    this.ctask.sequence_data.push(a);
                }
                //this.stimuli_set=jsFunc.unique(sequence,true);
                this.sequence_random=false;
                this.ctask.sequence_length=this.ctask.sequence_data.length;
            }
        }
    }

    setup(){
        this.init();
        this.max_response_count=this.number_random_sequence;
        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_span_lengths);
        this.ctask.pretest_sequence_length=this.ctask.pretest_span_lengths.length;
        this.compile_pretest();
        if(this.sequence_random){
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.span_lengths);
            this.ctask.sequence_length=this.ctask.task_trial_sequence.length;
        } else {
            this.setup_ordered_sequence(this.ctask.sequence);
        }
        super.setup();
    }
    setup_random_sequence(number_random_sequence){
        let task_trial_sequence = [];
        const SYMMETRIC=1; const NONSYMMETRIC=2;const NUMSYM=12;
        let img; let stimtype=false;
        var nbut=this.stimulus_nrow*this.stimulus_ncol;
        var stim=[];for (var j=0;j<nbut;j++) stim.push(j);
        let stim1=[];for (let j=0;j<this.stimuli_set.length;j++) stim1.push(j); let cr=0;        //
        if (!Array.isArray(number_random_sequence)) number_random_sequence=[number_random_sequence];
        for (let i=0;i<number_random_sequence.length;i++){
            let nrand=number_random_sequence[i];
            var idx=jsPsych.randomization.sampleWithoutReplacement(stim, nrand); //memory test
            var a=new Object(); var d=new Object();
            a.stimulus=idx;
            a.stimuli_isi=[];for (let i=0;i<nrand;i++) a.stimuli_isi[i]=this.stimulus_isi; // prestimulus isi
            d.correct_response=idx;

            let ridx=jsPsych.randomization.sampleWithoutReplacement(stim1, nrand); //prestimulus symetric test
            a.prestimulus=[];d.pre_stimulus=[];d.pre_stim_type=[];d.pre_correct_response=[];
            for(let j=0;j<nrand;j++){
                if(ridx[j]<NUMSYM) {stimtype=SYMMETRIC;cr=0;}
                else {stimtype=NONSYMMETRIC;cr=1;}
                img=this.stimuli_set[ridx[j]];a.prestimulus.push(img);
                let dstim=jsFunc.get_filename(img);d.pre_stimulus.push(dstim);
                d.pre_stim_type.push(stimtype);
                d.pre_correct_response.push(cr);
            }
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }

    setup_ordered_sequence(){
        this.ctask.task_trial_sequence = [];
        const SYMMETRIC=1; const NONSYMMETRIC=2;const NUMSYM=12;//24;
        let img; let stimtype=false;  this.ctask.span_lengths=[];
        let stim1=[];for (let j=0;j<this.stimuli_set.length;j++) stim1.push(j); let cr=0;        //
        for (var i=0;i<this.ctask.sequence_data.length;i++){
            let s=this.ctask.sequence_data[i];
            let nrand=s.nspan;
            var a=new Object(); var d=new Object();
            a.stimulus=s.stimulus;
            a.nspan=s.stimulus.length;this.ctask.span_lengths.push(a.nspan);
            a.stimuli_isi=[];for (let i=0;i<nrand;i++) a.stimuli_isi[i]=this.stimulus_isi; // prestimulus isi
            d.correct_response=s.stimulus;
            let ridx=s.symidx //prestimulus symetric test
            a.prestimulus=[];d.pre_stimulus=[];d.pre_stim_type=[];d.pre_correct_response=[];
            for(let j=0;j<nrand;j++){
                if(ridx[j]<NUMSYM) {stimtype=SYMMETRIC;cr=0;}
                else {stimtype=NONSYMMETRIC;cr=1;}
                img=this.stimuli_set[ridx[j]];a.prestimulus.push(img);
                let dstim=jsFunc.get_filename(img);d.pre_stimulus.push(dstim);
                d.pre_stim_type.push(stimtype);
                d.pre_correct_response.push(cr);
            }
            a.data=d;
            this.ctask.task_trial_sequence.push(a);
        }
        return this.ctask.task_trial_sequence;
    }

    compile_pretest(){
        this.ctask.pretest_sequence=[];
        for (let it=0;it<this.ctask.pretest_span_lengths.length;it++){
            let task_trials=[]; let ct=0;
            for (let i=0;i<this.ctask.pretest_span_lengths[it];i++){
                let trial=this.create_main_tasktrial();
                trial.trialID=ct;
                task_trials.push(trial); //main memory first
                let ptrial=this.create_pre_tasktrial();
                ptrial.trialID=ct;
                task_trials.push(ptrial);
                ct=ct+1;
            }
            this.max_response_count=this.ctask.pretest_span_lengths[it];
            let response_trial=this.create_response_tasktrial();
            response_trial.trialID=ct;
            task_trials.push(response_trial);
            let test_sequence = {
                timeline: task_trials,
                timeline_variables: [this.ctask.pretest_trial_sequence[it]],
            };
            this.ctask.pretest_sequence=this.ctask.pretest_sequence.concat(test_sequence);
        }
    }
    compile(){
        this.trial=[];
        for (let it=0;it<this.ctask.span_lengths.length;it++){
            let task_trials=[]; let ct=0;
            for (let i=0;i<this.ctask.span_lengths[it];i++){
                let trial=this.create_main_tasktrial();
                trial.trialID=ct;
                task_trials.push(trial); //main memory first
                let ptrial=this.create_pre_tasktrial();
                ptrial.trialID=ct;
                task_trials.push(ptrial);
                ct=ct+1;
            }
            this.max_response_count=this.ctask.span_lengths[it];
            let response_trial=this.create_response_tasktrial();
            response_trial.trialID=ct;
            task_trials.push(response_trial);
            let test_sequence = {
                timeline: task_trials,
                timeline_variables: [this.ctask.task_trial_sequence[it]],
            };
            this.trial=this.trial.concat(test_sequence);
        }
    }

    create_pre_tasktrial(){
        let pre_test_trial = { //owner
            type: "unified-button-response",
            stimulus_type: "image",
            taskID:this.ctask.taskID,
            trialID:0,
            guide_image:null,
            on_start: function (){
                let ctrial= jsPsych.currentTrial();
                let ctask=exp.getTask(ctrial.taskID);

                let style=''; if(ctask.instruction_keyword_color!==null) style=`style="color:${ctask.instruction_keyword_color};"`;
                let instruction=`<p class="font-keyword" ${style}>${ctask.pre_instruction_keyword} </p>`;
                exp.set_DOM_top_message_container(instruction);


                if(ctask.task_finished) jsPsych.finishTrial();
            },
            stimulus: function(){
                let img=jsPsych.timelineVariable('prestimulus',true);
                console.log('pre:'+img+' at '+jsPsych.currentTimelineNodeID())
                return img[jsPsych.currentTrial().trialID];
            },
            button_html: uxm.sym_asym_buttons,
            choices: ['대칭','비대칭'],
            post_trial_gap: 1000,
            response_audio: uxm.sound_button_press,
            stimulus_height:this.pre_stimulus_height,
            user_stim_style_flag:this.user_stim_style_flag,
            stimulus_style:this.stimulus_style,
            on_finish: function (data) {
                let ctrial= jsPsych.currentTrial();
                if(ctrial.taskID===undefined) return;
                let ctask=exp.getTask(ctrial.taskID);
                if(ctask.task_finished) { jsPsych.endCurrentTimeline();this.return;}

                const NUMSYM=12
                var score=0;data.correct=false;
                data.phase='prestim';
                let pre_correct_response=0;
                let a=data.stimulus.slice(-6,-4);
                if(a[0]<'0' || a[0]>'9') { //only numeric
                    a=a.slice(1, a.length);
                }
                let id=parseInt(a);
                if(id>NUMSYM) pre_correct_response=1;
                if (pre_correct_response==data.button_pressed) score++;
                if(score>0) data.correct=true;
            },
        };
        this.ctask.preload_images=this.ctask.preload_images.concat(this.image_button_symmetric,this.image_button_asymmetric);
        return pre_test_trial;
    }
    create_main_tasktrial(){
        this.stimuli_image_set=['img/B.png','img/S.png'];
        // just one time for stimuli and stimuli_set when we assign like above
        this.stimuli_image_set.forEach((element,i)=> this.stimuli_image_set[i]=this.ctask.localpath+element ); //add localpath
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_image_set);
        let test_trial = { //owner
            type: "unified-button-response",
            taskID:this.ctask.taskID,
            trialID:0,
            button_stimulus_mode:false,
            stimulus_width:this.stimulus_width,
            stimulus_height:this.stimulus_height,
            stimulus_type: "grid",
            trial_duration:1000,
            stimuli_image_set:this.stimuli_image_set,
            stimuli_isi:[],
            stimulus_nrow:this.stimulus_nrow,
            stimulus_ncol:this.stimulus_ncol,
            button_html:[],
            on_start: function (){
                let ctrial= jsPsych.currentTrial();
                let ctask=exp.getTask(ctrial.taskID);

                let style=''; if(ctask.instruction_keyword_color!==null) style=`style="color:${ctask.instruction_keyword_color};"`;
                let instruction=`<p class="font-keyword" ${style}>${ctask.instruction_keyword} </p>`;
                exp.set_DOM_top_message_container(instruction);

                if(ctask.task_finished) jsPsych.finishTrial();
            },
            stimulus_audio: function() {
                let ctrial=jsPsych.currentTrial();
                if(ctrial.taskID===undefined) return;
                let ctask=exp.getTask(ctrial.taskID);
                if(ctask.task_finished) return null;
                else return uxm.sound_stimulus_presented
            },
            stimulus: function(){
                let ctrial=jsPsych.currentTrial();
                if(ctrial.taskID===undefined) return;
                let ctask=exp.getTask(ctrial.taskID);
                if(ctask.task_finished) {  jsPsych.endCurrentTimeline(); return null;}

                let num=jsPsych.timelineVariable('stimulus',true);
                console.log('pre:'+num+' at '+jsPsych.currentTimelineNodeID())
                //return jsFunc.randidx(15);
                let val=num[ctrial.trialID];
                let vals=[];let nbut=ctrial.stimulus_nrow*ctrial.stimulus_ncol;
                for (let i=0;i<nbut;i++) vals.push(0);
                vals[val]=1;
                return vals;
                //return val;
            },
            on_finish: function (data) {
                let ctrial= jsPsych.currentTrial();
                if(ctrial.taskID===undefined) return;
                let ctask=exp.getTask(ctrial.taskID);
                if(ctask.task_finished) { jsPsych.getDisplayElement().innerHTML='잠시만 기다려 주세요'; jsPsych.endCurrentTimeline("잠시만 기다려 주세요.");this.return;}
            }
        };
        return test_trial;
    }
    create_response_tasktrial(){
        this.stimuli_set=[]; const NIMG=24;
        for(let i=1;i<=NIMG;i++) this.stimuli_set.push('img/symm'+i+'.png');
        this.stimuli_set.forEach((element,i)=> this.stimuli_set[i]=this.ctask.localpath+element );
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set);
        let button_html=['img/but_remove.png','img/but_accept.png'];
        // just one time for stimuli and stimuli_set when we assign like above
        button_html.forEach((element,i)=> button_html[i]=this.ctask.localpath+element ); //add localpath
        this.ctask.preload_images=this.ctask.preload_images.concat(button_html);
        this.stimuli_isi=[];//for(let i=0;i<this.max_response_count;i++) this.stimuli_isi.push(NaN);
        let test_trial = { //owner
            type: "unified-button-response",
            button_stimulus_mode:true,
            stimulus_width:this.stimulus_width,
            stimulus_height:this.stimulus_height,
            taskID:this.ctask.taskID,
            trialID:0,
            stimulus_type: "grid-numbers",
            trial_duration:20000,
            stimuli_isi:[],
            stimuli_image_set:this.stimuli_image_set,
            mark_responded_button:true,
            stimulus_nrow:this.stimulus_nrow,
            stimulus_ncol:this.stimulus_ncol,
            max_response_count: this.max_response_count,
            choices:button_html, //['지우기','수락'],
            feedback_audios: this.feedback_audios,
            post_trial_gap: 1000,
            stimulus: null,
            on_start: function (){
                let ctrial= jsPsych.currentTrial();
                let ctask=exp.getTask(ctrial.taskID);

                let style=''; if(ctask.instruction_keyword_color!==null) style=`style="color:${ctask.instruction_keyword_color};"`;
                let instruction=`<p class="font-keyword" ${style}>${ctask.response_instruction_keyword} </p>`;
                exp.set_DOM_top_message_container(instruction);

                if(ctask.task_finished) {jsPsych.getDisplayElement().innerHTML='잠시만 기다려 주세요';jsPsych.finishTrial();}
            },
            on_load: function () {
                let ctrial= jsPsych.currentTrial();
                if(ctrial!==null) {
                    ctrial.trial_start_time=jsFunc.toSqlDatetime(new Date()); //risk in using variable outside jspsych
                }
            },
            on_finish: function (data) { //unified_button_response
                let ctrial= jsPsych.currentTrial();
                let ctask=exp.getTask(ctrial.taskID);
                if(ctask.task_finished) { jsPsych.getDisplayElement().innerHTML='잠시만 기다려 주세요';jsPsych.endCurrentTimeline('잠시만 기다려 주세요');this.return;}

                var score=0;data.correct=false;
                if(typeof data.responses=="undefined") return score;
                for(var i=0;i<data.responses.length;i++) {
                    if (data.correct_response[i]==parseInt(data.responses[i].button)) score++;
                }
                if(data.responses.length==score)  data.correct=true;
                ctrial.score = score;


                //ctrial.callback_update_response_data(data);
                data.score=ctrial.score;
                data.phase=ctask.phasemode;
                data.start_time=ctrial.trial_start_time;
                var responsestr='';
                if(data.hasOwnProperty('responses')) {
                    for(var i=0;i<data.responses.length;i++) {
                    if(i==data.responses.length-1) responsestr+=data.responses[i].button+':'+Math.round(data.responses[i].rt);
                    else responsestr+=data.responses[i].button+':'+Math.round(data.responses[i].rt)+',';
                    }
                }
                data.multi_responses=responsestr;
                data.response=data.button_pressed;
                data.session=ctrial.nsession;

                if(data.hasOwnProperty('correct_response')) {
                    if(Array.isArray(data.correct_response)){
                        data.correct_response=jsFunc.array2csv(data.correct_response);
                    }
                }

                ctask.responses.push(data); //

                ctask.score = ctask.score + ctrial.score;
                var svar = "score:" + ctask.score;
                ctask.score_display();
                if(ctask.phasemode=='test') {
                    if(ctask.trial_count >0) {
                        //let pre=jsPsych.data.getLastTrialData().values()[0];
                        let pre=ctask.responses[ctask.responses.length-2];
                        if(pre.pre_stimulus.length==data.pre_stimulus.length)
                        if(data.correct == false && pre.correct==false ){
                            ctask.task_finished=true;
                            jsPsych.getDisplayElement().innerHTML='잠시만 기다려 주세요'
                        }
                    }
                }
                ctask.trial_count++;

                console.log('=== ctrial:'+ctask.taskID+" was finished with score:"+svar + " progress:" + ctask.trial_count);

            },
            data: function () {
                return jsPsych.timelineVariable('data',true);
            },
            stimulus_audio: uxm.sound_stimulus_presented,
            response_audio: uxm.sound_button_press,
            feedback_audio_index: function(stimulus,responses) {
                var data=jsPsych.timelineVariable('data',true);
                var score=0;var aid=1;
                for(var i=0;i<responses.length;i++) {
                    if (data.correct_response[i]==parseInt(responses[i].button)) score++;
                }
                if(score==responses.length) aid=0;
                return aid;
            },
        }
        return test_trial;
    }
}
