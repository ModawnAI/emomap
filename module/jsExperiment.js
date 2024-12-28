class jsExperiment {
    constructor (name) {
        this.name=name;
        this.type='Basic';
        this.tasks=[];
        this.taskcode='00000';

        this.researcherID='RXXXX_12345';
        this.projectID='PXXXX_12345';
        this.participantID=jsPsych.randomization.randomID(15);
        this.sessionID=jsPsych.randomization.randomID(16); //게임 코스 고유값
        this.reload=0; //이어하기 횟수
        this.nickname='여러분'
        this.Age=100;
        this.Gender='U';
        
        this.append_mode='promise';
                
        this.ctrial=null;
        this.ctask=null;

        this.mql1=null;
        this.mql2=null;
        this.mql3=null;

        this.TARGET='t';
        this.NONTARGET='n';
        this.CONGRUENT='c';
        this.INCONGRUENT='i';
        this.NEUTRAL='n';

        this.default_options=null;
        this.promises=[];
        this.verbose=false;
        this.default_bk_style="background-color:white; color: black; width:90%;opacity:0.8;";

        this.task_data=[];
        this.task_scores=[];

        this.sequence_tmp=[];

        this.schedule=null;
        this.todolist=null;
        this.tasklist=null;
        this.consent_html='./pages/consent_page_adult.html';
        this.consent_children_html='./pages/consent_page_children.html';
    }    
    set_default_options(options) {this.default_options=options;}
    unset_default_options() {
        this.default_options=null;
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
    get_consent_html(isadult=true){
        if(isadult) if(this.Age<20) isadult=false;
        if(isadult) return this.consent_html;
        else return this.consent_children_html;
    }
    get_consent_msg_html(isadult=true){
        let consent_msg_html='<p>본 과제에 참여해 주셔서 감사합니다.<br> 본 과제는 인지조절력을 평가하게 됩니다.</p>';
        let consent_msg_html_children='<p>본 과제에 참여해 주셔서 감사합니다. <br>본 과제는 인지조절력을 평가하게 됩니다.<br> 본 과제는 보호자의 동의가 필수적입니다.</p>';

        let html;let msg_html;
        if(isadult) if(this.Age<19) isadult=false;
        if(!isadult) msg_html=consent_msg_html_children;
        else msg_html=consent_msg_html;

        html=`<div id="consent">${msg_html}
        <p>과제에 참여 하시려면 아래 체크 박스에 체크하시고 "과제 참여" 버턴을 누르세요.</p>
        <p><input type="checkbox" id="consent_checkbox" />나는 본 과제에 자발적으로 참여하는 것에 동의합니다.</p>
        <button type="button" class="btn btn-default btn-sm" onClick="window.print();">
            <span class="glyphicon glyphicon-print"></span> 인쇄하기
        </button>
        <button type="button" id="start">과제 참여</button></div>`;
        return html;
    }
    add_consent(){        
        let ask_consent_trial = {
            type: "external-html",
            ID:'consent',
            url: exp.get_consent_html(),
            on_start:function(trial){
                trial.url=exp.get_consent_html();
            },
            cont_btn: "start",
            check_fn: function(elem){
                if (document.getElementById("consent_checkbox").checked) {
                    return true;
                } else {
                    alert("참여하시려면, 동의서 아래 '과제에 참여하는 것을 동의합니다' 란에 체크 해주세요.");
                    return false;
                }
            },
        }
        this.add_page(ask_consent_trial);
    }
    add_task(task) {        
        if(task instanceof jsCogtask) {
            if(task.taskID==null || task.taskID==undefined){
                task.taskID=jsPsych.randomization.randomID(8);
            }
            for(let i=0;i<this.tasks.length;i++){
                if(this.tasks[i].taskID===task.taskID){
                    task.taskID=task.taskID+'-'+jsPsych.randomization.randomID(3);
                    task.task_trial.taskID=task.taskID;
                    console.log('Same task name exists. New name is assigned to be '+task.taskID)
                }
            }
            this.tasks.push(task);
            if(this.ctask===null) this.set_current_task(task);
        };
    }

    add_page(page=null,options=this.default_options){
        let dtype=jsFunc.check_data_type(page); let pages=[];
        if(dtype==1 || dtype==2){ //string types
            page = {
                type: "unified-button-response",
                stimulus_type: "html",
                stimulus: page,
                speech_text:jsFunc.html2text(page), 
                button_html: uxm.button_next,
                on_start:function(trial){
                    trial.stimulus=exp.replace_nickname(trial.stimulus);        
                    trial.speech_text=exp.replace_nickname(trial.speech_text);   
                },
                choices: ["다음"],
            }    
            pages=[page];
        } else if(dtype==4){ //array
            let stype=jsFunc.check_data_type(page[0]);
            if(stype==3) {pages=page;} //모든 element가 구조체
            else if(stype==1 || stype==2) { //모든 element가 string
                if(options===null || (options.stimuli_isi===undefined && options.trial_duration===undefined)) {
                    //stimuli_isi nor total_duration was defined... button-based pages
                    pages=[];
                    for(let i=0;i<page.length;i++) {
                        var page0={
                            type: "unified-button-response",
                            stimulus_type: "html",
                            stimulus: page[i],
                            speech_text:jsFunc.html2text(page[i]),
                            button_html: uxm.button_next,
                            on_start:function(trial){
                                trial.stimulus=exp.replace_nickname(trial.stimulus);
                                trial.speech_text=exp.replace_nickname(trial.speech_text);           
                            },
                            choices: ["다음"],
                        }
                        pages.push(page0); 
                    }
                }
                else {
                    page = {
                        type: "unified-button-response",
                        stimulus_type: "html",
                        stimulus: page,
                        speech_text:jsFunc.html2text(page),
                        button_html: uxm.button_next,
                        on_start:function(trial){
                            trial.stimulus=exp.replace_nickname(trial.stimulus);    
                            trial.speech_text=exp.replace_nickname(trial.speech_text);       
                        },
                        choices: ["다음"],
                    }                     
                    if(options.stimuli_isi===undefined){
                        if(options.trial_duration!==undefined) {
                            page.stimuli_isi=[];
                            for(let i=0;i<page.stimulus.length;i++) page.stimuli_isi.push(page.trial_duration);
                        }
                    }
                    pages=[page];
                }
            }      
        } else pages=[page];
        if(pages.length>0){
            for(let it=0;it<pages.length;it++){
                page=pages[it];
                var ntask=new jsTrialtask();
                if(options!==null){
                    if(options.style!==undefined) page.stimulus_style=options.style;
                    if(options.choices!==undefined) page.choices=options.choices;
                    if(options.stimulus_style!==undefined) {page.stimulus_style=options.stimulus_style;}
                    if(options.trial_ends_after_audio!==undefined) {page.trial_ends_after_audio=options.trial_ends_after_audio;}
                    if(options.background_color!==undefined) page.background_color=options.background_color;
                    if(options.trial_duration!==undefined) {
                        page.trial_duration=options.trial_duration;
                        page.choices=[];page.button_html=[];                    
                        //if(page.trial_ends_after_audio) page.trial_duration=10000;
                    }
                    if(options.stimuli_isi!==undefined) {
                        page.stimuli_isi=options.stimuli_isi;
                        page.choices=[];page.button_html=[];
                    }                    
                    if(options.background!==undefined) {
                        if(options.background_size===undefined || options.background_size==null) {
                            options.background_size='100% 100%';      // stretch as default              
                        }
                    }
                    if(options.background_color===undefined) options.background_color=null; 
                      
                    if(options.background!==null || options.background_size!==null|| options.background_color!==null) ntask.set_background(options.background,options.background_size,options.background_color,options.background_position,options.background_linear);       
                }

                ntask.set_task_trial(page);
                this.add_task(ntask);
            }
        }
    }
    add_page_delay(page=null,delay=1000,options=this.default_options){
        if(options===null) {
            if(delay.length==1) options={trial_duration:delay,};
            else options={stimuli_isi:delay,};
        }
        else {
            options=jsFunc.clone(this.default_options);
            if(!Array.isArray(delay)) options.trial_duration=delay; //numeric
            else options.stimuli_isi=delay;
        }
        this.add_page(page,options);
    }
    add_env_page(style=null){
        let audiopage = {
            type: "unified-button-response",
            ID:'audioguide',
            stimulus_type: "html",
            stimulus: uxm.html_ask_audioguide_msg,
            choices: ["예", "아니오"],
            button_html: uxm.audioguide_answer_buttons,
            on_finish: function (data) {    
                if (data.button_pressed == 0) { //yes
                    env.use_audioguide_flag=true; // should be updated... 
                } else env.use_audioguide_flag=false; // should be updated... 
            },  
        };
        let options=null;
        if(style!==null) {
            if(typeof style==='string') options={style:style,};
            else options=style;
        }
        else options=this.default_options;
        this.add_page(audiopage,options);

        let fullscreen={
            type: "fullscreen",            
            fullscreen_mode: true,
            ID:'fullscreen',
            //nekim
            message:'<div id="jspsych-unified-button-response-stimulus" class="font-stimulus"><p class="font-message-trial">본 실험은 전체 화면에서 진행하게 됩니다. </p></div>',
            button_label: "전체화면",
          }

        this.add_page(fullscreen);
    }
    add_debrief_result_trial()
    {

    }
    set_current_task(task){
        if(task instanceof jsCogtask) {
            if(task.taskID.slice(0,4)=="COMB") {this.ctask=task; return};
            let flag=false;
            for(var i=0;i<this.tasks.length;i++){
                if(this.tasks[i]===task) {
                    flag=true; break;
                }
            }
            if(flag) {
                this.ctask=task;
                this.ctrial=task.task_trial;
            } else {
                console.log(task.taskID+' is added and set to be current...')
                this.add_task(task);
            }
        }
        else { //string
            var task=this.getTask(task);
            if(task) {
                this.ctask=task;
                this.ctrial=task.task_trial;
            }
        } 
        if(this.verbose) console.log('Current trial ID is '+this.ctask.taskID);
    }
    
    getTask(taskID){
        if(arguments.length==0) return this.ctask;
        for(var i=0;i<this.tasks.length;i++){
            if(this.tasks[i].taskID===taskID) return this.tasks[i];
        }
        return null;
    }

    getTrial(taskID){
        if(arguments.length==0) return this.ctrial;
        for(var i=0;i<this.tasks.length;i++){
            if(this.tasks[i].taskID===taskID) return this.tasks[i].task_trial;
        }
        return null;
    }
    remove_except_first(id){
        let first=true;
        for(let c=0;c<this.tasks.length;c++) { 
            if(!first) this.tasks[c].remove_trial(id);
            else {
                let idx=this.tasks[c].exist_trial(id);
                if(idx.length>0) first=false;
            }  
        }
    }
    remove_except_last(id){
        let last=0;
        for(let c=0;c<this.tasks.length;c++) { 
            let idx=this.tasks[c].exist_trial(id);
            if(idx.length>0) {last=c;}
        }
        for(let c=0;c<last-1;c++) { 
            this.tasks[c].remove_trial(id);
        }
    }
    combine_prepare(){
        for(let c=0;c<this.tasks.length-1;c++) this.tasks[c].set_redirect(null); 
        this.remove_except_first('audioguide');
        this.remove_except_first('fullscreen');
        if(this.append_mode=='timeline') this.remove_except_last('zoomevents');
    }
    combine(){
        let trialtask=0;let taskcount=0;
        for(let c=0;c<this.tasks.length;c++) {            
            if(this.tasks[c] instanceof jsCogtask) {
                if(this.tasks[c] instanceof jsTrialtask) trialtask++;
                else taskcount++;
            }
        }
        if(taskcount>1) this.combined_task=new jsTrialtask('combined','./','COMBINED-'+jsPsych.randomization.randomID(5));
        else this.combined_task=this.tasks[0];
        for(let c=0;c<this.tasks.length;c++) {            
            this.combined_task.timeline=this.combined_task.timeline.concat(this.tasks[c].timeline); 
            this.combined_task.preload_audio=this.combined_task.preload_audio.concat(this.tasks[c].preload_audio);
            this.combined_task.preload_images=this.combined_task.preload_images.concat(this.tasks[c].preload_images);
            this.combined_task.preload_video=this.combined_task.preload_video.concat(this.tasks[c].preload_video);
            //this.tasks[0].name=this.tasks[0].name+'-'+this.tasks[c].name;
        }
        this.ctask=this.combined_task;
        this.ctrial=null;
    }

    append_data(task_data){
        this.task_data=this.task_data.concat(task_data);
    }
    
    append_scores(score){
        this.task_scores=this.task_scores.concat(score);
    }

    debug(){
        let msg='<h1>This is <br>a second heading</h1>';let val=jsFunc.html2text(msg);console.log("TXT:"+val); 
        document.documentElement.innerHTML='<h1>'+val+'</h1>';
    }

    static load_local_sequence(task) {
        if(task.sequence_file!==null ){
            return new Promise(function(resolve, reject) {
                sequence_ext=task.load_sequence_file(); //no external javascripts..     
                resolve(true);
            });
        } else return null;
    }

    static load_local_jscripts(task) {
        var mypromises=[];

        //var seqpromise=jsExperiment.load_local_sequence(task);
        //if(seqpromise!=null) mypromises.push(seqpromise);
        if(task.variable_files.length==0 ){
            mypromises.push( new Promise(function(resolve, reject) {
                task.init_variables(); //no external javascripts..    
                task.setup();              
                task.compile();    
                resolve(true);
            }));
        } else if(task.variable_files.length==1){
            mypromises.push( new Promise(function(resolve, reject) {
                const script = document.createElement('script');
                var url=task.localpath+task.variable_files[0];
                script.src = url;
                script.addEventListener('load', function() {
                    if(exp.verbose) console.log(">>> "+ task.taskID + ' Variable js is loaded');
                    task.init_variables(); //load external javascripts..    
                    task.setup();              
                    task.compile();  
                    //if(exp.verbose) console.log(task.html_welcome_msg);           
                    resolve(true);
                });
                document.head.appendChild(script);
            }));
        } else if(task.variable_files.length>1){
            for(let i=0;i<task.variable_files.length;i++){
                mypromises.push(new Promise(function(resolve, reject) {
                    const script = document.createElement('script');
                    var url=task.localpath+task.variable_files[i];
                    console.log('ith:'+i)
                    script.src = url;
                    if(i==task.variable_files.length-1){
                        script.addEventListener('load', function() {
                            if(exp.verbose) console.log(task.name + ' variable js is loading');
                            task.init_variables(); //load external javascripts..    
                            task.setup();              
                            task.compile();  
                            if(exp.verbose) console.log(task.html_welcome_msg);           
                            resolve(true);
                        });
                    }
                    else{
                        script.addEventListener('load', function() {
                            if(exp.verbose) console.log(task.name + ' variable js is loading');   
                            task.init_variables(); //load external javascripts..    
                            resolve(true);
                        });
                    }
                    document.head.appendChild(script);
                }));
            }            
        }
        return mypromises;
    };

    // Load an array of scripts in order
    static load_jscripts(tasks) {
        const promises = tasks.map(function(task) {
            return jsExperiment.load_local_jscripts(task);
        }); //create promise arrays.. 
        const promises1=promises.flat(); //in case multiple files mayb promise.all
        return jsFunc.waterfall(promises1);
    };
    
    static run_ext(flag){
        exp.run();
    }
    run_all(){
        jsExperiment.load_jscripts(this.tasks).then(jsExperiment.run_ext);
    }

    run(task){
        if(task instanceof jsCogtask) {}
        else {var flag=task; task=undefined; }
        if(task!==undefined) {
            this.set_current_task(task);
            task.run();
            return;
        }
        if(this.tasks.length>0) {
            if (this.append_mode=="timeline") {
                this.combine_prepare();
                this.combine();                
                this.ctask.run();                
            }
            else if (this.append_mode=="promise") { 
                this.combine_prepare();
                this.run_tasks_in_order(this.tasks);
            }            
            else if (this.append_mode=="current") {
                this.ctask.run();
            }
        }
        else{
            this.ctask.run();
        }
    }

    fill_background(bkcolor=null){
        document.querySelector("body").style.backgroundImage =''; 
        if(bkcolor!==null) document.querySelector("body").style.backgroundColor = bkcolor;
    }

    onResize(){
        let ctask=exp.getTask(); if(ctask===null) return;
        ctask.onResize();
        this.update_background_mode({
					background_size: ctask.background_size,
					background_color: ctask.background_color,
					background_position: ctask.background_position,
					background_linear: ctask.background_linear,
				});          
    }

    match_window_size(){
        if(this.mql1===null){
            this.mql1 = window.matchMedia("screen and (max-width: 480px)");
            this.mql1.addEventListener( "change", (e) => {
                if (e.matches) {
                    var back=exp.getTask().background_phone;
                    if(back) document.querySelector("body").style.backgroundImage = `url("${back}")`;
                    console.log('모바일 화면 입니다.');

                }
            })
        }  
        if(this.mql2===null){
            this.mql2 = window.matchMedia("screen and (max-width: 768px) and (min-width: 481px)"); 
            this.mql2.addEventListener( "change", (e) => {
                if (e.matches) {
                    var back=exp.getTask().background_tablet;
                    if(back) document.querySelector("body").style.backgroundImage = `url("${back}")`;
                    console.log('타블렛 화면 입니다.');

                }
            })
        }
        if(this.mql3===null){
            this.mql3 = window.matchMedia("screen and (min-width: 769px)"); 
            this.mql3.addEventListener( "change", (e) => {
                if (e.matches) {
                    var back=exp.getTask().background_img;
                    if(back) document.querySelector("body").style.backgroundImage = `url("${back}")`;
                    console.log('데스크탑 화면 입니다.');

                }
            })
        }    
    }
    update_background(){
        let ctask=exp.getTask(); if(ctask===null) return;
        console.log(ctask.background_linear)
        if(ctask.background_img!==null) {
					
					if(ctask.background_linear!==null){
						document.querySelector("body").style.backgroundImage = `url("${ctask.background_img}"), ${ctask.background_linear}`;
					}else{
						document.querySelector("body").style.backgroundImage = `url("${ctask.background_img}")`;
					}
					
				} 
        this.update_background_mode({
					background_size:ctask.background_size,
					background_color:ctask.background_color,
					background_position:ctask.background_position,
					background_linear:ctask.background_linear
				});  
        if(this.verbose) console.log("Background image "+ctask.background_img + " was chosen...")
    }

    update_background_mode(option){
        if(option.hasOwnProperty('background_color')) document.querySelector("body").style.backgroundColor = option.background_color;
        document.querySelector("body").style.backgroundRepeat = "no-repeat";
        //document.querySelector("body").style.backgroundPosition = "center center";
        if(option.hasOwnProperty('background_position')) document.querySelector("body").style.backgroundPosition = option.background_position;
        if(option.hasOwnProperty('background_size')) {
            let str = option.background_size; 
            if(option.background_size==='keepratio') str='contain';     
            else if(option.background_size==='stretch') str='cover';                   
            document.querySelector("body").style.backgroundSize = str;       
        }
    }

    get_DOM_display_element() { return document.querySelector(".jspsych-display-element"); } //true
    get_DOM_button_response(){ return document.querySelector("#webrain-response-container").querySelector('#jspsych-unified-button-response-stimulus'); } //false
    get_DOM_canvas(){ return document.getElementById("jspsych-canvas-stimulus");}
    get_DOM_contents_container(){return document.querySelector('div.jspsych-content');}
    get_DOM_statusbar_container(){return document.querySelector('div.webrain-statusbar-container');}
    get_DOM_response_container(){ return document.getElementById("webrain-response-container"); }
    get_DOM_button_box(){ return document.querySelectorAll('.webrain-button-box button'); }
    get_DOM_statusbar_status(){ return document.getElementById("webrain-statusbar-status");}
    get_DOM_statusbar_info(){ return document.getElementById("webrain-statusbar-info");}
    get_DOM_statusbar_score(){ return document.getElementById("webrain-statusbar-score");}
    get_DOM_top_message_container(){ return document.getElementById("webrain-top-message-container");}
    get_DOM_bottom_message_container(){ return document.getElementById("webrain-bottom-message-container");}

    set_DOM_contents_container(html,vis='visible'){ var obj=document.querySelector('div.jspsych-content'); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_statusbar_container(html,vis='visible'){var obj=document.querySelector('div.webrain-statusbar-container'); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_response_container(html,vis='visible'){ var obj=document.getElementById("webrain-response-container"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }} 
    set_DOM_button_box(html,vis='visible'){ var obj=document.querySelectorAll('.webrain-button-box button'); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_statusbar_status(html,vis='visible'){ var obj=document.getElementById("webrain-statusbar-status"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_statusbar_info(html,vis='visible'){ var obj=document.getElementById("webrain-statusbar-info"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_statusbar_score(html,vis='visible'){ var obj=document.getElementById("webrain-statusbar-score"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_display_element(html,vis='visible') { var obj=document.querySelector(".jspsych-display-element"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; } } //true
    set_DOM_button_response(html,vis='visible'){ var obj=document.querySelector("#webrain-response-container").querySelector('#jspsych-unified-button-response-stimulus'); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; } } //false
    set_DOM_canvas(html,vis='visible'){ var obj=document.getElementById("jspsych-canvas-stimulus"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_top_message_container(html,vis='visible'){ var obj=document.getElementById("webrain-top-message-container"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
    set_DOM_bottom_message_container(html,vis='visible'){ var obj=document.getElementById("webrain-bottom-message-container"); if(obj) {if(html) obj.innerHTML=html;obj.style.visibility = vis; }}
 
    async_run = (task,f=1) => new Promise ((resolve, reject) => {	
		//type 에 따른 data-type 변경
		$('html').attr('data-type', task.type.toLowerCase())				
        console.log(task.taskID + " is loaded"); 
        if(f>0) {
            task.resolve=resolve;
            task.reject=reject;
        }     
        task.run();
    });

    run_tasks_in_order(tasks){
        (async () => {
            let res=[];
            try {
                for(let i=0;i<tasks.length;i++) {
                    res.push(await this.async_run(tasks[i],1));
                }
            } catch (err) {
                console.log(err)
            }
        })()
    };

}