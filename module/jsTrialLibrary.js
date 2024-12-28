class jsTrialLibrary {
    constructor () {
        this.record_zoom_events_trial = {
            type: "call-function",
            func: function () {
                return JSON.stringify(env.zoom_event);
            },
        };    
        this.fullscreen_trial={
            type: "fullscreen",
            fullscreen_mode: true,
            message:uxm.html_full_screen_msg,
            button_label: "전체화면",
        }
        this.fullscreen_on_trial={
          type: "fullscreen",
          fullscreen_mode: true,
          message:uxm.html_full_screen_msg,
          button_label: "전체화면",
        }
      
        this.fullscreen_off_trial={
          type: "fullscreen",
          fullscreen_mode: false,
          button_label: "전체화면",
        }
      
        this.screeninfo_trial = {
            type: "unified-button-response",
            stimulus_type: "html",
            stimulus: uxm.html_screeninfo_msg,
            button_html: uxm.button_next,
            choices: ["다음"],
            on_load: function (data) {
    
            },
        }

        this.chart_trial = {
            type: 'canvas-button-response',
            stimulus: function(c) {
                var ctx = c.getContext("2d");
                var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',    
                // The data for our dataset
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'My First dataset',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30, 45]
                    }]
                },
                // Configuration options go here
                options: {}
            });
            },
            choices: ['Blue line', 'Purple line'],
            prompt: '<p>Which line is longer?</p>',
            data: {line1_color: 'blue', line1_length: 290, line2_color: "purple", line2_length: 170}
        }
       
      // this will store the zoom_event data in the data for this trial.
        this.record_zoom_events_trial = {
          type: "call-function",
          ID:'zoomevents',
          func: function () {
            return JSON.stringify(env.zoom_event);
          },
        };
      
        this.rest_trial ={
          type: 'html-keyboard-response',
          stimulus: '<p style="font-size:30px;"> 쉬는 시간.<p/><p> 잠시 1분간 쉬도록 하겠습니다. 준비 되면 아무 버턴을 누르세요.</p>',
          trial_duration: 60000
        };
        
        this.attention_check_trial = {
          type: "html-button-response",
          stimulus: "",
          on_start: function(trial) {
            const random_stimulus = jsPsych.randomization.sampleWithReplacement([uxm.image_button_left, uxm.image_button_right])
            Object.assign(trial, random_stimulus) // will apply the random stimulus to the trial object
          },
          on_finish: function(data) {
        
            if (data.button_pressed == data.correct_response) {
              data.attentionacc = 1;
            } else {
              data.attentionacc = 0;
            }
          }
        }
    }
    change_background_trial(backimg,delay=0){
      return {
        type: 'unified-no-response',
        stimulus: backimg,
        on_start: function(trial) {
          document.querySelector("body").style.backgroundImage = `url("${trial.stimulus}")`;
        },
        trial_duration: delay,
      };
    }

    repeat_after_me_trial(audiomsg,msg){
        return {
          type: 'audio-audio-response',
          audio_stimulus: audiomsg, 
          visual_stimulus: msg,
          allow_playback:true,
        }
    }
      //msg="<p>Please speak according to the sound. </p>"
      
    get_pause_trial(){
      return { //owner
        type: "unified-button-response",
        stimulus_type: "html",
        speech_text: function () {
            if(env.use_audioguide_flag) return jsFunc.html2text(exp.replace_nickname(uxm.html_pause_msg)); else return null; 
        },
        guide_image:uxm.guide_image,
        stimulus: uxm.html_pause_msg,
        button_html: uxm.button_start,
        choices: uxm.test_ready_choices,
        post_trial_gap: 1000,
        on_start:function(trial){
            trial.stimulus=exp.replace_nickname(trial.stimulus);
        },
      };  
    }  

    speak_aloud_trial(msg){
        return {
          type: 'unified-audio-response',
          stimulus:msg,
          allow_playback:false,
          wait_for_mic_approval:false,
        }
    }
      //msg="<p>버턴에 불이 들어 온 동안 <br>'나는 마음섬을 돌보아 줄 것입니다.' <br>라고 세번 말하세요. </p>";
      
      
    speak_recognition_trial (phrases,msg="<p>다음 문장을 말하세요. </p>") {
        return {
          type: 'unified-audio-response',
          stimulus:msg,
          choices_audio_recongition:phrases,
        };
    }
    //var phrases = ['나는 감사한 사람이 많다','나는 소중한 사람이다','나는 사랑받는 사람이다','나는 용기있는 사람이다','나는 나를 사랑한다', '나는 끈기 있는 사람이다', '나는 집중을 잘한다',];;
      

      //// FUNCTIONS
    end_current_timeline()
    {
        jsPsych.endCurrentTimeline()
        setTimeout(function(){
            jsPsych.finishTrial();
            jsPsych.endExperiment();
        });
    } //1) track the total experiment time elapsed within each plugin, then 2) change the plugin code for each plugin to call jsPsych.finishTrial at the moment it reaches the overall ceiling, then 3) immediately call jsPsych.endExperiment in the on_finish of that trial. 

}