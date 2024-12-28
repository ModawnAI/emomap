class jsCogtask extends Object {
    constructor (name,localpath='./',taskID=null) {
        super();
        this.localpath=localpath;

        this.name=name;
        this.instruction_keyword='';
        this.instruction_keyword_color='black';
        this.nickname=this.name;
        this.level_info='';
        
        if(taskID!==null) this.taskID=taskID;      
        else this.taskID=this.name+'-'+jsPsych.randomization.randomID(5);  

        this.type='Basic';
        this.bottom_message='';

        this.variable_files=['var/variables.js',];
        this.sequence_file='var/sequence.csv'; //null
 
        this.sequence_length=1;
        this.adaptivemode=false;        
        this.nsession=0;
        this.trial_count=0;
        this.phasemode='test';
        
        this.task_info={};
        this.task_session_info={};
        this.env_info={};
        
        //trials config
        this.fixation_size=80;
        this.pre_tasktrial_duration=0;
        this.feedback_snd_duration=0;
        this.feedback_snd_duration_slow=0;
        this.feedback_snd_ends_after_audio=0;

        this.timeline_pre_tasktrial_flag=false;
        this.timeline_feedback_sound_flag=false;

        this.test_session_max_iteration=5;

        // global variables
        this.timeline=[];
        this.sequence=[];
        this.sequence_data=[];
        this.responses=[];
        this.conditions=[];

        //trials
        this.task_trial_sequence=[];
        this.pretest_trial_sequence=[];
        this.pretest_sequence_length=1;
        this.pretest_sequence=null;
        this.pretest_sampling_method=null;
        this.pretest_session_max_iteration=5;
        this.npresession=0;
        this.pretest_scores=[];


        this.task_trial=null;
        this.test_sequence=null;
        this.sampling_method=null;        
        this.test_session=null;
        this.ask_audioguide_trial=null;
        this.prolog_trials=null;
        this.welcome_trial=null;
        this.fullscreen_trial=null;
        this.instruction_trial=null;
        this.instruction_video_trial=null;
        this.ask_pretest_trial=null;
        this.test_ready_trial=null;
        this.test_end_trial=null;
        this.debrief_trial=null;
        this.epilog_trials=null;
        this.feedback_sound_trial=null;
        this.feedback_sound_prompt_trial=null;

        this.pretest_session_loop=null;
        this.test_session_loop=null;
        this.use_debrief_trial=true;
        this.use_test_end_trial=true;
        this.multi_session_task=false;
        this.debrief_pretest_trial=null;

        // jsPsych.init elements
        this.preload_audio=[];
        this.preload_images=[];
        this.preload_video=[];

        this.html_welcome_msg=null;
        this.html_instruction_msg=null;
        this.instruction_video=null;
        this.html_ready_msg=null;

        this.show_preload_progress_bar=true;
        this.auto_update_progress_bar=false;
        this.message_progress_bar="진행상황";

        this.exclusions={
            min_width: 300,
            min_height: 300,
            audio: true,
            };
        this.redirect=null;//"../index.html";
        this.redirect_timeout=1000;    
        this.score=0;

        var guideimg = uxm.imagepath + "etc/guide.gif";
        this.guidetag = '<p><img class="webrain-guide-img" src="' + guideimg + '"></p>';
        this.preload_images.push(guideimg);

        this.image_intro_logo=null;
        this.background_img=null;
        this.background_imgs=[];
        this.background_color=null;
        this.background_size='keepratio';//'stretch';
        this.background_position="center center"
        this.background_linear=null;
        this.db=null;
        this.debugmode=true;
        this.resolve=null;
        this.reject=null;
        this.performance={};
        this.span_lengths=null;    

        this.blankmode=false;
        this.include_env_trials=false;
        this.set_default();
    }

    example(){}
    set_default() { //변수 변경 전... 기본 값

    }
    init(){ // 변수 변경후 setup 이 호출

    }
    set_blank(){
        this.variable_files='';
        this.blankmode=true;
    }
    set_localpath(localpath,initflag=true) {
        if(localpath[localpath.length-1]!=='/') localpath+='/';
        this.localpath=localpath;
        if(initflag) this.init_variables(); 
    }
    set_task_variables(options){
        Object.keys(options).forEach((key) => {
            if((this.hasOwnProperty(key))) this[key]= options[key];
         });
    }  
    set_trial_variables(options){
        Object.keys(options).forEach((key) => {
            if((this.task_trial.hasOwnProperty(key))) {
                /*if(key==='stimuli_set') {
                    for(let i=0;i<options[key].length;i++) {
                        if(jsFunc.isImage(options[key][i])) options[key][i]=this.imagepath+options[key][i];
                    }
                }
                */
                this.task_trial[key]= options[key];
            }
         });
    }
    create_task_trial(stimuli=null) { 
        this.task_trial=new jsTrial('trial',this);
        if(stimuli!==null) this.stimuli_set=stimuli;     
    }

    set_task_trial(trial){
        if(trial!==undefined)
        {
            this.task_trial=trial;
            if(trial instanceof jsTrial) this.task_trial.set_task(this);
        }
        else if(this.task_trial===null) create_task_trial();   
        if(this.task_trial instanceof jsTrial) {
            this.task_trial.setup();        
            this.task_trial.compile();  
        }
    }
    check_background(imgs=null){
        if(imgs===null || imgs.length===0) { 
            imgs=[]; 
            let fn=this.localpath+'img/background_pc.png';
            imgs.push(fn);
            this.background_imgs.push({filename:fn,width:1024,height:768,checked:false,});
            /* nekim
            fn=this.localpath+'img/background_phone_wide.png';
            imgs.push(fn);
            this.background_imgs.push({filename:fn,width:1920,height:1080,checked:false,});
            */
            fn=this.localpath+'img/background_phone.png';
            imgs.push(fn);
            this.background_imgs.push({filename:fn,width:1080,height:1920,checked:false,});
        }
        if(imgs===null || imgs.length===0) return;

        this.background_img=imgs[0];
        for(let i=0;i<imgs.length;i++) {
            let img1= imgs[i];
            const img = new Image();
            img.refimgs=this.background_imgs;
            img.refimg=img1;
            img.taskID=this.taskID;
            img.onload = function() {
                for(let i=0;i<this.refimgs.length;i++) {
                    if (this.refimgs[i].filename===this.refimg) {
                        this.refimgs[i].width=this.width;
                        this.refimgs[i].height=this.height;
                        this.refimgs[i].checked=true;
                    }
                }  
                let flag=true;
                for(let i=0;i<this.refimgs.length;i++) {
                    if (!this.refimgs[i].checked) {flag=false; break;}
                }               
                if(flag) {
                    let ctask=exp.getTask(this.taskID);
                    if(ctask!==null) ctask.optimal_background_img();
                }
            }
            img.onerror = function() { 
                let id=-1;
                for(let i=0;i<this.refimgs.length;i++) {
                    if (this.refimgs[i].filename===this.refimg) id=i;
                }     
                if(id>=0) {console.log("image " + this.refimg + " was removed");this.refimgs.splice(id,1);}

                let flag=true;
                for(let i=0;i<this.refimgs.length;i++) {
                    if (!this.refimgs[i].checked) {flag=false; break;}
                }               
                if(flag) {
                    let ctask=exp.getTask(this.taskID);
                    ctask.optimal_background_img();
                }
            } 
            img.src =img1;
        }    
    }
    
    onResize(){
        if(this.background_imgs.length>1) {
            this.optimal_background_img();
            exp.update_background();
        }
    }

    optimal_background_img()
    {
        if(this.background_imgs.length===0) return;
        if(this.background_imgs.length===1) {this.background_img=this.background_imgs[0].filename;return;}      

        if(!this.background_imgs[0].hasOwnProperty('width')){
            let imgs=[];
            for(let i=0;i<this.background_imgs.length;i++) imgs.push(this.background_imgs[0].filename);
            this.check_background(imgs)   
            return; //나중에 구현.. 다음 계산 과정에 대해서..
        }
        let wrto=window.innerHeight/window.innerWidth;
        let id=0; let rtos=[]; let delta;
        for(let i=0;i<this.background_imgs.length;i++){
            let img=this.background_imgs[i]; 
            let irto=img.height/img.width;            
            if(irto<wrto) { //horizontally stretched image -> reduce width
                let rheight=window.innerWidth/img.width;
                let iheight=rheight*img.height;
                delta=(window.innerHeight-iheight)*window.innerWidth;
                this.background_imgs[i].ratio=[100,rheight*100]
            } else {
                let rwidth=window.innerHeight/img.height;
                let iwidth=rwidth*img.width;
                delta=(window.innerWidth-iwidth)*window.innerHeight;
                this.background_imgs[i].ratio=[rwidth*100,100]
            }
            rtos.push(delta);
        }
        id=jsFunc.min_array_index(rtos);
        this.background_img=this.background_imgs[id].filename;
    }

    set_background(background_img,sizemode=null,bkcolor=null,position=null,linear=null){
        this.background_img=background_img;       
        let wrto=window.innerHeight/window.innerWidth;let irto;
        if(sizemode!==null){
            if(sizemode==='keepratio') this.background_size='contain'; 
            else this.background_size='cover'; 
        } 
        if(position!==null) this.background_position=position;
        if(linear!==null) this.background_linear=linear;
        if(bkcolor!==null) this.background_color=bkcolor;
        this.chage_background_mode=true;
    }

    init_background(){
        if(this.background_img===null){            
            if(this.background_imgs.length==0) this.check_background(null);
            // promise 함수라.. 다음에 구현.. this.optimal_background_img();
        }
    }

    init_variables(){    //Task specific initialization, loading task specific js files.
        if(this.blankmode) return;
        this.image_intro_logo=this.localpath+'img/intro_logo.png';
        this.preload_images.push(this.image_intro_logo);
        this.welcometag = '<img class="welcome-logo-img" src = "' + this.image_intro_logo + '">'; // style="float:right">';    

        if (typeof welcome_msg !== "undefined") {
            this.html_welcome_msg = '<div  class="instruction-welcome">' + this.parse_local_variables(welcome_msg) + '</div>';   
            welcome_msg=undefined;
        }
        var instructions_msg = [];
        if (jsEnv.touchmode) {
            if (typeof instruction_msg1 !== "undefined"){
                instructions_msg.push("<div class='font-instruction'>" + this.parse_local_variables(instruction_msg1) + "</div>"); instruction_msg1=undefined;}                
            if (typeof instruction_msg2 !== "undefined"){
                instructions_msg.push("<div class='font-instruction'>" + this.parse_local_variables(instruction_msg2)+ "</div>"); instruction_msg2=undefined;}
            if (typeof instruction_msg3 !== "undefined"){
                instructions_msg.push("<div class='font-instruction'>" + this.parse_local_variables(instruction_msg3)+ "</div>"); instruction_msg3=undefined;}
            if (typeof instruction_msg4 !== "undefined"){
                instructions_msg.push("<div class='font-instruction'>" + this.parse_local_variables(instruction_msg4)+ "</div>"); instruction_msg4=undefined;}
            if (typeof instruction_msg5 !== "undefined"){
                instructions_msg.push("<div class='font-instruction'>" + this.parse_local_variables(instruction_msg5)+ "</div>"); instruction_msg5=undefined;}
            if (typeof instruction_msg6 !== "undefined"){
                instructions_msg.push("<div class='font-instruction'>" + this.parse_local_variables(instruction_msg6)+ "</div>"); instruction_msg6=undefined;}
        } 
        if(typeof instruction_img !== "undefined") {instructions_msg.push(instruction_img);this.preload_images.push(instruction_img);instruction_img=undefined;};
        if(instructions_msg.length>0) this.html_instruction_msg=instructions_msg;

        if (typeof ready_msg !== "undefined") {
            this.html_ready_msg = '<div class="font-instruction">' + this.parse_local_variables(ready_msg); + '</div>'; ready_msg=undefined;  
        }     
    }
    
    load_sequence_file(){
        this.sequence_data=jsFunc.read_csv_function(this.sequence_file,this.parse_sequence_data);
    }
    parse_sequence_data(csvfile) {
        /*
        //var data = $.csv.toObjects(csv);
        //var allRows = data.split(/\r?\n|\r/);     
        var allTextLines = csv.split(/\r\n|\n/);
        var sequence=[];
        for (var i=0; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            console.log(data);
            sequence.push(data[0]);
        }
        //alert(lines);
        if(exp.ctask!==undefined && exp.ctask!==null) exp.ctask.sequence_data=sequence;
        */
        var sequence=jsFunc.csvJSON(csvfile)
        console.log(sequence)        
        return sequence;
    }
    parse_local_variables(msg){   
        var msg1=msg;     
        if(typeof msg.replaceAll=='undefined') {
            String.prototype.replaceAll = function(search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement);
            };
            msg1=msg1.replaceAll(new RegExp(/%WELCOME_LOGO%/g, 'g'), this.welcometag).
            replaceAll(new RegExp(/%GUIDE%/g, 'g'), this.guidetag).
            replaceAll(new RegExp(/%IMAGEPATH%/g, 'g'),uxm.imagepath);
        } 
        else msg1=msg1.replaceAll(/%WELCOME_LOGO%/g, this.welcometag).
            replaceAll(/%GUIDE%/g, this.guidetag).
            replaceAll(/%IMAGEPATH%/g,uxm.imagepath);
        var msg1=jsFunc.replace_src_imgpath(msg1,this.localpath);        
        return msg1;
    }
    replace_nickname(msg){
        var msg1=msg;     
        if(!Array.isArray(msg)) {
            if(typeof msg.replaceAll=='undefined') {
                String.prototype.replaceAll = function(search, replacement) {
                    var target = this;
                    return target.replace(new RegExp(search, 'g'), replacement);
                };
                msg1=msg1.replaceAll(new RegExp(/%NICKNAME%/g, 'g'),exp.nickname); 
            } 
            else msg1=msg1.replaceAll(/%NICKNAME%/g, exp.nickname);     
        } else{  
            if(typeof msg.replaceAll=='undefined') {
                String.prototype.replaceAll = function(search, replacement) {
                    var target = this;
                    return target.replace(new RegExp(search, 'g'), replacement);
                };
                for (let i=0;i<msg.length;i++) msg1[i]=msg1[i].replaceAll(new RegExp(/%NICKNAME%/g, 'g'),exp.nickname); 
            } 
            else for (let i=0;i<msg.length;i++) msg1[i]=msg1[i].replaceAll(/%NICKNAME%/g, exp.nickname);     
        }
        return msg1;
    }

    setup(){ // internal setup 
        if(this.blankmode) return;
        if(this.background_img===null) this.init_background();
        if(this.variable_files!==null && this.html_welcome_msg===null) this.init_variables();

        this.db=new jsDatabase();
        this.db.set_task(this); this.db.init_default_info(); 
        this.db.init();

        this.sequence=[];
        this.set_default_trials();//compile 
    }

    set_redirect(redirect) { this.redirect=redirect;}
    exist_trial(id){
        var idx=[];
        for (let i=0;i<this.timeline.length;i++) {
            if(typeof this.timeline[i].ID!=='undefined'){
                if(this.timeline[i].ID===id) idx.push(i);
            }
        }
        return idx;
    }
    remove_trial(id){
        var idx=[];
        for (let i=0;i<this.timeline.length;i++) {
            if(typeof this.timeline[i].ID!=='undefined'){
                if(this.timeline[i].ID===id) idx.push(i);
            }
        }
        if(idx.length>0) {
            this.timeline.splice(idx, idx.length);
        }
    }

    display(){
        console.log(`TASK INFO:${this.name} with ID:${this.taskID}`);
    }
    set_fullscreen_trial(){
        if(env.timeline_fullscreen_flag) this.fullscreen_trial={
            type: "fullscreen",
            ID:'fullscreen',
            fullscreen_mode: true,
            message:uxm.html_full_screen_msg,
            button_label: "전체화면",
        }
    }

    set_pause_trial(sec,msg){
        return {
            type: 'html-keyboard-response',
            ID:'pause',
            stimulus: msg,
            post_trial_gap: 0,
            on_finish: function(){
                jsPsych.pauseExperiment();
                setTimeout(jsPsych.resumeExperiment, sec);
            }
        }
    }
    check_consent (elem) {
        if (document.getElementById("consent_checkbox").checked) {
            return true;
        } else {
            alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
            return false;
        }
        return false;
    }

    set_ask_consent_trial(ask_consent_trial){
        if(ask_consent_trial!==undefined) this.ask_consent_trial=ask_consent_trial;
        else 
        this.ask_consent_trial = {
            type: "external-html",
            ID:'consent',
            url: uxm.consent_html,
            cont_btn: "start",
            check_fn: this.check_consent,
        }
    }

    set_ask_informed_consent_trial(ask_informed_consent_trial){
        if(ask_informed_consent_trial!==undefined) this.ask_informed_consent_trial=ask_informed_consent_trial;
        else 
        this.ask_informed_consent_trial = {
            type: "unified-instructions",
            pages: [uxm.html_informed_consent_text],
            show_clickable_nav: true,
            button_label_next: uxm.button_consent,
            allow_backward: false
        };
    }

    set_audioguide_trial(ask_audioguide_trial,style=null){
        if(ask_audioguide_trial===undefined){ //no argument
            this.ask_audioguide_trial = {
                type: "unified-button-response",
                ID:'audioguide',
                stimulus_type: "html",
                stimulus: uxm.html_ask_audioguide_msg,
                choices: ["예", "아니오"],
                button_html: uxm.audioguide_answer_buttons,
                on_finish: function (data) {
                    if (data.button_pressed == 0) { //yes
                        env.use_audioguide_flag=true; // should be updated... 
                    }
                },  
            };
        } else this.ask_audioguide_trial=ask_audioguide_trial;
    }

    set_welcome_trial(welcome_trial){ 
        if(welcome_trial===undefined){ //no argument
            if(this.html_welcome_msg===null) return; 
            this.welcome_trial = {
                type: "unified-instructions",
                ID:'welcome',
                taskID:this.taskID,
                pages: this.html_welcome_msg, 
                show_clickable_nav: true,
                allow_backward: false,
                button_label_next: uxm.button_next,
                speech_mode:function(){ return env.use_audioguide_flag;},
                on_start: function (trial) { //소유주는 unified_instructions 이므로 this. 도 그러함.. 주의해야 함.. 
                    instructionWebrainBars();
                    trial.pages=exp.replace_nickname(trial.pages)
                    if (bowser.name == "Firefox" || bowser.name == "Chrome") {
                        var ctask=exp.getTask(this.taskID);
                        if(ctask!==null) trial.pages =exp.replace_nickname(ctask.html_welcome_msg); //외부에 존재하는 cog module obj의 값을 
                    } else {
                        var ctask=exp.getTask(this.taskID);
                        if(ctask!==null) trial.pages =exp.replace_nickname(ctask.html_welcome_msg); //외부에 존재하는 cog module obj의 값을 

                        //trial.pages = uxm.not_supported_page;                      
                        //setTimeout(function () {
                        //location.href = "html/not_supported.html";
                        //}, 2000);                        
                    }
                    
                    console.log('Welcome!')
                },
                on_finish: function(data){
                    let sbar=document.getElementById("webrain-statusbar-container");
                    if(sbar!==null && sbar!==undefined) sbar.remove();
                    drawWebrainBars(true);                    
                },
            }
        } 
        else this.welcome_trial = welcome_trial;
    }

    set_instruction_trial(instruction_trial){
        if(instruction_trial===undefined){ 
            if(this.html_instruction_msg===null) return;
            this.instruction_trial = {
                type: "unified-instructions",
                ID:'instruction',
                taskID:this.taskID,
                pages: this.html_instruction_msg,
                speech_mode:function(){ //the owner of this is 'unified-instructions'
                    return env.use_audioguide_flag;
                },
                show_clickable_nav: true,
                allow_backward: true,
                button_label_next: uxm.button_next,
                button_label_previous: uxm.button_prev,
                on_start: function (trial) {
                    console.log('Instruction1!')
                    instructionWebrainBars();
                    trial.pages=exp.replace_nickname(trial.pages)
                    var ctask=exp.getTask(this.taskID);
                    if(ctask!==null) trial.pages = exp.replace_nickname(ctask.html_instruction_msg); //check if necessary

                    console.log('Instruction2!')
                },
                on_finish: function(data){
                    document.getElementById("webrain-statusbar-container").remove();
                    drawWebrainBars(true);                    
                }
            };        
        }
        else this.instruction_trial=instruction_trial;
    }

    set_instruction_video_trial(instruction_video_trial){
        if(instruction_video_trial===undefined){ 
            if(this.instruction_video===null) return;
            this.video_instruction_trial={
                type: "video-button-response",
                ID:'instructionvideo',
                stimulus: this.instruction_video,
                choices: ["다음"],
            }
        }
        else this.instruction_video_trial=instruction_video_trial;
    }

    set_debrief_trial(debrief_trial){
        if(debrief_trial===undefined){
            this.debrief_trial = {
                type: "unified-button-response",
                ID:'debrief',
                taskID:this.taskID,
                stimulus_type: "html",
                speech_text: function () { 
                    if(env.use_audioguide_flag) return jsFunc.html2text(exp.replace_nickname(uxm.debrief_msg));  else return null; 
                },
                guide_image:uxm.guide_image,
                stimulus: function () {
                    var ctask=exp.getTask(jsPsych.currentTrial().taskID);
                    return exp.replace_nickname(ctask.callback_get_debrief().replaceAll(/%GUIDE%/g, ctask.guidetag)); // 바꾸어야 함.
                },
                choices: ["예", "아니오"],
                response_ends_trial:true,
                button_html: uxm.retest_answer_buttons,
            }
        }
        else this.debrief_trial=debrief_trial;
    }

    set_prolog_trials(prolog_trials){
        if(prolog_trials===undefined) var prolog_trials=this.prolog_trials;
        this.prolog_trials = prolog_trials;
    }
    set_epilog_trials(epilog){
        if(epilog===undefined) var epilog=this.epilog_trials;
        this.epilog_trials = epilog;
    }
    
    set_pre_tasktrial(pre_tasktrial){
        if(pre_tasktrial===undefined) {
            this.pre_tasktrial = {
                type: "unified-no-response",
                stimulus: '<div style="font-size:' + this.fixation_size + 'px;">+</div>',
                trial_duration: this.pre_tasktrial_duration,
            }
            this.timeline_pre_tasktrial_flag=true;
        } else {
            this.pre_tasktrial=pre_tasktrial;
            this.timeline_pre_tasktrial_flag=true;
        }
    }

    set_feedback_sound_trial(){
        this.feedback_sound_trial = {
            type: "audio-keyboard-response",
            stimulus: function () {
                var data = jsPsych.data.get().last(1).values()[0];
                if (data.correct) {
                    return uxm.sound_feedback_correct;
                } else {
                    return uxm.sound_feedback_incorrect;
                }
            },
            choices: jsPsych.NO_KEYS,
            trial_duration: this.feedback_snd_duration,
            trial_ends_after_audio: this.feedback_snd_ends_after_audio,
        };
    }
    set_feedback_sound_prompt_trial(){
        this.feedback_sound_prompt_trial = {
            type: "audio-keyboard-response",
            stimulus: function () {
                var data = jsPsych.data.get().last(1).values()[0];
                if (data.correct) {
                    return uxm.sound_feedback_correct;
                } else {
                    return uxm.sound_feedback_incorrect;
                }
            },
            choices: jsPsych.NO_KEYS,
            prompt: this.callback_feedback_prompt,
            trial_duration: this.feedback_snd_duration_slow,
            timing_post_trial: this.feedback_snd_duration_slow,
            trial_ends_after_audio: false,
        };
    }

    set_ask_pretest_trial(ask_pretest_trial){
        if(ask_pretest_trial===undefined && this.ask_pretest_trial==null){
            this.ask_pretest_trial = {
                type: "unified-button-response",
                taskID:this.taskID,
                stimulus_type: "html",
                stimulus: uxm.html_ask_pretest_msg,
                choices: ["예", "아니오"],
                speech_text: function () { if(env.use_audioguide_flag) return jsFunc.html2text(uxm.html_ask_pretest_msg); else {return null;} },
                button_html: uxm.pretest_answer_buttons,
            };
        } else this.ask_pretest_trial=ask_pretest_trial;
    }

    set_pretest_session(pretest_sequence){
        if (pretest_sequence===undefined){            
            if(this.pretest_sequence===null){
                if (this.task_trial===null) this.set_task_trial();
                var task_trial = [this.task_trial.trial];
                if (this.timeline_pre_tasktrial_flag) task_trial = [this.pre_tasktrial, this.task_trial.trial];
                if (this.timeline_feedback_sound_flag) task_trial = task_trial.concat(this.feedback_sound_trial);
        
                this.pretest_sequence = {
                    timeline: task_trial,
                    timeline_variables: this.pretest_trial_sequence,
                };      
            }      
        }
        else this.pretest_sequence=pretest_sequence;
        if (this.pretest_sampling_method !== null) this.pretest_sequence.sample = this.pretest_sampling_method;
        if(this.debrief_pretest_trial==null) this.set_debrief_pretest_trial()    
        if(Array.isArray(this.pretest_sequence)) this.pretest_sequence=this.pretest_sequence.concat(this.debrief_pretest_trial);
        else this.pretest_sequence=[this.pretest_sequence,this.debrief_pretest_trial];

    }

    set_pretest_session_loop(pretest_session_loop){
        if(pretest_session_loop===undefined){
            this.set_pretest_session();    

            var pretest_loop = {
                timeline: this.pretest_sequence,
                loop_function: function (data) {
                    var ctask=exp.getTask();
                    ctask.pretest_scores.push(ctask.score);      
                    ctask.npresession++; ; //control number of iteratons
                    ctask.score=0;  
                    console.log(ctask.npresession);                    
                    if (ctask.npresession < ctask.pretest_session_max_iteration) {
                        var prevresp = jsPsych.data.get().last(1).values()[0];
                        if (prevresp.button_pressed == 1) { //no, next
                            ctask.trial_count=0;
                            ctask.phasemode="test";
                            return false;
                        } else { //yes, and retry
                            ctask.phasemode="pretest";
                            ctask.trial_count=0;
                            return true;
                        }
                    } else {
                        return false;
                    }
                },
            }
            this.pretest_session_loop = {
                timeline: [pretest_loop],
                conditional_function: function () {
                    //with regard to 'ask_pretest_trial
                    var data = jsPsych.data.get().last(1).values()[0];
                    var ctask=exp.getTask();
                    ctask.save_session_data(false);    
                    
                    if (data.button_pressed == 0) { //pretest again                        
                        //YES
                        ctask.reset_session("pretest");
                        ctask.statusbar_display();
                        this.trial_count=0;
                        ctask.score_display();
                        return true;
                    } else { //no more 
                        //NO
                        ctask.reset_session("test");
                        ctask.statusbar_display(false);
                        return false;
                    }
                },
            };
        } 
        else this.pretest_session_loop=pretest_session_loop;
    }
    set_debrief_pretest_trial(){
        this.debrief_pretest_trial = {
            type: "unified-button-response",
            ID:'debrief',
            taskID:this.taskID,
            stimulus_type: 'html',
            stimulus: uxm.html_ask_retest_msg,
            choices: ["예", "아니오"],  
            guide_image:uxm.guide_image,
            speech_text: function () { 
                if(env.use_audioguide_flag) return jsFunc.html2text(exp.replace_nickname(uxm.html_ask_retest_msg));  else return null;             
            },
            button_html: uxm.retest_answer_buttons,
            response_ends_trial:true,
        };
    }

    set_test_ready_trial(test_ready_trial){
        if(test_ready_trial===undefined){
            if(this.html_ready_msg===null) return;
            this.test_ready_trial = { //owner
                type: "unified-button-response",
                taskID:this.taskID,
                stimulus_type: "html",
                speech_text: function () {
                    if(env.use_audioguide_flag) return jsFunc.html2text(exp.replace_nickname(exp.getTask().html_ready_msg)); else return null; 
                },
                guide_image:uxm.guide_image,
                stimulus: this.html_ready_msg,
                button_html: uxm.button_start,
                choices: uxm.test_ready_choices,
                post_trial_gap: 1000,
                on_start:function(trial){
                    trial.stimulus=exp.replace_nickname(trial.stimulus);
                },
                on_finish: function (data) { 
                    var ctask=exp.getTask(this.taskID);
                    if(ctask!==null) {
                        ctask.reset_session("test");                             //
                        ctask.statusbar_display();
                        ctask.score_display();
                        exp.set_current_task(ctask.taskID);

                        if(ctask.task_trial.stimulus_type==='background'){
                            let str;
                            document.querySelector("body").style.backgroundRepeat = "no-repeat";
                            document.querySelector("body").style.backgroundPosition = "center center";
                            
                            if(this.background_size==null) str='100% 100%';
                            else {
                                if(window.innerWidth>window.innerHeight) str="auto 90%";
                                else str="90% auto";
                                document.querySelector("body").style.backgroundSize = str;   
                            }
                        }  
                    }
                },
            };
        }
        else this.test_ready_trial=test_ready_trial;   
    }
    
    set_test_end_trial(){
        this.test_end_trial = {
            type: "unified-button-response",
            stimulus: uxm.html_goodjob_msg,
            taskID:this.taskID,
            stimulus_audio: null,//uxm.sound_test_end,           
            stimulus_type:'html',
            guide_image:uxm.guide_image,
            trial_duration: 2500,
            trial_ends_after_audio: true,
            button_html:'',
            on_start(trial){
                exp.update_background();
            },
            speech_text: function () {
                if(env.use_audioguide_flag) return exp.replace_nickname("%NICKNAME%,수고하셨습니다!");
            },
            on_finish: function (data) { 
                exp.ctask.statusbar_display(false);
            },
        };
    }

    set_test_session(test_session){
        let pret=false;
        if (test_session===undefined){
            if(this.task_trial===null) this.set_task_trial();
            if(this.task_trial.trial.hasOwnProperty('timeline')){
                this.test_sequence=this.task_trial.trial;                
            }else if(Array.isArray(this.task_trial.trial)){
                this.test_sequence=this.task_trial.trial;               
            } else {
                var task_trials = [this.task_trial.trial];
                if (this.timeline_pre_tasktrial_flag){
                    if(this.pre_tasktrial.hasOwnProperty('timeline')){ //in the form of sequence, not tested yet
                        pret=true;
                        task_trials = [this.task_trial.trial];
                    } else 
                        task_trials = [this.pre_tasktrial, this.task_trial.trial];
                } 
                if (this.timeline_feedback_sound_flag) task_trials = task_trials.concat(this.feedback_sound_trial);
        
                this.test_sequence = {
                    timeline: task_trials,
                    timeline_variables: this.task_trial_sequence,
                };
            }
            if (this.sampling_method !== null) this.test_sequence.sample = this.sampling_method;
            this.test_session=[]; 
            if(pret) this.test_session=this.test_session.concat(this.pre_tasktrial)
            this.test_session=this.test_session.concat(this.test_sequence)
            if (this.use_test_end_trial) this.test_session=this.test_session.concat(this.test_end_trial);
            if (this.use_debrief_trial || this.span_lengths==null) this.test_session=this.test_session.concat(this.debrief_trial);
        }
        else this.test_session=test_session;
    }
    
    set_test_session_loop(session_loop){
        if(session_loop===undefined){
            if(this.test_session===null) this.set_test_session();
            this.test_session_loop = {
                timeline: this.test_session, //core
                loop_function: function (data) { //session loop
                    var ctask=exp.getTask();
                    ctask.save_session_data(true);
                    ctask.task_finished=false;            
                    ctask.nsession++; //control number of iteratons
                    console.log(ctask.nsession);
                    var flag = true;
                    if(ctask.span_lengths==null) flag=false;

                    if (ctask.nsession < ctask.test_session_max_iteration) { 
                        var prevresp = jsPsych.data.get().last(1).values()[0];
                        if (prevresp.button_pressed == 1) flag = false; //
                        else if (prevresp.button_pressed == 0) flag = true; //                        
                    } else flag = false;
           
                    if (flag) { //do it again
                        ctask.reset_session("test");
                        ctask.update_session_level(true);
                        ctask.statusbar_display();
                        ctask.score_display();
                    }
                    else{
                        ctask.statusbar_display(false);
                    }
                    return flag;
                },
            }
        } else this.test_session_loop=test_session_loop;
    }
    //////

    add_trial(trial){
        if (this.trial.length) this.timeline.push(trial);
    }
    add_taskid_trial(){ //basic playground setting...
        if(this.blankmode) return;
        var trial={
              type: 'unified-no-response',
              taskID:this.taskID,
              stimulus: '',
              stimulus_audio:'',
              on_start: function(trial) {
                if(exp.verbose) {
                    var id = jsPsych.currentTimelineNodeID();
                    console.log('Task:'+trial.taskID + ' Type: ' +trial.type+ ' TimelineNode ID is '+id);
                    var d=jsPsych.data.get().values();
                    if(env.verbose) if(d.length>0) console.log('   ['+d[0].taskID + ' was given]');              
                }    

                jsPsych.data.reset();    

                var dinfo= {
                    researcherID:exp.researcherID,
                    projectID:exp.projectID,  
                    participantID:exp.participantID,
                    sessionID:exp.sessionID,   //게임 코스 고유값
                    reload:exp.reload,   //이어하기 횟수
                    taskID:this.taskID, 
                    taskname:this.name,    
                    age:exp.Age,
                    gender:exp.Gender,
                };
                jsPsych.data.addProperties(dinfo)  
                if(exp.verbose) {
                    var d=jsPsych.data.get().values();
                    if(d.length>0) console.log('   ['+d[0].taskID + ' is now set]');
                }    
                exp.set_current_task(this.taskID);                
                exp.update_background();               
              },
              trial_duration: 0,
        };
        //this.preload_audio.push(uxm.sound_show_result);
        this.timeline.push(trial);
    }
    add_prolog_trials(prolog_trials)
    {
        if(prolog_trials!==undefined) this.prolog_trials=prolog_trials;
        if (this.prolog_trials!==null) {
            for (let i=0;i<this.prolog_trials.length;i++) this.timeline.push(this.prolog_trials[i]);
        }
    }
    add_welcome_trial(welcome_trial){
        if(welcome_trial!==undefined) this.welcome_trial=welcome_trial;
        if (this.welcome_trial!==null) this.timeline.push(this.welcome_trial);
    }
    add_instruction_trial(instruction_trial){
        if(instruction_trial!==undefined) this.instruction_trial=instruction_trial;
        if (this.instruction_trial!==null) this.timeline.push(this.instruction_trial);
    }
    add_audioguide_trial(ask_audioguide_trial){
        if(ask_audioguide_trial!==undefined) this.ask_audioguide_trial=ask_audioguide_trial;
        if (this.ask_audioguide_trial!==null) this.timeline.push(this.ask_audioguide_trial);
    }
    add_fullscreen_trial(fullscreen_trial){
        if(fullscreen_trial!==undefined) this.fullscreen_trial=fullscreen_trial;
        if (this.fullscreen_trial!==null) this.timeline.push(this.fullscreen_trial);
    }
    add_test_ready_trial(test_ready_trial){
        if (test_ready_trial!==undefined) this.test_ready_trial=test_ready_trial;
        if (this.test_ready_trial!==null) this.timeline.push(this.test_ready_trial);
    }
    add_test_session(test_session){
        if (test_session!==undefined) this.test_session=test_session;
        if (this.test_session!==null) this.timeline.push(this.test_session);
    }
    add_pretest_session_loop(pretest_session_loop){
        if (pretest_session_loop!==undefined) this.pretest_session_loop=pretest_session_loop;
        if (this.pretest_session_loop!==null) {
            if (this.ask_pretest_trial===null) this.set_ask_pretest_trial();
            this.timeline.push(this.ask_pretest_trial);
            this.timeline.push(this.pretest_session_loop);
        }
    }

    add_test_session_loop(test_session_loop){
        if (test_session_loop!==undefined) this.test_session_loop=test_session_loop;
        if (this.test_session_loop!==null) this.timeline.push(this.test_session_loop);
    }

    add_debrief_trial(debrief_trial){
        if(debrief_trial!==undefined) this.debrief_trial=debrief_trial;
        if (this.debrief_trial!==null) this.timeline.push(this.debrief_trial);
    }

    add_epilog_trials(epilog_trials)
    {
        if(epilog_trials!==undefined) this.epilog_trials=epilog_trials;
        if (this.epilog_trials!==null) {
            for (let i=0;i<this.epilog_trials.length;i++) this.timeline.push(this.epilog_trials[i]);
        }
    }

    add_env_trial(){
        this.timeline.push(trlib.record_zoom_events_trial);
        if(this.fullscreen_trial!==null) this.timeline.push(trlib.fullscreen_off_trial);
    }

    set_default_trials(){ 
        if(this.taskID.length==0) this.taskID=this.name+'-'+jsPsych.randomization.randomID(5);
        this.set_audioguide_trial();
        this.set_fullscreen_trial();
        this.set_prolog_trials();    
        this.set_welcome_trial();
        this.set_instruction_trial();
        this.set_test_ready_trial();
        this.set_task_trial();
        this.set_test_end_trial();
        this.set_debrief_trial();
        this.set_pretest_session_loop();
        this.set_test_session();                
        this.set_test_session_loop();      
        this.set_epilog_trials();        
    }

    compile_basic() {
        this.add_audioguide_trial();
        this.add_fullscreen_trial();
        this.add_prolog_trials();
        this.add_welcome_trial();
        this.add_instruction_trial();
        this.add_test_session();
        this.add_debrief_trial();
        this.add_epilog_trials();
        this.add_env_trial();                  
    }
    compile(trialall=true,envmode=false,pretestmode=true) {
        if(this.blankmode) {
            if(this.task_trial) this.timeline.push(this.task_trial); return;
        }
        if(envmode || this.include_env_trials)
        {
            this.add_audioguide_trial();
            this.add_fullscreen_trial();
        }
        
        this.add_taskid_trial();
        if(trialall) {
            this.add_prolog_trials();
            this.add_welcome_trial();
            this.add_instruction_trial();      
            if(pretestmode) this.add_pretest_session_loop()      
        }
        this.add_test_ready_trial();
        this.add_test_session_loop();
        if(trialall){       
            this.add_epilog_trials();
            this.add_env_trial();     
        }  
        if(exp.verbose) console.log("*** "+ this.taskID+" is compiled... ***")
    }

    on_data_update(){}   
    callback_get_debrief(){return '';};
    callback_feedback_prompt(){return '';}

    // save responses
    register_task_info(){ 
        this.task_info={
          taskID:this.taskID,  
          taskname:this.name,   
          creator:null,   
          registration_date:jsFunc.toSqlDatetime(new Date()),
          category:null,
          status:null,
          credit:null,  
          description:null,
          information:null,
          link:null,
          reference:null,
          conditions:null,     
          stimulation_type:this.stimulus_type, 
          stimulation_choices:jsFunc.array_to_string(this.task_trial.response_choices),
          stimulus_duration:this.stimulus_duration, 
          trial_duration:this.trial_duration, 
          post_trial_gap:this.post_trial_gap, 
          poststimulus:this.poststimulus,
          pre_tasktrial_duration:this.pre_tasktrial_duration,  
          stim_param_descript:null,      
          sequence_length :this.sequence_length,  
          response_ends_trial:this.response_ends_trial,   
          wait_duration_after_multiresponses:this.wait_duration_after_multiresponses,
          max_response_count:this.max_response_count,
          button_stimulus_mode:this.button_stimulus_mode,  
          adaptivemode:this.adaptivemode,      
          default_param:null, //JSON
          }
      }

      update_task_session_info(){ //cogtask       
        let pretest_scores=null;
        if(this.pretest_scores.length>0) {
            pretest_scores=jsFunc.array2csv(this.pretest_scores);
        } 
        var task_info1={ // add these variables to all rows of the datafile
          taskID:this.taskID,
          taskname:this.name,
          session:this.nsession,
          start_time:jsPsych.startTime(), 
          total_time:jsPsych.totalTime(),
          score:this.score, 
          trial_count:this.trial_count,
          phase:this.phasemode,
          pretest_scores:pretest_scores,
          /* updated by task debrief
          conditions:null,
          rt_mean,rt_std,,, 
          result1:null,  
          result2:null, 
          result3:null, 
          result4:null, 
          result5:null, .. result15,
          results_descript:null, 
          task_file:null,  
          result_file:null, 
          etc:null,   
          */
        };
        this.task_session_info=Object.assign(this.task_session_info,task_info1);
    }

    statusbar_display(flag=true) {
        if(!env.playground_ready) return; 
        if(flag){
            let status=`<p class="font-score"><span>${this.nickname}</span> </p>`;
            exp.set_DOM_statusbar_status(status);

            let info=`<p class="font-score">${this.level_info}</p>`;
            exp.set_DOM_statusbar_info(info);

            let val=this.sequence_length; if(this.phasemode=='pretest') val=this.pretest_sequence_length;
            let score=`<p class="font-score">시행:${this.trial_count}/${val} <font color='red'> 점수: ${this.score} </p></font>`;
            exp.set_DOM_statusbar_score(score);

            let style=''; if(this.instruction_keyword_color!==null) style=`style="color:${this.instruction_keyword_color};"`;
            let instruction=`<p class="font-keyword" ${style}>${this.instruction_keyword} </p>`;
            exp.set_DOM_top_message_container(instruction);   

            let bottommsg=`<p class="font-keyword">${this.bottom_message} </p>`;
            exp.set_DOM_bottom_message_container(bottommsg);
            if(1){
                //jsFunc.calcTextWidth('webrain-statusbar-status')
                //calcTextWidth('webrain-statusbar-info')
                //calcTextWidth('webrain-top-message-container')
            }
            //textFit('webrain-statusbar-status',{alginVert:true,alignHoriz:true})
            //textFit('webrain-statusbar-info')
            //$('#webrain-statusbar-status').textfill();
            //new jsFitText('webrain-statusbar-status')
            //new jsFitText('webrain-top-message-container')
        }        
        else{
            let status='';
            exp.set_DOM_statusbar_status(status,'hidden');
            let info='';
            exp.set_DOM_statusbar_info(info,'hidden');
            let score='';
            exp.set_DOM_statusbar_score(score,'hidden');
            let top='';
            exp.set_DOM_top_message_container(top,'hidden');       
            let bottommsg='';
            exp.set_DOM_bottom_message_container(bottommsg,'hidden');      
        }
        if(env.debug_display_border) debug_border_displayed_objects();
    };

    statusbar_reset() {
        if(!env.playground_ready) return; 
        //this.task_trial.set_DOM_statusbar_status('');
        //this.task_trial.set_DOM_top_message_container('');       
        //this.task_trial.set_DOM_bottom_message_container('');
        //resetWebrainBars();
    };

    score_display (count=this.trial_count, score=this.score,phase=this.phasemode) {
        if(!env.playground_ready) return; 
        let scorevar='';
        if(phase=='pretest'){
            scorevar=`<p class="font-score">예비 시행:${count+1}/${this.pretest_sequence_length} <font color='red'> 점수: ${score} </p></font>`;
        }
        else{
            scorevar=`<p class="font-score">시행:${count+1}/${this.sequence_length} <font color='red'> 점수: ${score} </p></font>`;
        }
        document.querySelector("#webrain-statusbar-score").innerHTML = scorevar;
        //calcTextSize('webrain-statusbar-score');
    };

    reset_session(phase="test") { 
        this.score = 0;
        this.trial_count = 0;
        this.phasemode=phase;
 
        this.task_session_info={
            researcherID:exp.researcherID,
            projectID:exp.projectID,
            participantID:exp.participantID,
            sessionID:exp.sessionID,   //게임 코스 고유값
            reload:exp.reload,   //이어하기 횟수
            nickname:exp.nickname,
            age:exp.Age,
        }
        this.env_info={
            audio_used:env.use_audioguide_flag,
            online:env.online,
            browser_name: bowser.name, browser_version: bowser.version,
            os_name: bowser.osname, os_version: bowser.osversion,
            tablet: String(bowser.tablet), mobile: String(bowser.mobile),  // convert explicitly to string so that "undefined" (no response) does not lead to empty cells in the datafile
            screen_resolution: screen.width + ' x ' + screen.height,
            window_resolution: window.innerWidth + ' x ' + window.innerHeight, // this will be updated throughout the experiment
            fullscreen:env.timeline_fullscreen_flag,
        }
        jsPsych.data.reset();

        var dinfo= {
            researcherID:exp.researcherID,
            projectID:exp.projectID,  
            participantID:exp.participantID,   
            sessionID:exp.sessionID,   //게임 코스 고유값
            reload:exp.reload,   //이어하기 횟수
            nickname:exp.nickname,
            taskID:this.taskID, 
            taskname:this.name,    
            age:exp.Age,
            gender:exp.Gender,
        };
        jsPsych.data.addProperties(dinfo)  
    }
  
    save_session_data(flag=true) {
        if(!flag) return; //pretest
        jsPsych.data.addProperties({session:this.nsession,taskID:this.taskID,});
        this.register_task_info();
        this.update_task_session_info();
        if(exp) {            
            let ignore_columns = ['internal_node_id','stimulus_audio','rt_audio','key_press','button_pressed','responses','age','gender'];
            let search_option = {phase: 'test'}; // we are only interested in our main stimulus, not fixation, feedback etc.        
            let selected_data = jsPsych.data.get().filter(search_option).ignore(ignore_columns);
            let d = selected_data.values() // get the data values
            //console.log('+++ ' + this.taskID+ " trial:"+ d[0].taskID+' is stored')
            exp.append_data(d);  
            exp.append_scores(Object.assign(this.task_session_info,this.performance));      
        }     
        if(flag) this.db.save_result_data(); 
    }
    update_session_level(flag) {
        //background_img='img1/background.png';
        //document.querySelector("body").style.backgroundImage =`url("${background_img}")`;
        //stimulus_duration=stimulus_duration*3;
        this.level_info=this.nsession;
     };

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

        sdata=trial_sequence.filter({stim_type: targetcode});
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
        sdata=trial_sequence.filter({stim_type: nontargetcode});
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
        if(result.nontarget_correct_count>0){
            result.nontarget_correct_rt_mean = cdata.select('rt').mean();
            result.nontarget_correct_rt_sd = cdata.select('rt').sd();
        } else {
            result.nontarget_correct_rt_mean=null;
            result.nontarget_correct_rt_sd=null;
        }

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

    get_debrief_type(mode,targetcodes=null){
        var html; 
        if(mode==='congruent'){     
            if(targetcodes==null) targetcodes=[exp.INCONGRUENT,exp.CONGRUENT];
            this.evaluate_performance(targetcodes[0],targetcodes[1]);
            html= "%GUIDE%"+
            "결과는 다음과 같습니다.<br>총 시행자극수: <strong>" + this.performance.total_count + "회 총점수: " +this.performance.total_score+ " </strong><br>"+
            "정확도: <strong>" + Math.round(this.performance.accuracy) + "%</strong>.<br>"+
            "일치 자극에 대한 평균 응답 속도: <strong>" + Math.round(this.performance.nontarget_rt_mean) + "ms</strong>.<br>"+
            "불일치 자극에 대한 평균 응답 속도: <strong>" + Math.round(this.performance.target_rt_mean) + "ms</strong>.<br>"+
            "다시 하시겠습니까?";
        }
        else if(mode=='nback'){      
            if(targetcodes==null) targetcodes=[exp.TARGET,exp.NONTARGET];
            this.evaluate_performance(targetcodes[0],targetcodes[1]);  
            html = "%GUIDE%"+
            "결과는 다음과 같습니다.<br>총 시행자극수: <strong>" + this.performance.total_count + "회 총점수: " +this.performance.total_score+ " </strong><br>"+
            "당신의 정확도는 "+ Math.round(this.performance.accuracy)+"점 입니다.<br>"+
            "당신의 민감도는 "+ Math.round(this.performance.sensitivity)+"점 입니다.<br>"+
            "당신의 특이도는 "+ Math.round(this.performance.specificity)+"점 입니다.<br>"+
            "다시 하시겠습니까?"
        }
        return html;
    }
   


    run(){
        this.preload_images=this.preload_images.concat(uxm.preload_images);
        this.preload_audio=this.preload_audio.concat(uxm.preload_audio);
        if(this.preload_images.length>1) this.preload_images=[...new Set(this.preload_images)]; //remove duplicates
        if(this.preload_audio.length>1) this.preload_audio=[...new Set(this.preload_audio)]; // remove duplicates

        jsPsych.init({
            timeline: this.timeline,
            use_webaudio: env.use_webaudio_flag,
            preload_audio: this.preload_audio,
            preload_images: this.preload_images,
            preload_video: this.preload_video,
            show_preload_progress_bar: this.show_preload_progress_bar, // hide preload progress bar
            show_progress_bar: this.use_jspsych_progressbar_flag,
            show_preload_progress_bar: this.use_jspsych_progressbar_flag,
            auto_update_progress_bar: this.auto_update_progress_bar,
            message_progress_bar: this.message_progress_bar,
            override_safe_mode:!env.online,
            exclusions:this.exclusions,
            on_data_update: this.on_data_update,
            on_finish: function () {        
                //jsPsych.data.displayData();           
                //jsPsych.getDisplayElement().innerHTML = goodbye_html;
                let ctask=exp.getTask();
                if(ctask.redirect!==null && ctask.redirect!==undefined) setTimeout("location.href = '" + ctask.redirect + "';", ctask.redirect_timeout); // redirect to another URL with a certain delay, only when redirect_onCompletion is set to 'true'
                //jsPsych.endExperiment();
                if(ctask.resolve!==null){
                    console.log("   RESOLVE:"+this.taskID);
                    ctask.resolve(ctask.taskID);
                }
            },
            on_interaction_data_update: function (data) { //interaction data logs if participants leaves the browser window or exits full screen mode
                console.log(JSON.stringify(data));
                env.interaction = data.event;
                if (env.interaction.includes("fullscreen")) {
                    // some unhandy coding to circumvent a bug in jspsych that logs fullscreenexit when actually entering
                    if (env.timeline_fullscreen_flag == false) {
                        env.timeline_fullscreen_flag = true;
                    return env.timeline_fullscreen_flag;
                    } else if (env.timeline_fullscreen_flag) {
                        env.timeline_fullscreen_flag = false;
                    return env.timeline_fullscreen_flag;
                    }
                } else if (env.interaction == "blur" || env.interaction == "focus") {
                    focus = env.interaction;
                    return focus;
                }
            },
        });        
    }

    run_promise () { //not working
        var promise = new Promise((resolve, reject) => {
          /* missing implementation */
          this.resolve=resolve;
          this.reject=reject;
          this.run();
        });      
        return promise;
    };
}