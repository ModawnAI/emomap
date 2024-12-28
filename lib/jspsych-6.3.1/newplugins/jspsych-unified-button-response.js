/**

Hae-Jeong Park, Ph.D.
* modified from jspsych-image-button-response by Josh de Leeuw
**/

jsPsych.plugins["unified-button-response"] = (function() {

  var plugin = {};

  // PHJ
  //jsPsych.pluginAPI.registerPreload('unified-button-response', 'stimulus', 'image');
  //jsPsych.pluginAPI.registerPreload('unified-button-response', 'stimulus', 'audio');

  plugin.info = {
    name: 'unified-button-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: null,
        description: 'The image to be displayed'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },      
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: [],
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      render_on_canvas: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Render on canvas',
        default: true,
        description: 'If true, the image will be drawn onto a canvas element (prevents blank screen between consecutive images in some browsers).'+
          'If false, the image will be shown via an img element.'
      }
    }
  }
  
  /** PHJ */
  newparams={
      stimulus_audio: { 
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus simultaneous audio',
        default: null,
        description: 'The audio to be played'
      },      //PHJ
      taskID: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Parent task object',
        default: null,
        description: 'The parent task object.'
      },
      stimulus_canvas_function: { //from canvar-button
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Stimulus function',
        default: null,
        description: 'The drawing function to apply to the canvas. Should take the canvas object as argument.'
      },      //PHJ
      response_audio: { 
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus simultaneous audio',
        default: null,
        description: 'The audio to be played'
      },      //PHJ      
      poststimulus: {        //PHJ
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Poststimulus html',
        default: null,
        description: 'The HTML string to be played'
      },       //PHJ
      stimulus_style: {        //PHJ
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus style html',
        default: null,
        description: 'The style of HTML string to be played'
      },   
      stimulus_type: { //PHJ
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'stimulus type',
        default: 'html', //html, image, numeric
        description: 'Stimulus type'
      },
      guide_image: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Guide image to split',
        default: null,
        description: 'If exist, position it on the left panel.'
      },
      speech_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Speak text',
        default: null,
        description: 'Use speech function'
      },
      noresponse_warning: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'No response',
        default: false,
        description: 'If true, the subject will see warning after delayed response.'
      },
      response_multistim_first: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Respone begins at the first image of the sequence',
        default: false,
        description: 'Respone begins at the first image of the sequence'
      },
      keep_response_buttons: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Keep response button',
        default: false,
        description: 'If true, the response button will not be cleared for the next trial.'
      },
      feedback_audios: {        //PHJ
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Feedback audio',
        default: null,
        description: 'The audio to be played'
      },       //PHJ
      feedback_audio_index: {        //PHJ
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Feedback function for audio content',
        default: null,
        description: 'Choose the audio to be played'
      },       //PHJ
      button_stimulus_mode: { //PHJ
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'use button as stimuluation buttons',
        default: false,
        description: 'Use buttons as stimulation buttons'
      },
      prompt_button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: null,
        description: 'The html of the prompt button. Can create own style.'
      },      
      stimulus_nrow: { //PHJ
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'The row number of stimuluation buttons',
        default: 1,
        description: 'The row number of stimuluation buttons.'
      },
      stimulus_ncol: { //PHJ
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'The row number of stimuluation buttons',
        default: 1,
        description: 'The column number of stimuluation buttons.'
      },
      button_nrow: { //PHJ
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'The row number of buttons',
        default: 1,
        description: 'The row number of buttons.'
      },
      button_ncol: { //PHJ
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'The row number of buttons',
        default: null,
        description: 'The column number of buttons.'
      },
      stimulus_positionx: { //PHJ
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'The positions of stimuluation buttons',
        default: null,
        array: true,
        description: 'The positions of stimuluation buttons.'
      },
      stimulus_positiony: { //PHJ
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'The positions of stimuluation buttons',
        default: null,
        array: true,
        description: 'The positions of stimuluation buttons.'
      },
      max_response_count: { //PHJ
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Total response number',
        default: 1,
        description: 'Number of multiple responses to be received.'
      },
      stimuli_isi: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'ISI duration for a sequence',
        array: true,
        default: [],
        description: 'How long to show the trial.'
      },
      stimuli_image_set: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'A set of image stimuli',
        array: true,
        default: [],
        description: 'A set of image stimuli.'
      },
      stimuli_audio_set: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'A set of audio stimuli',
        array: true,
        default: [],
        description: 'A set of audio stimuli.'
      },
      stimuli_html_set: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'A set of html stimuli',
        array: true,
        default: [],
        description: 'A set of html stimuli.'
      },
      user_stim_style_flag: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'User stimulus configuration',
        default: false,
        description: 'If true, users configuration can be used.'
      },
      wait_duration_after_multiresponses: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'wait duration for next sequence',
        default: 0,
        description: 'How long to wait.'
      },
      mark_responded_button: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'If true, the responded button will be marked.'
      },
      keyboard_choices:{
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Keyboard response choies',
        array: true, // ['leftarrow','rightarrow'] : left 37, 'rightarrow': 39,       
        default: null,
        description: 'Keyboard response choies'
      },
      trial_ends_after_audio: { //from audio-button
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial ends after audio',
        default: false,
        description: 'If true, then the trial will end as soon as the audio file finishes playing.'
      }, //PHJ
      canvas_size: { //from canvas-button
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas size',
        default: [500, 500],
        description: 'Array containing the height (first value) and width (second value) of the canvas element.'
      },
  }
  plugin.info.parameters=Object.assign(plugin.info.parameters,newparams);

  plugin.trial = function(display_element, trial) {
    var height, width; var html='';
    // store response
    var response = {
        rt: null,
        button: null
      };
    var currentAudio = null; // Declare global audio reference.  
    /**  BEGIN GLOBAL VARIABLES PHJ **/
    var nstimuli=1; var audio_started=false; var process_started=false;
    var niteration=0; var start_time_audio=0;
    var ready_to_response=false;  var start_time;
    var nresponded=0; var responses=[]; let readyflag=true;
    var correct_responded=false; var response_height_orig="100px";
    var keyboardListener=null;  
    var display_response_button=true;

    var context_audio= jsPsych.pluginAPI.audioContext();
    //context_audio.resume();
    if(context_audio!==null) context_audio.onstatechange = () => console.log(context_audio.state); // running

    var audio_stim=null; let naudio_stim=0;
    var audio_resp=null; let naudio_resp=0;
    var audio_fback=[]; 
    let response_element;  let gamemode=true;    let canvasmode=false;
    var voices = [];
    var html_noresponse_msg='<p class="font-message" style="color:red">반응이 늦었네요.<br>집중해 주세요.<br>다시 하겠습니다.</p>';

    if(gamemode) response_element=document.querySelector("#webrain-response-container"); //PHJ
    if(response_element===null) { gamemode=false;     response_element=display_element; }
    /**  END GLOBAL VARIABLES PHJ **/

    /** BEGIN FUNCTIONS **/
    var lang= "ko-KR";     
    function set_voice() {               
        var voiceall = window.speechSynthesis.getVoices();
        for(var i = 0; i < voiceall.length ; i++) {
            if(voiceall[i].lang.indexOf(lang) >= 0 || voiceall[i].lang.indexOf(lang.replace('-', '_')) >= 0) {
                voices.push(voiceall[i]);
            }
        }
        if(voices.length==0) {
            return;
        }
    }
    function speech_cancel(){
      if(trial.speech_text===null) return;
      if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
        console.log("This browser does not support speech synthesis")
        return
      }        
      var synth=window.speechSynthesis;
      if (synth.speaking) synth.cancel() // 현재 읽고있다면 초기화
    }

    const apiKey = '5f2a85fc-9d77-4827-a0b8-f173360b7bb9';   
    async function speak(text, apiKey) {
        if (!apiKey) {
            console.error("API key is required to use the Cartesia TTS API.");
            return;
        }
        if (arguments.length<2) apiKey = '5f2a85fc-9d77-4827-a0b8-f173360b7bb9';   
        const url = 'https://api.cartesia.ai/tts/bytes';
        const requestBody = {
            "model_id": "sonic-multilingual",
            "transcript": text,
            "voice": { "mode": "id", "id": "9c0afccc-ce37-46d7-8e68-52794655ea20" },
            "_experimental_voice_controls": { "speed": "slowest", "emotion": ["positivity:high"] },
            "language": "ko",
            "output_format": {
              "container": "mp3",
              "bit_rate": 128000,
              "sample_rate": 44100
            }
        };
    
        const options = {
            method: 'POST',
            headers: {
                'Cartesia-Version': '2024-06-30',
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
    
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.blob();
    
            // Create a URL for the returned blob and play it using an audio element
            const audioURL = URL.createObjectURL(data);
            const audio = new Audio(audioURL);
            audio.play();
        } catch (error) {
            console.error("Failed to fetch the audio from Cartesia API:", error);
        }
    }
    

    async function speak(text, apiKey = '5f2a85fc-9d77-4827-a0b8-f173360b7bb9') {
      // Stop any ongoing audio playback
      if (currentAudio) {
        console.log("Stopping previous audio...");
        currentAudio.pause();
        currentAudio.src = ""; // Clear audio to free resources
        currentAudio = null;
      }
    
      if (!apiKey) {
        console.error("API key is required to use the Cartesia TTS API.");
        return;
      }
    
      // Define the TTS API endpoint and request payload
      const url = 'https://api.cartesia.ai/tts/bytes';
      const requestBody = {
        "model_id": "sonic-multilingual",
        "transcript": text,
        "voice": { "mode": "id", "id": "9c0afccc-ce37-46d7-8e68-52794655ea20" },
        "_experimental_voice_controls": { "speed": "slowest", "emotion": ["positivity:high"] },
        "language": "ko",
        "output_format": {
          "container": "mp3",
          "bit_rate": 128000,
          "sample_rate": 44100
        }
      };
    
      const options = {
        method: 'POST',
        headers: {
          'Cartesia-Version': '2024-06-30',
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      };
    
      try {
        console.log("Fetching audio...");
        const response = await fetch(url, options);
    
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
    
        // Create MediaSource for progressive playback
        const mediaSource = new MediaSource();
        currentAudio = new Audio();
        currentAudio.src = URL.createObjectURL(mediaSource);
    
        let firstChunkAppended = false; // Track if the first chunk is appended
        let sourceBuffer;
    
        mediaSource.addEventListener("sourceopen", async () => {
          sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
          const reader = response.body.getReader();
          const appendQueue = []; // Holds chunks waiting to be appended
    
          const appendChunk = async (chunk) => {
            return new Promise((resolve, reject) => {
              const onUpdateEnd = () => {
                sourceBuffer.removeEventListener("updateend", onUpdateEnd);
                resolve(); // Resolve once the update ends
              };
    
              sourceBuffer.addEventListener("updateend", onUpdateEnd);
              try {
                sourceBuffer.appendBuffer(chunk);
              } catch (error) {
                reject(error); // Reject if appendBuffer fails
              }
            });
          };
    
          console.log("Appending audio chunks...");
          let done = false;
    
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (value) {
              appendQueue.push(value); // Add chunk to the queue
              if (appendQueue.length === 1) {
                // If first chunk, wait for it to append and start playback
                await appendChunk(appendQueue.shift());
                if (!firstChunkAppended) {
                  firstChunkAppended = true;
                  console.log("Starting audio playback...");
                  currentAudio.play(); // Start playback after first chunk
                }
              } else if (appendQueue.length > 0 && !sourceBuffer.updating) {
                await appendChunk(appendQueue.shift());
              }
            }
            done = readerDone;
          }
    
          console.log("All chunks appended. Playback should complete.");
        });
    
        currentAudio.addEventListener("ended", () => {
          console.log("Playback finished.");
        });
      } catch (error) {
        console.error("Failed to fetch or play audio:", error.message || error);
      }
    }

    function speak_www(text, opt_prop) {
      if (arguments.length<2) opt_prop={}; 
      var synth=window.speechSynthesis;
      if(voices.length==0) set_voice();
      const prop = opt_prop || {rate: 1, pitch: 1.0,lang:lang,}
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = prop.rate || 1 ;// 속도: 0.1 ~ 10      
      msg.pitch = prop.pitch || 1 ;// 음높이: 0 ~ 2
      msg.lang = prop.lang || lang;
      msg.voice=voices[0];

      if (synth.speaking) {
        synth.cancel();
        setTimeout(function () { synth.speak(msg); }, 250);
      } else {
        synth.speak(msg);
      }
    }

      
    // check the string contains html... 
    const isHTML=RegExp.prototype.test.bind(/(<([^>]+)>)/i);
    
    /** FUNCTIONS **/
    function html2text(html0) {
      //replace <img with alt text
      if (typeof html0==='undefined') return '';
      if (html0===null) return '';
      if (isHTML(html0)===false) {return html0;}; 
      html0=html0.replaceAll(/<br>/g, ',');
      var container = $("<div>").html(html0);
      container.find("img").replaceWith(function(){
        return this.alt;
      });
      var strAlt = container.html();
      //console.log("output: " + strAlt);
      var text = jQuery(strAlt).text();
      return text;
    }

    function guide_image_html(){
      if(trial.stimulus.includes(trial.guide_image)) // guide image
      {
        let html0=trial.stimulus;
        let sources = html0.match(/<img [^>]*src="[^"]*"[^>]*>/gm); //image tag        
        if(typeof sources!=='undefined')
        {
          html0=html0.replace(sources[0],"");
          html0=html0.replace("<p></p>","");              
          let img= sources.map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0]; //extract image
          trial.stimulus=`<div class="webrain-instruction-container">
                  <div id="webrain-instruction-guide">
                  <img src="${img}" class="webrain-guide-img" /> 
                  </div>
                  <div id="webrain-instruction-info">${html0}</div>
              </div>`;
        }        
      }
    }

    function isAudio(item){
        if (/(wav|mp3|avi|mp4)$/i.test(item)) return true;
        else return false; 
    }
    /** END FUNCTIONS **/
    /** AUDIO FUNCTIONS */


    function load_stimulus_audio() {         
        // load audio file
        return jsPsych.pluginAPI.getAudioBuffer(trial.stimulus_audio)
        .then(function (buffer) {
          if (context_audio !== null) {
            audio_stim = context_audio.createBufferSource();
            audio_stim.buffer = buffer;            
          } else {
            audio_stim = buffer;
            audio_stim.currentTime = 0;
          }
          // set up end event if trial needs it
          if (trial.trial_ends_after_audio) {
            audio_stim.addEventListener('ended', end_trial);
          if ((!trial.response_allowed_while_playing) & (!trial.trial_ends_after_audio)) 
            audio_stim.addEventListener('ended', enable_buttons);
          }     
          //console.log('stimulus audio is ready');     
        })
        .catch(function (err) {
          console.error(`Failed to load audio file "${trial.stimulus_audio}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
          console.error(err)
        });
        
    }

    function load_response_audio() {   
        // load audio file
        return jsPsych.pluginAPI.getAudioBuffer(trial.response_audio)
        .then(function (buffer) {
          if (context_audio !== null) {
            audio_resp = context_audio.createBufferSource();
            audio_resp.buffer = buffer;
          } else {
            audio_resp = buffer;
            audio_resp.currentTime = 0;
          }
          // set up end event if trial needs it
          if (trial.trial_ends_after_audio) {
            audio_resp.addEventListener('ended', end_trial);
          }
          //console.log('response audio is ready');
        })
        .catch(function (err) {
          console.error(`Failed to load audio file "${trial.response_audio}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
          console.error(err)
        });
    }

    const getAudioArrayBuffer=(audio,idx)=>{
      return jsPsych.pluginAPI.getAudioBuffer(audio)
      .then((buffer) => {
        let ad;
        if (context_audio !== null) {
          ad = context_audio.createBufferSource();
          ad.buffer = buffer;
        } else {
          ad = buffer;
          ad.currentTime = 0;
        }
        // set up end event if trial needs it
        if (trial.trial_ends_after_audio) {
          ad.addEventListener('ended', end_trial);
        }
        audio_fback.push(ad);
        //console.log('feedback audio index:'+idx);
      })
      .catch((err) => {
        console.error(`Failed to load feedback audio file "${audio}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
        console.error(err)
      }); 
    }

    async function load_feedback_audios() {   
        // load audio file
        for(var i=0;i<trial.feedback_audios.length;i++){
          let ad=await getAudioArrayBuffer(trial.feedback_audios[i],i);
        }
    }

    function load_and_process(){
      let promise1=1; let promise2=1;
      if (trial.feedback_audios !== null) load_feedback_audios();      
      if (trial.response_audio !== null) promise1=load_response_audio(); 
      if (trial.stimulus_audio !== null) promise2=load_stimulus_audio();  
      Promise.all([promise1, promise2]).then(() => {
        //console.log('All audios are loaded');
        process();
      });
    }

    function disable_buttons() {
      var btns = document.querySelectorAll('.webrain-button-box');
      for (var i=0; i<btns.length; i++) {
        var btn_el = btns[i].querySelector('button');
        if(btn_el){
          btn_el.disabled = true;
        }
        btns[i].removeEventListener('click', button_response);
      }
    }

    function enable_buttons() {
      var btns = document.querySelectorAll('.webrain-button-box');
      for (var i=0; i<btns.length; i++) {
        var btn_el = btns[i].querySelector('button');
        if(btn_el){
          btn_el.disabled = false;
        }
        btns[i].addEventListener('click', button_response);
      }
    }

    function close_stimulus_audio(){
      if(trial.stimulus_audio===undefined || trial.stimulus_audio===null) return; 
      // stop the audio file if it is playing
      // remove end event listeners if they exist
      if (context_audio !== null) {
        audio_stim.stop();
      } else {
        audio_stim.pause();
      }
      audio_stim.removeEventListener('ended', end_trial);
      audio_stim.removeEventListener('ended', enable_buttons);

    }  
    function close_response_audio(){
      if(trial.response_audio===undefined || trial.response_audio===null) return; 
      if(context_audio !== null){
        // stop the audio file if it is playing
        // remove end event listeners if they exist
        if (context_audio !== null) {
          audio_resp.stop();
        } else {
          audio_resp.pause();
        }
        audio_resp.removeEventListener('ended', end_trial);
        audio_resp.removeEventListener('ended', enable_buttons);
      }
    }  
    function close_feedback_audios(){
      if(trial.feedback_audios===undefined || trial.feedback_audios===null) return;       
      // stop the audio file if it is playing
      // remove end event listeners if they exist
      for(var i=0;i<trial.feedback_audios.length;i++) {
        if (context_audio !== null) {
          audio_fback[i].stop();
        } else {
          audio_fback[i].pause();
        }
        audio_fback[i].removeEventListener('ended', end_trial);
        audio_fback[i].removeEventListener('ended', enable_buttons);
      }
    }  
    
    function end_audios(){
      try {
        speech_cancel(); // 현재 읽고있다면 초기화
        close_stimulus_audio();
        close_response_audio();
        close_feedback_audios();
      }
      catch(err){}

    }


    function play_audio(audio, time=0,endflag=false) {      
      if(audio===null) {audio_started=false;return;}
      if(context_audio !== null){
        audio.connect(context_audio.destination);
        audio.start(time);     
      }
      else 
        audio.play();      
      audio_started=true;    
    }

    function play_stimulus_audio(){      
      if (trial.stimulus_audio===null || trial.stimulus_audio ===undefined) return; 
      start_time_audio = performance.now();
      if(!naudio_stim) play_audio(audio_stim);
      else {
        load_stimulus_audio()
        .then(()=>{play_audio(audio_stim);})
      }
      naudio_stim++;
    }
    function play_response_audio(){      
      if (trial.response_audio===null || trial.response_audio ===undefined) return; 
      if(!naudio_resp) play_audio(audio_resp);
      else {
        load_response_audio()
        .then(()=>{play_audio(audio_resp);})
      }
      naudio_resp++;
    }

    function play_feedback_audio(id){
      if (trial.feedback_audios===null || trial.feedback_audios===undefined) return; 
      play_audio(audio_fback[id]);
    }

    function present_audio_response(){  //final
      if (trial.feedback_audios !== null) { //PHJ to be modified       
        var id=0;correct_responded=false; var len=trial.feedback_audios.length;
        if(typeof trial.feedback_audio_index==='function') {
          id=trial.feedback_audio_index.apply(this,[trial.stimulus,responses]);            //which one to play
          if(id==0) correct_responded=true;
        }
        if(id!==null && id>=0 && id<len){
          play_feedback_audio(id);          
        }
      } 
      else {
        play_response_audio();
      }
    }

    /** END AUDIO FUNCITONS */
    function load_html_stimulus(){     
      if(Array.isArray(trial.stimulus)) { 
        nstimuli=trial.stimulus.length; ready_to_response=true; return;      
      }
        html = '<div id="jspsych-unified-button-response-stimulus" class="font-stimulus" ';
        if(trial.stimulus_style !== null)   html += `style="${trial.stimulus_style}"`;
        html +='>'+trial.stimulus+'</div>';
        ready_to_response=true;
    }
  
    function load_canvas_stimulus(){
      if (typeof trial.stimulus_canvas_function === 'function'){  
        html = '<div id="jspsych-canvas-button-response-stimulus">' + '<canvas id="jspsych-canvas-stimulus" ';
        if(trial.canvas_size!==null || trial.canvas_size.length==2) html += 'height="' + trial.canvas_size[0] + '" width="' + trial.canvas_size[1] +'"';
        html += '></canvas>' + '</div>';
        display_element.innerHTML=html;
        ready_to_response=true;
      }
    }
    function clear_children(element=null){
      if(element===null){
          // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
          if (display_element.hasChildNodes()) {
            // can't loop through child list because the list will be modified by .removeChild()
            while (display_element.firstChild) {
              display_element.removeChild(display_element.firstChild);
            }
          }
      }
    }
    function render_on_canvas() {
      var image_drawn = false;
      // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
      clear_children(display_element);

      // create canvas element and image
      var canvas = document.createElement("canvas");
      canvas.id = "jspsych-unified-button-canvas-stimulus";
      canvas.style.margin = 0;
      canvas.style.padding = 0;
      var ctx = canvas.getContext("2d");
      var img = new Image();   
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
      // create buttons
      let buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in unified-button-response plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      var btngroup_div = document.createElement('div');
      btngroup_div.id = "jspsych-unified-button-response-btngroup";
      html = '';
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        html += '<div class="webrain-button-box" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="webrain-button-box-' + i +'" data-choice="'+i+'">'+str+'</div>';
      }
      btngroup_div.innerHTML = html;
      // add canvas to screen and draw image
      display_element.insertBefore(canvas, null);
      if (img.complete && Number.isFinite(width) && Number.isFinite(height)) {
        // if image has loaded and width/height have been set, then draw it now
        // (don't rely on img onload function to draw image when image is in the cache, because that causes a delay in the image presentation)
        ctx.drawImage(img,0,0,width,height);
        image_drawn = true;  
      }
      // add buttons to screen
      display_element.insertBefore(btngroup_div, canvas.nextElementSibling);
      // add prompt if there is one
      if (trial.prompt !== null) {
        display_element.insertAdjacentHTML('beforeend', trial.prompt);
      }
    }

    function render_on_display_element(){
              // display stimulus as an image element
      html = '<img src="'+trial.stimulus+'" id="jspsych-unified-button-response-stimulus">';

      //display buttons
      let buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in unified-button-response plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }

      html += '<div id="jspsych-unified-button-response-btngroup">';
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        html += '<div class="webrain-button-box" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="webrain-button-box-' + i +'" data-choice="'+i+'">'+str+'</div>';
      }
      html += '</div>';

      // add prompt
      if (trial.prompt !== null){
        html += trial.prompt;
      }
      // update the page content
      display_element.innerHTML = html;

      update_stimulus_image_style();
    }

    function calc_layout(nrow,ncol,aspectratio=1) {
        var container=document.querySelector('div.jspsych-content-wrapper');
        //var offy=(display_element.children[0].offsetHeight-display_element.children[2].offsetHeight)/2;
        let height=container.offsetHeight; //window.innerWidth-
        let width=container.offsetWidth; 
        let gapwidthratio = 0.05;let gapheightratio = 0.05;
        let wwidth=window.innerWidth; let wheight=window.innerHeight;
        let butmargx=0; let butmargy=0; 
  
        const centerx=container.offsetWidth/2;
        const centery=container.offsetHeight/2;
        
        if(height>width*3/4) height=width*3/4;   //if(height<width*4/3) height=width*3/4;
        if(aspectratio==1) {
          width=width<height ? width : height;
          height=width; var rto=ncol/nrow; if(rto>1) height=height/rto; else width=width*rto;
        }
        const bheight=height*0.9;const bwidth=width*0.9;
  
        const button_height = Math.round(bheight / (nrow + gapheightratio * (nrow - 1)));
        const button_width = Math.round(bwidth / (ncol + gapwidthratio * (ncol - 1)));
   
        const widthstep = button_width * (1 + gapwidthratio);
        const heightstep = button_height * (1 + gapheightratio);
        const offset_x =centerx-width/2;
        const offset_y =centery-height/2;
        if(trial.stimulus_width===null) trial.stimulus_width=button_width;
        if(trial.stimulus_height===null) trial.stimulus_height=button_height;
        if(aspectratio==1) {
          trial.stimulus_width=trial.stimulus_height>trial.stimulus_width?trial.stimulus_width:trial.stimulus_height;
          trial.stimulus_height=trial.stimulus_width;
        }
        trial.stimulus_positionx = [];
        trial.stimulus_positiony = [];      
        var ct = 0;
        for (var i = 0; i < nrow; i++) {
          for (var j = 0; j < ncol; j++) {
            trial.stimulus_positionx[ct] = Math.round(j * widthstep + offset_x);
            trial.stimulus_positiony[ct] = Math.round(i * heightstep + offset_y);
            ct = ct + 1;
          }
        }
    }
    function generate_stimulus_grid (pattern, image_size){
      var nrows = pattern.length;
      var ncols = pattern[0].length;  
      // create blank element to hold code that we generate
      var html_ = '<div id="jspsych-unified-button-dummy" css="display: none;">';  
      // create table
      html_ += '<table id="jspsych-unified-button table" '+
        'style="border-collapse: collapse; margin-left: auto; margin-right: auto;">';  
      for (var row = 0; row < nrows; row++) {
        html_ += '<tr id="jspsych-unified-button-table-row-'+row+'" css="height: '+image_size[1]+'px;">';  
        for (var col = 0; col < ncols; col++) {
          html_ += '<td id="jspsych-unified-button-table-' + row + '-' + col +'" '+
            'style="padding: '+ (image_size[1] / 10) + 'px ' + (image_size[0] / 10) + 'px; border: 1px solid #555;">'+
            '<div id="jspsych-unified-button-table-cell-' + row + '-' + col + '" style="width: '+image_size[0]+'px; height: '+image_size[1]+'px;">';
          if (pattern[row][col] !== 0) {
            html_ += '<img src="'+pattern[row][col]+'" style="width: '+image_size[0]+'px; height: '+image_size[1]+'"></img>';
          }
          html_ += '</div>';
          html_ += '</td>';
        }
        html_ += '</tr>';
      }  
      html_ += '</table>';
      html_ += '</div>';  
      return html_;  
    }

    function load_bstimuli(targetno=-1){
      if(trial.stimulus_positionx===null || trial.stimulus_positiony===null) calc_layout(trial.stimulus_nrow,trial.stimulus_ncol);
      let ct=0; let str; let ncnt=trial.stimulus_ncol*trial.stimulus_nrow; 
      let buttons=[];
      let type=1;
      if (trial.choices.length==2) type=0;
      else if(trial.stimulus.length == ncnt && trial.stimuli_isi.length==0) type=1;
      else if(trial.stimulus.length == trial.stimuli_isi.length) type=2;      
      if (type==2 && targetno==-1) targetno=trial.stimulus[trial.stimulus.length-1];
      if(type==2 && targetno.length!=ncnt) type=3;

      for(let ct=0;ct<ncnt;ct++) {
        //choices[ct]=ct.toString();
        if (type==0) { //for two types of stimuli buttions, 두개의 버턴중에 하나를 고르는 형태...그리드 스팬의 경우
          str=trial.choices[0]; if(targetno==ct) str=trial.choices[1]; //target choice
        }            
        else if(type==1){  //한번에 제시하는 멀티버턴 vs 시퀀스버턴
          str=trial.choices[trial.stimulus[ct]];
        }
        else if(type==2)  {      //Atsus      
          str=trial.choices[targetno[ct]];
        }
        let choice='<img src="'+ str + '" width="'+(trial.stimulus_width-4)+'px" height="'+(trial.stimulus_height-4)+'px"></img>'; //-4 는 다시 생각해야 함..         
        if(type==2) {buttons[ct]='<p class="webrain-btn response-btn2" style="width:'+trial.stimulus_width+'px; height:'+ trial.stimulus_height +'px;">'+ choice+'</p>';   }
        else buttons[ct]='<button class="webrain-btn response-btn2" style="width:'+trial.stimulus_width+'px; height:'+ trial.stimulus_height +'px;">'+ choice+'</button>';         
      }

      var html_ = '<div id="webrain-unified-button-response-btngroup" class="webrain-unified-button-response-btngroup">';   
      let button_stimulus_html;
      for (var i = 0; i < buttons.length; i++) {
        //var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        str=buttons[i];
        style='style="position:absolute;';
        if(trial.stimulus_width!==null) style+='width:'+trial.stimulus_width+'px; ';
        if(trial.stimulus_height!==null) style+='height:'+trial.stimulus_height+'px; ';
        if(trial.stimulus_positionx!==null) style+='left:'+trial.stimulus_positionx[i]+'px; ';
        if(trial.stimulus_positiony!==null) style+='top:'+trial.stimulus_positiony[i]+'px; ';
        style+='"';
        button_stimulus_html = '<div class="webrain-button-box" '+ style+ 
          'id="webrain-button-box-'+i+'" data-choice="'+i+'">'+str+'</div>';
        html_ += button_stimulus_html;
      }
      html_ += '</div>';

      return html_;
    }  

    function present_bstimuli(targetno=-1){     
      html=load_bstimuli(targetno);       
      if(!gamemode){        //show prompt if there is one
        if (trial.prompt !== null) html += trial.prompt;
      }
      display_element.style.width='100%';display_element.style.height='100%';
      display_element.innerHTML = html;   

      start_time = performance.now(); //PHJ in case of multiple stimuli, start_time may be measured before displaying response buttons.
      
      if(targetno>=0) play_stimulus_audio();
      else make_stimulus_buttons_listen(trial.stimulus_ncol*trial.stimulus_nrow);  
      display_response_button=false;
    }
      
    function present_bstimuli_sequence(){      
      if (niteration===nstimuli)  {
          ready_to_response=true;
          present_bstimuli(-1); //get responses
          return ;
      };
      //if(niteration>0) display_element.innerHTML = "";
      html=load_bstimuli(trial.stimulus[niteration]); //prepare buttons
      if (trial.prompt !== null) html += trial.prompt;  

      display_element.style.width='100%';display_element.style.height='100%';
      display_element.innerHTML = html;   
    
      start_time = performance.now(); //PHJ in case of multiple stimuli, start_time may be measured before displaying response buttons.       
      
      play_stimulus_audio();   

      if (trial.stimuli_isi[niteration] > 0) {
        jsPsych.pluginAPI.setTimeout(function(){
          niteration=niteration+1;    //console.log("tMulti sequence:"+niteration);   
          present_bstimuli_sequence();
        },trial.stimuli_isi[niteration]);                   
      } else {
        niteration=niteration+1; 
        if(trial.taskID.slice(0,5).toLowerCase()=='atsus') { //Atsus
          let ii=-1;let a=trial.stimulus[niteration-1];
          for (let i=0;i<a.length;i++) if(a[i]>0) {ii=i;break;  }
          if(ii>=0) {
            var obj=display_element.querySelector('#webrain-button-box-' + ii);
            if(obj!==undefined) 
              ready_to_response=true;
                   // end trial if time limit is set
              if (trial.trial_duration !== null) {
                jsPsych.pluginAPI.setTimeout(function() {
                  end_trial();
                }, trial.trial_duration);
              } 
              obj.addEventListener('click', function(e){                
                var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
                after_response(choice);
              });
              play_stimulus_audio();
          }
        } else {
          ready_to_response=true;
          present_bstimuli(-1); //get responses
        }
      }          
    }
  
    function present_bgrid(targetno=-1){      
      let ntot=trial.stimulus_nrow*trial.stimulus_ncol;
      html=load_bgrid(trial.stimulus_nrow,trial.stimulus_ncol,targetno); //prepare buttons
      if(!gamemode){        //show prompt if there is one
        if (trial.prompt !== null) html += trial.prompt;
      }
      display_element.style.width='100%';display_element.style.height='100%';
      display_element.innerHTML = html;      

      start_time = performance.now(); //PHJ in case of multiple stimuli, start_time may be measured before displaying response buttons.
      
      if(targetno>=0) play_stimulus_audio();
      else {
        make_stimulus_buttons_listen(trial.stimulus_ncol*trial.stimulus_nrow);
        
        if(trial.choices.length>0) {
          const cstyle=adjust_button_size(); 
          let html0=''; let chois=["retry","confirm"];
          for (let i = 0; i < trial.choices.length; i++) {
            let choice=trial.choices[i]; let imgflag=false;
            if(isImage(choice)) {
              choice='<img src="'+choice+'" style="width:100%; height:100%;">';   
              imgflag=true;
            }
            let ii=ntot+i;
            let color; if(i==0) color='green'; else color='red';
            html0 +=`<div class="webrain-button-box" style="${cstyle}" id="webrain-button-box-${ii}" data-choice="${chois[i]}">`;
            if(imgflag) html0 +=`<button style="background-color:transparent;border: none;width:80px; height:80px;align-items:center;">${choice}</button>`;
            else html0 +=`<button style="background-color:transparent;border: 3px solid ${color};width:80px; height:80px;align-items:center;border-radius: 50%;">${choice}</button>`;
            html0 +='</div>';  
          }
          response_element.innerHTML=html0;
          for (let i = 0; i < trial.choices.length; i++) {
            let ii=ntot+i;
            var obj=response_element.querySelector('#webrain-button-box-' + ii);
            if(obj===undefined) continue;
            obj.addEventListener('click', function(e){
              var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
              if(choice=='retry') {
                if(responses.length>0) {
                  let ch=responses[nresponded-1].button;
                  responses.splice(nresponded-1, 1);
                  mark_responded_button(ch,false);
                  nresponded--;
                }
              }
              else if(choice=='confirm') {
                if(nresponded<trial.max_response_count) return;
                var end_time = performance.now();
                var rt = end_time - start_time;
                response.rt = rt;

                present_audio_response();
                jsPsych.pluginAPI.setTimeout(function(){                
                  disable_buttons_end_trial();
                }, 300);
              }
            });
          }
        }
      }
      display_response_button=false;
    }
  
    function present_bgrid_sequence(){      
        if(niteration>0) display_element.innerHTML = "";
        if (niteration==nstimuli)  { //final
            ready_to_response=true;
            present_bgrid(-1); //get responses
            return ;
        }
        html=load_bgrid(trial.stimulus_nrow,trial.stimulus_ncol,trial.stimulus[niteration]); //prepare buttons
        if (trial.prompt !== null) html += trial.prompt;  

        display_element.style.width='100%';display_element.style.height='100%';
        display_element.innerHTML = html;   

        let rhtml =`<div class="webrain-button-box" id="webrain-button-box-hidden"></div>`;
        response_element.innerHTML=rhtml;        
        
        play_stimulus_audio();   
        start_time = performance.now(); //PHJ in case of multiple stimuli, start_time may be measured before displaying response buttons.       

        if (trial.stimuli_isi[niteration] > 0) {
            jsPsych.pluginAPI.setTimeout(function(){
              niteration=niteration+1;     
              present_bgrid_sequence();
            },trial.stimuli_isi[niteration]);                   
        }            
    }

    function load_bgrid(nrows,ncols,choiceid=null,style=null){ //button grid
      var width=trial.stimulus_width; var height=trial.stimulus_height;
      if(style===null){
        var style=`width: ${width}px; height: ${height}px; text-align: center; `;
        //align-self:center;align-items:center;justify-content: center;
      }
      var html_ = '<div id="jspsych-unified-grid-dummy" css="display: none;">';
      html_ += '<table id="jspsych-unified-grid table" '+
        'style="border-collapse: collapse;margin-left: auto; margin-right: auto;border: 2px;">';
      let nstim=nrows*ncols;    
      if(choiceid==-1 && trial.stimuli_image_set!==null && trial.taskID.slice(0,5).toUpperCase()=='CXSpa'.toUpperCase()) { 
        choiceid=[]; for(let i=0;i<nstim;i++) choiceid.push(0);
      }
      let type=0;
      if(Array.isArray(choiceid) && choiceid.length==nstim && trial.stimuli_image_set!==null) type=3;

      let ct=0; let done=false;
      for (var row = 0; row < nrows; row++) {
        if(done) break;
        html_ += '<tr id="jspsych-unified-grid-table-row-'+row+'" css="height:'+height+'px;width:'+width+'px;">';
        for (var col = 0; col < ncols; col++) {          
          html_ += '<td id="jspsych-unified-grid-table-' + row + '-' + col +'" ';
          if(type!=3) html_+='style="padding: '+ (height / 10) + 'px ' + (width / 10) + 'px; '; 

          if(choiceid===null) html_+='">';
          else html_+=' border: 2px solid black; ">';            
          /* */
          if(choiceid===null){ //fill all the grid with given choices
            html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style};">`; 
            if(ct==trial.choices.length) {done=true; break;}
            if (trial.choices[ct].length>0) { //not empty
              if(isImage(trial.choices[ct])) {
                let choice='<img src="'+trial.choices[ct]+'" style="width:100%; height:100%;"></img>';
                let buthtml=`<button style="width:${width-1}'px; height:${height-1}'px; align-items:center; background-color: Transparent;">`+ choice+'</button>';          
                html_ += buthtml;
              }
              else html_ +=trial.choices[ct];
            }
          } else if (type==3) { //jsCXSpanb
            html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style};">`; 
            let choice='<img class="webrain-button-box-img" src="'+trial.stimuli_image_set[choiceid[ct]]+'" style="width:100%; height:100%;"><div class="webrain-button-box-txt"></div>';
            let buthtml=`<button style="width:${width-1}'px; height:${height-1}'px; align-items:center; background-color: Transparent;border: none;padding:0;">`+ choice+'</button>';          
            html_ += buthtml;
          } else {
            if (choiceid==ct){
              html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style};background-color:red;border-radius: 8px;">`; 
            } else {
              html_ += `<div id="webrain-button-box-${ct}" data-choice="${ct}" style="${style};background-color:Transparent;">`;    
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
  
    function present_stimuli_sequence(){   
      if (niteration==nstimuli)  {
        //console.log("Multi sequence*:"+niteration+" of "+nstimuli);
        html="";let type=trial.taskID.slice(0,6).toLowerCase();
        if(trial.prompt !=null && (type=='rmspan' || type=='crspan')) {
          display_element.innerHTML = trial.prompt;
        }
        else display_element.innerHTML = "";

        if(trial.taskID=='')
        if(trial.stimulus_type==='background') {
          let stim1='';
          document.querySelector("body").style.backgroundImage = `url("${stim1}")`;
        }
        if(!trial.response_multistim_first){
          start_time = performance.now();
          ready_to_response=true;
          response_wait_process();
          ready_to_response=false;
        }
        return 0;
      } 

      //console.log("Multi sequence:"+niteration+" of "+nstimuli);
      let stim=trial.stimulus;
      if(nstimuli>1) stim=trial.stimulus[niteration];
      
      let stype=1; //if stim is image or html
      if(isAudio(stim)) stype=2;
      if(stype==1){   // image stimuli
        if(trial.stimulus_type==='image'){
          html = '<img src="'+ stim+'" id="jspsych-unified-button-response-stimulus" style="'; //PHJ class
          if(trial.stimulus_height !== null){
            html += 'height:'+trial.stimulus_height; 
            if(trial.stimulus_height!=='auto') html+='px; '
            if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
                html += 'width: auto; ';
            }
          }
          if(trial.stimulus_width !== null){
              html += 'width:'+trial.stimulus_width;
              if(trial.stimulus_width!=='auto') html+='px; ';
              if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
                  html += 'height: auto; ';
              }
          }
          if(trial.stimulus_style !== null) html += trial.stimulus_style; //additional style
          html +='"></img>';
        } else if(trial.stimulus_type==='html') {
          html = '<div id="jspsych-unified-button-response-stimulus" class="font-stimulus" ';
          if(trial.stimulus_style !== null)   html += `style="${trial.stimulus_style}"`;
          html +='>'+stim+'</div>';
          if(trial.speech_text!==null) speak(html2text(stim)); // speak 
        } else if(trial.stimulus_type==='background') {              
          document.querySelector("body").style.backgroundImage = `url("${stim}")`;
          html = '';
        }        
        display_element.innerHTML = html;  
        display_element.style.width='100%';display_element.style.height='100%';//바꾸어야 함..
      } else if (stype==2) { //audio
        play_audio(stim);     
        html=stim; 
      } 
      

      start_time = performance.now();
      if(trial.response_multistim_first){
        ready_to_response=true;
        response_wait_process();
        ready_to_response=false;
      }

      play_stimulus_audio();            
      //var nid=trial.stimulus_duration.length<niteration? trial.stimulus_duration.length:niteration;
      if(nstimuli>1){
        if (trial.stimuli_isi.length > 0) {
          if (trial.stimuli_isi[niteration] > 0) { 
            jsPsych.pluginAPI.setTimeout(()=>{              
              //console.log("tMulti sequence:"+niteration);   
              niteration=niteration+1;       
              present_stimuli_sequence();
              }, trial.stimuli_isi[niteration]);                 
          } else {
            niteration=niteration+1;  
          }  
        }         
      }            
    }
  
  
    function update_stimulus_image_style(){
      // set image dimensions after image has loaded (so that we have access to naturalHeight/naturalWidth)
      var img = display_element.querySelector('#jspsych-unified-button-response-stimulus');
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
      img.style.height = height.toString() + "px";
      img.style.width = width.toString() + "px";
    }

    function make_stimulus_buttons_listen(blen){
      // start timing      
      for (var i = 0; i < blen; i++) {
        var obj=display_element.querySelector('#webrain-button-box-' + i);
        if(obj===undefined) continue;
        obj.addEventListener('click', function(e){
            var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
            after_response(choice);
        });
      }
    }

    function adjust_button_size(){ // 경우 마다 매우 복잡함... 
      const nbut=trial.choices.length;
      let newheight="100%"; let obutwidth;
      if(nbut>=8) response_element.style.width="80%";
      if(nbut>3){
        let height=response_element.offsetHeight; //window.innerWidth-
        let width=response_element.offsetWidth; 
        let butpadx=0; let butbordx=0; 
        let butmargx=0; //if(trial.margin_horizontal.includes("px")) butmargx=parseInt(trial.margin_horizontal.); 
        if (trial.margin_horizontal!==null) {
          var id=trial.margin_horizontal.indexOf("px");
          if (id>0) butmargx=parseInt(trial.margin_horizontal.slice(0,id[0]));
        }        
        let butwidth=height;
        let bwidth=butwidth+2*(butpadx+butbordx);
        obutwidth=Math.round((width/nbut-2*butmargx-butpadx-butbordx)); 
        
        if (nbut<8) height=(120+2*height)/3; //should be changed... 
        newheight=Math.round(obutwidth*100/height);          
      }
      let cstyle='';
      if (trial.margin_vertical!==null) cstyle+=` margin-top:${trial.margin_vertical}  margin-bottom:${trial.margin_vertical}`;
      if (trial.margin_horizontal!==null) cstyle+=` margin-left:${trial.margin_horizontal}  margin-right:${trial.margin_horizontal}`;      
      
      if (nbut>3) { //cstyle+=` width:${obutwidth}px height:${obutwidth}px `;    
        if(newheight<100) cstyle+=` height:${newheight}% `;               
      }
      return cstyle;
    }
    function isImage(item){
      if (/(jpg|gif|png|jpeg)$/i.test(item)) return true;
      else return false; 
    }

    function present_response_buttons() { 
      if(trial.choices.length==0 && trial.button_html.length==0) { //no display for button
        display_response_button=false;
        return; //no display for button
      }
      // 앞으로 수정 사항
      // choices.length>0 && trial.button_html.length<=1 멀티 choice item inserted into a single formation of button_html
      // choices.length>0 && choices.length==trial.button_html.length 멀티 choice item inserted into each button_html
      // trial.button_html.length>0 && choices.length!==trial.button_html.length 멀티 choice item inserted into each button_html
      // present in the format of grid or not.. by checking nrows 

      let html0=html; html='';
      let str_butt_flag=false;
      if(gamemode){        //show prompt if there is one
        if (trial.prompt !== null && niteration>=nstimuli-1) html0 += '<font class="font-stimulus">'+ trial.prompt +'</font>';
      }
      //display buttons
      let buttons = [];
      if (Array.isArray(trial.button_html) && trial.button_html.length>0) { //array
          if (trial.button_html.length == trial.choices.length) {
              buttons = trial.button_html;
          } else {
            buttons = trial.button_html;
            //console.error('Error in unified-button-response plugin. The length of the button_html array does not equal the length of the choices array');
          }
      } else { //
          str_butt_flag=true;
          for (var i = 0; i < trial.choices.length; i++) buttons.push(trial.button_html); //assign each choices to button_html format
      }       
      if(trial.choices.length>0){
        if(trial.button_nrow==1){
          const cstyle=adjust_button_size();
          for (let i = 0; i < trial.choices.length; i++) {
            let str=trial.choices[i];
            if(buttons.length==trial.choices.length)  {               
              str = buttons[i].replace(/%choice%/g, trial.choices[i]);
            }
            //nekim 오디오 버튼
            html +=`<div class="webrain-button-box" id="webrain-button-box-${i}" data-choice="${i}">${str}</div>`;
            //html +=`<div class="webrain-button-box" style="${cstyle}" id="webrain-button-box-${i}" data-choice="${i}">${str}</div>`;
          }
        } else { //multi rows
          const cstyle=adjust_button_size();
          html+=load_bgrid(trial.button_nrow,trial.button_ncol);//,cstyle); grid assigned with trial.choices
        }
      } else {
        html=trial.button_html;
      }

      // To where it should be displayed...
      if(!gamemode){        //show prompt if there is one
        if (trial.prompt !== null) html += trial.prompt;
        
        //nekim 오디오 버튼
        if(!str_butt_flag) html='<div class="webrain-response-container">' +html+'</div>';     
        //if(str_butt_flag) html='<div style="display:flex; flex-direction: row" >' +html+'</div>';     
        display_element.innerHTML = html0+html;    
      } else { //unified webrain mode
        if(!canvasmode) display_element.innerHTML = html0;    
        response_element.innerHTML=html;

        if(trial.button_nrow>1) {response_height_orig=response_element.style.height; response_element.style.height="200px"; };//grid};
      }
      //start_time = performance.now(); //PHJ in case of multiple stimuli, start_time may be measured before displaying response buttons.

      for (var i = 0; i < trial.choices.length; i++) {
        response_element.querySelector('#webrain-button-box-' + i).addEventListener('click', function(e){
            var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
            after_response(choice);
        });
      } 
      display_response_button=false;
    }   
  
    function load_stimulus_at_layout(img,no){
      if(trial.stimulus_positionx===null || trial.stimulus_positiony===null) calc_layout(trial.stimulus_nrow,trial.stimulus_ncol); 
      ready_to_response=true;
      return load_stimulus_at(img,trial.stimulus_positionx[no],trial.stimulus_positiony[no],trial.stimulus_width,trial.stimulus_height);
    }
    function load_stimulus_at(img,posx,posy,width,height){
      var html0='<div id="webrain-unified-button-response-btngroup" class="webrain-unified-button-response-btngroup" >';  
      html0+='<img src="'+ img + '" id="jspsych-unified-button-response-stimulus" style="width:'+width+
      'px; height:'+height+'px; position:absolute;'+' left:'+posx+'px; top:'+posy+'px;"></img>';  
      html0+='</div>';       
      return html0
    }

    function load_image_stimulus_single(img,id=null,posx=null,posy=null,width=trial.stimulus_width,height=trial.stimulus_height,style=trial.stimulus_style) //phj
    {
      let off=0; let ids='';if(id!=null) ids=id;
      let html0 = '<img src="'+img+'" id="jspsych-unified-button-response-stimulus' +ids+'" class="img-stim" ';
       //nekim removed but phj modified
      if(trial.user_stim_style_flag)
      if(posx!==null || posy!==null || width!==null || height!==null || style!==null){
        html0 += ' style="';
        if(height !== null){
          html0 += 'height:'+(height+off)+'px; '
          if(width == null && trial.maintain_aspect_ratio) html0 += 'width: auto; ';
        }
        if(width !== null){
          html0 += 'width:'+width+'px; ';
          if(height == null && maintain_aspect_ratio) html0 += 'height: auto; ';
        }
        if(posx !== null || posy !== null) {
          html0+='position:absolute;';
          if(posx !== null) html0 += 'left:'+posx+'px; '
          if(posy !== null) html0 += 'top:'+posy+'px; '
        }
        if(style !== null)   {html0 += style;}
        html0 += '"';
      }

      html0 += ' >';
      return html0;
    }

    function load_image_stimulus(){
      if(typeof trial.stimulus==='string') {
        if (trial.stimulus.includes('<img',0)){ //html ,//계산량이 많은면 할 필요가 있을까..
          html=trial.stimulus;
        }  else {     
          html=load_image_stimulus_single(trial.stimulus);
        }
        ready_to_response=true;
        return;
      }
      let stimuli=[];
      if(Array.isArray(trial.stimulus)) stimuli=trial.stimulus;
      else {
        stimuli=[trial.stimulus];
      }
      if(trial.stimuli_isi.length==stimuli.length)  { //sequence image.. for focused switch
        nstimuli=stimuli.length;
      }  
      else { //not sequence
        html=''; let n; let posx=[]; let posy=[]; let width=[]; let height=[];
        if(trial.stimulus_positionx===null) for(let i=0;i<stimuli.length;i++) posx[i]=null;
        else{
          let npos=trial.stimulus_positionx.length;
          if(npos==stimuli.length) for(let i=0;i<stimuli.length;i++) posx[i]=trial.stimulus_positionx[i];
          else if(npos==0) for(let i=0;i<stimuli.length;i++) posx[i]=null;
          else for(let i=0;i<stimuli.length;i++) { n=Math.min(i,npos); posx[i]=trial.stimulus_positionx[n];}
        }
        if(trial.stimulus_positiony===null) for(let i=0;i<stimuli.length;i++) posy[i]=null;
        else {
          npos=trial.stimulus_positiony.length;
          if(npos==stimuli.length) for(let i=0;i<stimuli.length;i++) posy[i]=trial.stimulus_positiony[i];
          else if(npos==0) for(let i=0;i<stimuli.length;i++) posy[i]=null;
          else for(let i=0;i<stimuli.length;i++) { n=Math.min(i,npos); posy[i]=trial.stimulus_positiony[n];}
        }
        if(trial.stimulus_width===null) for(let i=0;i<stimuli.length;i++) width[i]=null;
        else {
          if(Array.isArray(trial.stimulus_width)) for(let i=0;i<stimuli.length;i++) width[i]=trial.stimulus_width[i];
          else for(let i=0;i<stimuli.length;i++) width[i]=trial.stimulus_width;
        }
        if(trial.stimulus_height===null) for(let i=0;i<stimuli.length;i++) height[i]=null;
        else {
          if(Array.isArray(trial.stimulus_height)) for(let i=0;i<stimuli.length;i++) height[i]=trial.stimulus_height[i];
          else for(let i=0;i<stimuli.length;i++) height[i]=trial.stimulus_height;
        }
        
        for (let im=0;im<stimuli.length;im++){
          let stimulus=stimuli[im]; let id;
          if(im==0) id=null; else id=im;
          if(typeof stimulus==='string'){
            html+=load_image_stimulus_single(stimulus,id,posx[im],posy[im],width[im],height[im]);
          } else { //structure// 추후에 구현...

          }
        }
      }
      ready_to_response=true;
    }


    function load_background_stimulus(){
      if (typeof trial.stimulus === 'string'){            
        document.querySelector("body").style.backgroundImage = `url("${trial.stimulus}")`;
        nstimuli=1;
      } else {
        nstimuli=trial.stimulus.length;
      }
      html='';
      ready_to_response=true;   
    }

    function present_single_stimulus(){
      if(canvasmode){
        let canvas = document.getElementById("jspsych-canvas-stimulus");
        trial.stimulus_canvas_function(canvas,trial);//.apply(this,c);
      } else { //draw
        // display_element.style.width='100%';display_element.style.height='100%';               
        display_element.innerHTML = html; 
      }
      start_time = performance.now(); //PHJ in case of multiple stimuli, start_time may be measured before displaying response buttons.
      play_stimulus_audio();      
      
      if(trial.speech_text!==null) {           // speak mode html2text(trial.speech_text); */
        speak(trial.speech_text);
      }
    }
  
    // disable all the buttons after a response
    function disable_buttons_end_trial(){
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      // PHJ display_element.querySelector('#jspsych-unified-button-response-stimulus').className += ' responded';
  
      var btns = document.querySelectorAll('.webrain-button-box button');
      for(var i=0; i<btns.length; i++){
          //btns[i].removeEventListener('click'); by jspsych
          btns[i].setAttribute('disabled', 'disabled');
      }
      if(trial.stimulus_type==="grid-numbers"){
        let ntot=trial.stimulus_ncol*trial.stimulus_nrow;
        for (let i = 0; i < ntot; i++) {
          var obj=display_element.querySelector('#webrain-button-box-' + i);
          if(obj===undefined) continue;
        }
        for (let i = 0; i < trial.choices.length; i++) {
          let ii=ntot+i;
          var obj=response_element.querySelector('#webrain-button-box-' + ii);
          if(obj===undefined) continue;
        }
      }
      if (trial.response_ends_trial) {
        if (trial.wait_duration_after_multiresponses > 0) { //PHJ
          jsPsych.pluginAPI.setTimeout(function(){
            end_trial();
          },trial.wait_duration_after_multiresponses);                   
        } 
        else end_trial();
      }
    }

    function mark_responded_button(id,flag=true){
      if(trial.stimulus_type=="grid-numbers") { //CXSpan
        var obj=display_element.querySelector('#webrain-button-box-' + id);
        if(obj===undefined) return;
        if(trial.stimuli_image_set!==null) 
        {
          var img1 = obj.getElementsByClassName("webrain-button-box-img")[0];
          var txt1 = obj.getElementsByClassName("webrain-button-box-txt")[0];
          if(flag){ 
            img1.src=trial.stimuli_image_set[1];
            txt1.innerHTML=nresponded;
          } else {
            img1.src=trial.stimuli_image_set[0];
            txt1.innerHTML='';
          }
        }
        else {
          if(flag){ 
            obj.style.backgroundColor="red";
            obj.style.borderRound='8px';
            obj.innerHTML=nresponded;
          }
          else{
            obj.style.backgroundColor="white";
            obj.innerHTML='';
          }
        }
      }
      else{
        var btns = document.querySelectorAll('.webrain-button-box button');
        if(id<btns.length){
            //btns[i].removeEventListener('click');
            if(correct_responded) btns[id].style.border='2px solid black';
        }  
      } 
    }

    // function to handle responses by the subject
    function after_response(choice) {
        let nooverlap=true; let erase_timeout=0;
        // measure rt
        var end_time = performance.now();
        var rt = end_time - start_time;
        if(choice.key!==undefined) {
          let v=null;
          if(choice.key==trial.keyboard_choices[0]) v=0;
          else if(choice.key==trial.keyboard_choices[1]) v=1;
          rt=choice.rt;
          choice=v; 
        } else choice=parseInt(choice);
        if(trial.max_response_count>1 && nooverlap){
          for(let i=0;i<responses.length;i++) //이전 것은 풀어 버린다. CXspan
          {
            if(responses[i].button==choice){
              play_response_audio(); 
              responses.splice(i, 1);
              if(trial.mark_responded_button)mark_responded_button(choice,false);
              nresponded--;
              return;
            }            
          }
        }
        response.button = choice;
        response.rt = rt;

        if(niteration>0 && niteration==nstimuli && trial.taskID.slice(0,5).toLowerCase()=='atsus' ) {
          var obj=display_element.querySelector('#webrain-button-box-' + choice).getElementsByClassName("webrain-btn response-btn2")[0];
          if(obj!==undefined) { 
            obj.innerHTML+='<p style="font-size:1rem; color:red;position:absoulute; top:50%;left:50%;transform:translate(-50%,0%);">'+parseInt(rt) +'</p>';
            erase_timeout=500;
          }
        }
        /* AFTER AUDIO */
        responses.push({ button: choice, rt: rt});
        //console.log("R" +nresponded+ ":" + response.button + " rt="+response.rt);    
        nresponded++; 
        if (trial.stimulus_audio !== null) { //PHJ
            var rt_audio = end_time - start_time_audio;
            response.rt_audio = rt_audio;
        } //PHJ
        /* END AFTER AUDIO */
        speech_cancel();
        
        if (nresponded<trial.max_response_count) { //for multiple choices
          if(trial.stimuli_isi.length==0){ //present stimuli button at once without sequence
            if(trial.max_response_count>1000) present_audio_response(); // only for d2r왜 여기에 있지 종료 평가 신호가...
            else play_response_audio();  //다른 것들은 여기서.. 특히 cxspan
            if(trial.mark_responded_button) mark_responded_button(choice);
            if(trial.stimulus!=null && (trial.stimulus.length-1)==choice) {
              disable_buttons_end_trial(); // end 맨마지막 버턴을 종료 버턴으로 하는 경우... d2r
            }
          } else {
            play_response_audio(); //waiting for another responses
            if(trial.mark_responded_button) mark_responded_button(choice);
          }
        } else { //reached max response counts..           
          if(trial.stimuli_isi.length>0 && isNaN(trial.stimuli_isi[niteration]) && readyflag){ //button-responsed multi stimulus NaN isi
            if (niteration==nstimuli){ //span stimulus-response case          FX를 위해 임시로 지움.. 
              if(trial.prompt!==null && trial.prompt_button_html!==null) //FX
              {
                responses.length=0; nresponded=0;
                display_element.innerHTML=trial.prompt;
                response_element.innerHTML=trial.prompt_button_html;
                //present_response_buttons();
                //new question and response buttons..
                readyflag=false;
                // start timing     
                let blen=20; 
                for (var i = 0; i < blen; i++) {
                  var obj=response_element.querySelector('#webrain-button-box-' + i);
                  if(obj===undefined || obj===null) continue;
                  obj.addEventListener('click', function(e){                      
                      var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
                      after_response(choice);
                  });
                }
              } else {
                present_audio_response();
                
                jsPsych.pluginAPI.setTimeout(function(){                
                  disable_buttons_end_trial();
                }, erase_timeout);    
              }
            } else {
              display_element.innerHTML='';
              jsPsych.pluginAPI.setTimeout(function(){                
                present_stimuli_sequence();
                }, 200); 
            }
          } else {
            if(trial.mark_responded_button) {                             
              let ntot=trial.stimulus_nrow*trial.stimulus_ncol;
              let ii=ntot+1;//임시.
              var obj=response_element.querySelector('#webrain-button-box-' + ii);
              if(obj===undefined || obj===null) { //confirm 버턴이 없는 경우
                mark_responded_button(choice);    
                present_audio_response();
                jsPsych.pluginAPI.setTimeout(function(){                
                  disable_buttons_end_trial();
                }, 200);                     
              } else{ // confirm 버턴이 있는 경우
                play_response_audio(); 
                if(nresponded>trial.max_response_count){
                  let ch=responses[nresponded-1].button;
                  responses.splice(nresponded-1, 1);
                  mark_responded_button(ch,false);
                  nresponded--;
                } else {
                  mark_responded_button(choice);   
                }
              }
            } else {
              present_audio_response();
              disable_buttons_end_trial();
            }
          }
        }
    }

    // function to end trial when it is time
    function end_trial() {
        end_audios();
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();    

         // kill keyboard listeners
        if (keyboardListener !== null) {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }

        // gather the data to store for the trial
        var trial_data = {
            "rt": response.rt,
            "stimulus": trial.stimulus,
            "button_pressed": response.button,
            "responses":responses,
            "stim_duration":trial.stimulus_duration,
            "stim_soa":trial.trial_duration
        };
        /* AUDIO related response */
        if (trial.stimulus_audio !== null) { //PHJ
            trial_data.stimulus_audio=trial.stimulus_audio;
            trial_data.rt_audio=trial.rt_audio; //PHJ
        };
        /* AUDIO related */

        if(trial.button_nrow>1) {response_element.style.height=response_height_orig; }; //grid
        if (responses.length==0 && trial.noresponse_warning) // no responses are found
        {
            display_element.innerHTML=html_noresponse_msg;
            if(trial.speech_text) speak(html2text(html_noresponse_msg)); // speak 
            jsPsych.pluginAPI.setTimeout(function(trial_data) {
                    display_element.innerHTML = '';                    
                    if(gamemode && !trial.keep_response_buttons) response_element.innerHTML = '';
                    jsPsych.finishTrial(trial_data);
                }, 1000);
        }
        else{
          // clear the display
          display_element.innerHTML = '';
          if(gamemode && !trial.keep_response_buttons) response_element.innerHTML = '';
          // move on to the next trial
          jsPsych.finishTrial(trial_data);
        }
    };


    function start_wait_for_response() {        
      if (nstimuli==1) {
        if (trial.stimulus_duration !== null) { // hide image if timing is set          
          jsPsych.pluginAPI.setTimeout(function() {
            var obj=display_element.querySelector('#jspsych-unified-button-response-stimulus');
            if(obj!==null) obj.style.visibility = 'hidden';        
            if (trial.poststimulus !== null) display_element.innerHTML = trial.poststimulus; //PHJ
          }, trial.stimulus_duration);
        }
      }
      // end trial if time limit is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function() {
          end_trial();
        }, trial.trial_duration);
      } else if (trial.response_ends_trial === false) {
        console.warn("The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.");
      }

      if(trial.keyboard_choices!==null) {
        keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.keyboard_choices,
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
      }
    }

    function response_wait_process(presentflag=display_response_button){     
        if(presentflag){
            if(trial.button_stimulus_mode) {
              if (trial.stimulus_type=='grid-numbers') {
                let stim;
                if(trial.stimulus==null) stim=-1; else stim=trial.stimulus[niteration];
                present_bgrid(stim); 
              }
              else present_bstimuli(trial.stimulus[niteration]);  
            }
            else  present_response_buttons();  
            display_response_button=false;
        }
        start_wait_for_response();
        ready_to_response=false;
    }


    /** RUN  **/
    function process_unused()
    {
        if (trial.render_on_canvas) {
            render_on_canvas();
        } else {
            render_on_display_element();
        }
        // start timing
        var start_time = performance.now();
        make_stimulus_buttons_listen();
        start_wait_for_response();
    }   
    
    function process(){
        display_response_button=true;
        process_started = true;
        //if(trial.stimuli_isi.length>0 && isNaN(trial.stimuli_isi[niteration])) mode_stimulus_response_question=true;

        if(trial.button_stimulus_mode){ //자극==반응 buton_stimulus, button==stimulus+response
          if (trial.stimulus_type=='grid-numbers'){ //numbers 
            if(Array.isArray(trial.stimulus)) {
              nstimuli=trial.stimulus.length;
              ready_to_response=false;
              if(trial.stimuli_isi.length==0) {
                ready_to_response=true;//임시 for CX
                present_bgrid(); //display all stimuli buttons at once.
              }
              else present_bgrid_sequence(); //in sequence
            }
            else {
              nstimuli=1;
              html=load_bgrid(trial.stimulus_nrow,trial.stimulus_ncol,trial.stimulus);
              ready_to_response=true;
            }
          } else{
            ready_to_response=true;    
            nstimuli=trial.stimulus.length;    // numeric GSgrid          
            if(nstimuli>1) { //multiple stimuli on the buttons
              ready_to_response=false;
              if(trial.stimuli_isi.length==0) present_bstimuli(); //display all stimuli buttons at once.
              else present_bstimuli_sequence(); //in sequence
            }
          }
        } else{ //자극과 반응 분리됨. 
            if(trial.stimulus_type==='html') { //html
              if(trial.guide_image!==null) guide_image_html();
              load_html_stimulus();
            } else if (trial.stimulus_type=='image'){ //image
              load_image_stimulus();
            } else if (trial.stimulus_type=='background'){ //image
              load_background_stimulus();
            } else if(trial.stimulus_type=='canvas'){ //canvas function
              load_canvas_stimulus(); canvasmode=true;
            } else if(trial.stimulus_type=='grid'){ // display grid circle
              nstimuli=1;
              html=load_bgrid(trial.stimulus_nrow,trial.stimulus_ncol,trial.stimulus);
              ready_to_response=true;
            } else if (trial.stimulus_type=='numbers'){ //numbers 
              if(Array.isArray(trial.stimulus)) nstimuli=trial.stimulus.length;
              else {
                nstimuli=1;
                ready_to_response=true;
              }
            } else if (trial.stimulus_type=='complex'){ //
              nstimuli=trial.stimulus.length;
              if(trial.stimulus_nrow==1 && trial.stimulus_ncol==1){} 
              else{
                if(nstimuli==2){ //하나의 영상에 다른 숫자 번호 제시... 
                  img=trial.stimulus[0]; //Image stimulus
                  no=parseInt(trial.stimulus[1]); // offset
                  html=load_stimulus_at_layout(img,no);
                  nstimuli=1;
                }          
              }
            }                           
            if(nstimuli>1) { //자극이 여럿인 경우   
                ready_to_response=false;                
                present_response_buttons(); // 반응 버턴 먼저 제시 
                present_stimuli_sequence(); //자극을 순차적으로 제시                
                
            } else present_single_stimulus();  
        }     
        if(ready_to_response) response_wait_process(); //response
    }
    /* definitions are done */
    /**  RUN NOW **/
    load_and_process();    

  };

  return plugin;
})();
