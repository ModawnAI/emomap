class jsTrial extends Object {
    constructor (name,task) {
        super();        
        this.name=name;
        this.type='Basic trial';
        this.ctask=null;
        this.trial=null;
        if(arguments.length>1) this.set_task(task);
        //
        this.stimuli_set=null;
        this.stimuli_distractor=null;
        this.distractor_position=null;
        this.distractor_height=null;
        this.distractor_type=null;

        //stimulus
        this.stimuli_audio=null;
        this.stimulus_style=null;
        this.stimulus_duration=1000;
        this.trial_duration=1000;
        this.prefixation_duration=0;
        this.button_stimulus_mode=false;
        this.post_trial_gap=0; //The default inter-trial interval (ITI).
        this.margin_vertical=null;
        this.margin_horizontal=null;
        this.stimulus_height=null; //phj 10
        this.stimulus_width=null;//phj 'auto';
        this.stimulus_type="image";//image, numbers, html
        this.guide_image=null;
        this.maintain_aspect_ratio=true;   
        this.max_response_count=1;
        this.poststimulus=null;        
        this.button_stimulus_mode=false;
        this.button_nrow=1;
        this.button_ncol=null;     
        this.stimulus_nrow=1;
        this.stimulus_ncol=1;        
        this.stimulus_positionx=null;
        this.stimulus_positiony=null;
        this.stimuli_isi=null;
        this.stimulus_isi=null;
        this.trial_start_time=null;
        this.user_stim_style_flag=false;

        //response
        this.wait_duration_after_multiresponses=0; 
        this.jspsych_response_type=null;
        this.response_ends_trial=false; //If true, then the trial will end whenever the subject makes a response,  If false, then the trial will continue until the value for trial_duration is reached.
        this.response_choices=["예", "아니오"]; 
        this.button_html_response=null;
        this.noresponse_warning=false;        
        this.feedback_audios=null;
        this.mark_responded_button=false;
        this.score=0;
        this.keyboard_choices=null; //// ['leftarrow','rightarrow'] : left 37, 'rightarrow': 39,    
        //   
        this.fixation_size=80;      
        this.button_style=''; 
        this.prompt_button_html=null;
        this.sequence_random=true;
        this.sequence_random_online=false;
        // default
        this.response_choices=["예", "아니오"]; 
    }

    init() {

    }
    toString() {
        return Object.getPrototypeOf(this).constructor.name;
    }
    set_task(task) {
        if(task instanceof jsCogtask) this.ctask=task; 
    }   
    setup(){
        /*
        if (this.ctask.sequence_data.length>0) {
            this.sequence_random=false;
            this.stimuli_set=[...new Set(this.ctask.sequence_data)];
        }
        */
        if(this.stimuli_distractor!==null) {
            if(this.distractor_type=='audio'){
                this.stimuli_distractor.forEach((element,i)=> this.stimuli_distractor[i]=this.ctask.localpath+element );
                this.ctask.preload_audio=this.ctask.preload_audio.concat(this.stimuli_distractor);    
            } else{
                this.stimuli_distractor.forEach((element,i)=> this.stimuli_distractor[i]=this.ctask.localpath+element );
                this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_distractor);    
            }
        }
        if(this.ctask===null){alert('ctask should be predefined'); return;}
        if (this.poststimulus !== null) {
            if (this.poststimulus === "fixation")
              this.poststimulus = '<div style="font-size:' + this.fixation_size + 'px;">+</div>';
        }
        this.setup_buttons();
    }

    setup_buttons() {        
         //if (typeof soundpath !=='undefined') sound_stimuli.forEach((item,i)  => sound_stimuli[i]=soundpath+item);
        if (uxm.imagepath !== null) { //update main path buttons
            if(this.response_choices!==null)
            this.response_choices.forEach((item, i) => { //if images, add mainpath to preload
                if (/(jpg|gif|png|jpeg)$/i.test(item)) {
                    if (!item.includes('img/') && !item.includes(uxm.imagepath)) 
                        this.response_choices[i] = uxm.imagepath + item;
                    this.ctask.preload_images.push(this.response_choices[i]);
                }
            });
        }
        if (!jsEnv.touchmode) {   //keyboard response
            if (this.stimulus_type == "html") this.jspsych_response_type = "html-keyboard-response";
            else this.jspsych_response_type = "image-audio-keyboard-response"; //should be updated
            uxm.image_button_yes = uxm.image_rh_press;
            uxm.image_button_no = uxm.image_lh_press;
            if (typeof this.response_choices === "undefined") this.response_choices = [37, 39, "J", "K"];
        } else {  //touch mode
            this.jspsych_response_type = "unified-button-response";
            if (this.stimulus_type === "numbers" && this.button_stimulus_mode) {
                // stimulus and responses are done in the same button
                this.button_html_response = null; // 한 시행에서 여러 자극과 반응을 같은 버턴에서 하는 경우
            } else {
                if (this.button_html_response === null) {
                    if(this.response_choices===null) return;
                    
                    if (this.response_choices.length == 2 || this.response_choices.length == 1) {      
                        let imgflag=true;
                        this.response_choices.forEach(function (item, i) {
                            if (/(jpg|gif|png|jpeg)$/i.test(item)) { imgflag=imgflag && true; 
                            } else{ 
                                imgflag=imgflag && false;
                            }
                        })           
                        if(!imgflag){ //texts
                            this.button_html_response = [];
                            for(let i=0;i<this.response_choices.length;i++){
                                if(this.response_choices[i]==="예") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_true} alt="예" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="아니오") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_false} alt="아니오" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="이전") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_prev} alt="이전" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="다음") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_next} alt="다음" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="일치") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_congruent} alt="일치" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="불일치") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_incongruent} alt="불일치" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="왼쪽") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_left} alt="왼쪽" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="오른쪽") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_right} alt="오른쪽" ${this.button_style} ></img></button>`);   
                                else if(this.response_choices[i]==="대칭") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_symmetric} alt="대칭" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="비대칭") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_asymmetric} alt="비대칭" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="긍정") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_positive} alt="긍정" ${this.button_style} ></img></button>`);
                                else if(this.response_choices[i]==="부정") this.button_html_response.push(`<button class="webrain-btn"><img src= ${uxm.image_button_negative} alt="부정" ${this.button_style} ></img></button>`);
                            }
                            this.ctask.preload_images.push(uxm.image_button_true); this.ctask.preload_images.push(uxm.image_button_false);
                        } else { // images
                            this.button_html_response = [
                                `<button class="webrain-btn"><img src= ${this.response_choices[0]} alt="왼쪽" ${this.button_style} ></img></button>`,
                                `<button class="webrain-btn"><img src= ${this.response_choices[1]} alt="오른쪽" ${this.button_style} ></img></button>`,
                            ];
                            this.ctask.preload_images.concat(this.response_choices);
                        }          
                    } else {
                        this.create_response_button_html();
                    }
                }
            }
        }
    }

    create_response_button_html(){
        //multi button cases // 한 시행에서 여러 자극을 주는 단일 자극을 주든 상관 없음. 
        const nbut = this.response_choices.length;
        const rangew = (document.documentElement.clientWidth * 2) / 3;
        const center_x = window.innerWidth / 2;
        const gapwidthratio = 0.2;
        const button_width = Math.round(rangew / (nbut + gapwidthratio * (nbut - 1)));
        const widthstep = Math.round(button_width * (1 + gapwidthratio));
        const offset_x = center_x - rangew / 2;
        this.button_html_response = [];
        const bwidth = Math.round((button_width * 2) / 3);

        this.button_stimulus_nrow= 1;
        this.button_stimulus_ncol= nbut;

        for (let j = 0; j < nbut; j++) {
            const posx = Math.round(j * widthstep + offset_x);
            if(jsFunc.isImage(this.response_choices[j])){
                var buthtml =`<button class="webrain-btn btn-stim"><img src=${this.response_choices[j]} ${this.button_style} ></button>`;
                this.ctask.preload_images.push(this.response_choices[j]);
            }
            else var buthtml =`<button class="webrain-btn">${this.response_choices[j]}</button>`;      
            this.button_html_response.push(buthtml);            
        }
    }
    
    callback_on_start(trial){ //trial is unified button...
        this.callback_adaptive_procedure(trial);
    }
    callback_on_load(){
        this.trial_start_time=jsFunc.toSqlDatetime(new Date()); //risk in using variable outside jspsych
    }

    callback_trial_stimulus(){return null;};
    callback_stimuli_isi(){return this.stimuli_isi;};
    callback_stimulus_duration(){return this.stimulus_duration;};
    callback_trial_duration(){return this.trial_duration;};
    callback_stimulus_audio(){return null;};
    callback_response_audio(){return null;};
    callback_trial_data(){return null;};
    callback_speech_text(){return null;};
    callback_prompt(){return null;};
    callback_feedback_audio_index(){};
    callback_adaptive_procedure(trial){};
    callback_score_response(data){};
    callback_max_response_count(){return this.max_response_count;}
    callback_evaluate_performance(data){
        let pausemode=false; let alertmode=false; let endmode=false; let addmode=false;
        if(this.ctask.trial_count==5 && this.ctask.score==0) alertmode=true;
        if(endmode) jsPsych.endCurrentTimeline();
        if(addmode) {
            let pause_trial = { //owner
                type: "unified-button-response",
                stimulus_type: "html",
                speech_text: function () {
                    if(env.use_audioguide_flag) return jsFunc.html2text(uxm.html_pause_msg); else return null; 
                },
                guide_image: uxm.guide_image,
                stimulus: uxm.html_pause_msg,
                button_html: uxm.button_start,
                choices: uxm.test_ready_choices,
                post_trial_gap: 1000,
                on_start:function(trial){
                    trial.stimulus=exp.replace_nickname(trial.stimulus);
                },
            }
            jsPsych.addNodeToEndOfTimeline({ //timeline 끝에 삽입...
                timeline: [pause_trial]
            }, jsPsych.resumeExperiment)
        }
        if(alertmode){
						//nekim
            jsPsych.pauseExperiment();   
            let but='<button class="webrain-btn btn-start" id="webrain-btn-pause"><img src="'+
            uxm.image_button_start+ '" alt="시작"></button>'
            let html='<div id="jspsych-unified-button-response-stimulus" class="font-stimulus">'+exp.replace_nickname(uxm.html_warning_msg)+'</div>';
            html+='<div class="webrain-response-container">' + but + '</div>';      
            jsPsych.getDisplayElement().innerHTML=html;
            var btn = document.getElementById("webrain-btn-pause");
            btn.addEventListener('click', jsPsych.resumeExperiment);
            //setTimeout(jsPsych.resumeExperiment, 10000);            
        }
    };
    callback_stimulus_canvas_function(canvas,trial){
        var ctask=exp.getTask(trial.taskID);
        var ctx = canvas.getContext("2d");
        var img = new Image();   
        var image_drawn = false;
        let height, width;
        img.onload = function() {
          // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
          if (!image_drawn) {
            getHeightWidth(); // only possible to get width/height after image loads
            ctx.drawImage(img,0,0,width,height);
          }
        };
        img.src = trial.stimulus;
        // get/set image height and width - this can only be done after image loads because uses image's naturalWidth/naturalHeight properties
        function getHeightWidth() {
          if (trial.stimulus_height !== null) {
            height = trial.stimulus_height;
            if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
              width = img.naturalWidth * (trial.stimulus_height/img.naturalHeight);
            }
          } else {
            height = img.naturalHeight;
          }
          if (trial.stimulus_width !== null) {
            width = trial.stimulus_width;
            if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
              height = img.naturalHeight * (trial.stimulus_width/img.naturalWidth);
            }
          } else if (!(trial.stimulus_height !== null & trial.maintain_aspect_ratio)) {
            // if stimulus width is null, only use the image's natural width if the width value wasn't set 
            // in the if statement above, based on a specified height and maintain_aspect_ratio = true
            width = img.naturalWidth;
          }
          canvas.height = height;
          canvas.width = width;
        }
        getHeightWidth(); // call now, in case image loads immediately (is cached)    
    }

    callback_update_response_data(data)
    {
        data.score=this.score;
        data.phase=this.ctask.phasemode;
        data.start_time=this.trial_start_time;
        var responsestr='';
        if(data.hasOwnProperty('responses')) {
            for(var i=0;i<data.responses.length;i++) {
            if(i==data.responses.length-1) responsestr+=data.responses[i].button+':'+Math.round(data.responses[i].rt);
            else responsestr+=data.responses[i].button+':'+Math.round(data.responses[i].rt)+',';
            }
        }
        data.multi_responses=responsestr;
        data.response=data.button_pressed;
        data.session=this.nsession;

        if(data.hasOwnProperty('correct_response')) {
            if(Array.isArray(data.correct_response)){
                data.correct_response=jsFunc.array2csv(data.correct_response);
            }
        }
        this.ctask.responses.push(data); // 
    }

    get_trial(){return this.trial;}

    compile(){
        this.trial = {
            type: this.jspsych_response_type,
            taskID:this.ctask.taskID,
            stimulus: function () { //호출 소유주는 jspsych_response_type,  
                //var curtrial=jsPsych.currentTrial();                
                //var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                //var ctask=exp.getTask(ctrial.taskID);

                var ctask=exp.getTask(jsPsych.currentTrial().taskID);
                var ctrial=ctask.task_trial;
                ctask.score_display();    
                if(ctrial!==null){
                    var stim = ctrial.callback_trial_stimulus();
                    if(ctask!==null) ctask.sequence.push(stim);
                    return stim;
                } else return null;
            },
            stimuli_isi: function () {    
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_stimuli_isi();
                else return null;
            },
            stimulus_duration: function () {    
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_stimulus_duration();
                else return null;
            },
            trial_duration: function () {    
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_trial_duration();
                else return null;
            },
            stimulus_audio: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_stimulus_audio();
                else return null;
            },
            response_audio: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_response_audio();
                else return null;
            },
            data: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_trial_data();
                else return null;
            },
            response_ends_trial: this.response_ends_trial, //If true, then the trial will end whenever the subject makes a response,  If false, then the trial will continue until the value for trial_duration is reached.
            post_trial_gap: this.post_trial_gap, //The default inter-trial interval (ITI).
            wait_duration_after_multiresponses: this.wait_duration_after_multiresponses,  
            speech_text: function(){  
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_speech_text(); 
                else return null;
            },
            stimulus_style: this.stimulus_style,
            choices: this.response_choices,
            button_html: this.button_html_response,
            margin_vertical: this.margin_vertical,
            margin_horizontal: this.margin_horizontal,
            stimulus_height: this.stimulus_height,
            stimulus_width: this.stimulus_width,
            stimulus_type: this.stimulus_type,
            guide_image:this.guide_image, 
            maintain_aspect_ratio: this.maintain_aspect_ratio,    
            max_response_count: function(){ 
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_max_response_count(); 
                else return null;
            },
            poststimulus: this.poststimulus,
            prompt: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_prompt(ctrial); 
                else return null;
            },
            prompt_button_html:this.prompt_button_html,
            noresponse_warning: this.noresponse_warning,
            feedback_audios: this.feedback_audios,
            mark_responded_button:this.mark_responded_button,
            feedback_audio_index: function(stimulus,responses) { 
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) return ctrial.callback_feedback_audio_index(stimulus,responses); 
                else return null;
            }, 
            button_nrow: this.button_nrow,
            button_ncol: this.button_ncol,
            button_stimulus_mode:this.button_stimulus_mode,
            stimulus_nrow: this.stimulus_nrow,
            stimulus_ncol: this.stimulus_ncol,
            stimulus_positionx: this.stimulus_positionx,
            stimulus_positiony: this.stimulus_positiony,
            user_stim_style_flag: this.user_stim_style_flag,
            keyboard_choices:this.keyboard_choices,
            on_start: function (trial) {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) {
                    if(exp.verbose) console.log('=== ctrial:'+ trial.taskID + ' etrial:' + ctrial.ctask.taskID + ' is started...')
                    ctrial.callback_on_start(trial); 
                }
                else return;
            },        
            on_load: function () {
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) {                    
                    ctrial.callback_on_load();  //after start   
                }     
            },
            stimulus_canvas_function:function (canvas,trial){
                var ctrial=exp.getTrial(jsPsych.currentTrial().taskID);
                if(ctrial!==null) {
                    ctrial.callback_stimulus_canvas_function(canvas,trial);  //after start   
                }            
            }, 
            on_finish: function (data) { //unified_button_response           

                var ctask=exp.getTask(jsPsych.currentTrial().taskID);
                var ctrial=ctask.task_trial;
                ctrial.score = ctrial.callback_score_response(data);
                ctrial.callback_update_response_data(data);
                
                ctask.score = ctask.score + exp.ctask.task_trial.score;                                     
                ctask.score_display();
                ctask.trial_count++; 
                ctrial.callback_evaluate_performance(data);  
                var svar = "score:" + ctask.score;
                if(exp.verbose) console.log('=== ctrial:'+ctask.taskID+" was finished with score:"+svar + " progress:" + ctask.trial_count);  
                 
            },
        };
    }
}