/**
 * jspsych-unified-no-response from html-keyboard-response and audio-html-responses(oringinally by Josh de Leeuw)
 * by Hae-Jeong Park 
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/
jsPsych.plugins["unified-no-response"] = (function() {

  var plugin = {};
  //jsPsych.pluginAPI.registerPreload('unified-no-response', 'stimulus', 'audio'); PHJ
  plugin.info = {
    name: 'unified-no-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      taskID: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Parent task object',
        default: null,
        description: 'The parent task object.'
      },
      stimulus_audio: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
        default: null,
        description: 'The audio to be played.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEY,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.NO_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
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
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      response_allowed_while_playing: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response allowed while playing',
        default: true,
        description: 'If true, then responses are allowed while the audio is playing. '+
          'If false, then the audio must finish playing before a response is accepted.'
      }
    }
  }


  plugin.trial = function(display_element, trial) {

    var new_html = '<div id="jspsych-unified-no-response-stimulus">'+trial.stimulus+'</div>';
    if(trial.stimulus_audio!==null && trial.stimulus_audio.length==0) trial.stimulus_audio=null;

    var startTime;
    var context = jsPsych.pluginAPI.audioContext();
    var audio;
    if(trial.stimulus_audio!==null){
      // load audio file
      jsPsych.pluginAPI.getAudioBuffer(trial.stimulus_audio)
        .then(function (buffer) {
          if (context !== null) {
            audio = context.createBufferSource();
            audio.buffer = buffer;
            audio.connect(context.destination);
          } else {
            audio = buffer;
            audio.currentTime = 0;
          }
          startAudioTrial();
        })
        .catch(function (err) {
          console.error(`Failed to load audio file "${trial.stimulus_audio}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
          console.error(err)
        });

        // set up end event if trial needs it
        if (trial.trial_ends_after_audio) {
          audio.addEventListener('ended', end_trial);
        }
    } //PHJ

    function startAudioTrial() {
      // start time
      startTime = performance.now();
      // start audio
      if (context !== null) {
        startTime = context.currentTime;
        audio.start(startTime);
      } else {
        audio.play();
      }
    }


    //show prompt if there is one
    if (trial.prompt !== null) {
      new_html += trial.prompt;
    }
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      if(trial.stimulus_audio!==null){
        // stop the audio file if it is playing
        // remove end event listeners if they exist
        if (context !== null) {
          audio.stop();
        } else {
          audio.pause();
        }
        audio.removeEventListener('ended', end_trial);
      }

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }
      // gather the data to store for the trial
      var trial_data = {
        rt: null,
        stimulus: null,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-unified-no-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }
      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }
    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-unified-no-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
