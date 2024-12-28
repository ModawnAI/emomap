class jsRegister extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='Register';
        if(taskID===null) this.taskID='Register'+'-'+jsPsych.randomization.randomID(5);
        this.nickname='등록하기';

        this.ask_subject_info_trial=null;
        this.ask_gender_trial=null;
        this.ask_arousal_level=null;
        this.ask_valence_level=null;

        this.nickname_msg='<p class="font-message">별명을 넣으세요.</p>'; 
        this.contact_msg='<p class="font-message">이메일을 넣으세요.</p>'; 
        this.name_msg='<p class="font-message">이름을 넣으세요.</p>'; 
        this.subjectID_msg='<p class="font-message">등록번호를 넣으세요.</p>'; 
        this.age_msg='<p class="font-message">나이를 넣으세요.</p>'; 

    }

    set_default_trials(){ 
        if(this.taskID.length==0) this.taskID=this.name+'-'+jsPsych.randomization.randomID(5);
        //this.set_audioguide_trial();
        this.set_fullscreen_trial();
        this.set_subject_info_trial();
        this.set_welcome_trial();
        this.set_epilog_trials();       

    }

    set_subject_info_trial(){
        this.ask_subject_info_trial ={
            type: 'survey-text',
            questions: [{
                prompt: this.subjectID_msg,
                required: true
              }, 
              {
                prompt: this.name_msg,
                required: false
              }, 
              {
                prompt: this.nickname_msg,
                required: false
              }, 
              {
                prompt: this.contact_msg,
                required: false
              },           
              {
                prompt: this.age_msg,
                required: false
              },          
            ],
            button_label: "확인",//uxm.button_next,
            on_start: function(){
            },
            on_finish: function(data) {
              var responses = JSON.parse(data.responses);
              exp.participantID = responses.Q0;
              exp.Age = parseInt(responses.Q1);
              //jsPsych.data.addProperties({    participantID: code  });
            }  
        }
            // get participant's gender and add it to the datafile
            // the prompt and options are declared in the configuration/text_variables.js file
        this.ask_gender_trial = {
            type: 'survey-multi-choice',
            questions: [{
                prompt: uxm.ask_gender_msg,
                name:"gender",
                options: uxm.ask_gender_options,
                required: true
            }, ],
            button_label: "확인",//uxm.button_next,
            on_finish: function(data) {
                var responses = JSON.parse(data.responses);
                if(responses.Q0==="남자") exp.Gender='M';
                else if(responses.Q0==="여자") exp.Gender='F';
                //jsPsych.data.addProperties({   gender: code   });
            }
        };  

        this.preload_images=this.preload_images.concat(uxm.scale_five_choices);
        const buttons=this.create_response_button_html(uxm.scale_five_choices);
        this.ask_arousal_level = {
            type: 'unified-button-response',
            stimulus:uxm.html_ask_arousal_msg,
            choices: uxm.scale_five_choices,//['1','2','3','4','5'],
            stimulus_type:'html',
            speech_text:function () { if(uxm.use_audioguide_flag) return html2text(uxm.html_ask_arousal_msg); else {return null;} },
            button_html: buttons,
            on_finish: function(data) {
                var responses =data.responses[0].button+1;
                //jsPsych.data.addProperties({ arousal_level: code });
            }
        }
      
        this.ask_valence_level = {
            type: 'unified-button-response',
            stimulus:uxm.html_ask_valence_msg,
            choices: uxm.scale_five_choices,//['1','2','3','4','5'],
            stimulus_type:'html',
            speech_text: function () { if(uxm.use_audioguide_flag) return html2text(uxm.html_ask_valence_msg); else {return null;} },
            button_html: buttons,
            on_finish: function(data) {
                var responses =data.responses[0].button+1;
                //jsPsych.data.addProperties({       valence_level: code     });
            }
        }

        var trial = {
            type: "unified-no-response",
            stimulus: '<div style="font-size:' + '환영합니다' + 'px;">+</div>',
            trial_duration: 2000,
        };

        this.epilog_trials=[];
        this.epilog_trials.push(trial);
    }

    create_response_button_html(response_choices){
        //multi button cases // 한 시행에서 여러 자극을 주는 단일 자극을 주든 상관 없음. 
        const nbut = response_choices.length;
        const rangew = (document.documentElement.clientWidth * 2) / 3;
        const center_x = window.innerWidth / 2;
        const gapwidthratio = 0.2;
        const button_width = Math.round(rangew / (nbut + gapwidthratio * (nbut - 1)));
        const widthstep = Math.round(button_width * (1 + gapwidthratio));
        const offset_x = center_x - rangew / 2;
        let button_html_response = [];
        const bwidth = Math.round((button_width * 2) / 3);

        const button_stimulus_nrow= 1;
        const button_stimulus_ncol= nbut;

        for (let j = 0; j < nbut; j++) {
            const posx = Math.round(j * widthstep + offset_x);
            const buthtml =`<button class="webrain-btn"><img src=${response_choices[j]} height="100%" ></img></button>`;
            button_html_response.push(buthtml);
        }
        return button_html_response;
    }

    compile(trialall=true,envmode=false) { 
        if(envmode){
            this.add_audioguide_trial();
            this.add_fullscreen_trial();
        }

        this.add_taskid_trial();
        if(trialall) {
            this.add_prolog_trials();
            this.add_welcome_trial();
            this.add_instruction_trial();            
        }
        this.timeline.push(this.ask_subject_info_trial);
        this.timeline.push(this.ask_gender_trial);
        this.timeline.push(this.ask_arousal_level);
        this.timeline.push(this.ask_valence_level);
        if(trialall){       
            this.add_epilog_trials();
            this.add_env_trial();     
        }  
    }
}