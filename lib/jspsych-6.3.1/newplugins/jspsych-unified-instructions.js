/* webrain-unified-instructions.js
 * PHJ by inserting audio information to 
 * webrain-unified-instructions.js
 * Josh de Leeuw
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * Page numbers can be displayed to help with navigation by setting show_page_number
 * to true.
 *
 * documentation: docs.jspsych.org
 */

jsPsych.plugins["unified-instructions"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'unified-instructions',
    description: '',
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Pages',
        default: undefined,
        array: true,
        description: 'Each element of the array is the content for a single page.'
      },
      speech_mode: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow speech',
        default: true,
        description: 'If true, subject can hear speech instructions.'
      },
      guide_image: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Guide image to split',
        default: 'guide.gif',
        description: 'If exist, position it on the left panel.'
      },
      key_forward: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Key forward',
        default: 'ArrowRight',
        description: 'The key the subject can press in order to advance to the next page.'
      },
      key_backward: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Key backward',
        default: 'ArrowLeft',
        description: 'The key that the subject can press to return to the previous page.'
      },
      allow_backward: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow backward',
        default: true,
        description: 'If true, the subject can return to the previous page of the instructions.'
      },
      allow_keys: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow keys',
        default: true,
        description: 'If true, the subject can use keyboard keys to navigate the pages.'
      },
      show_clickable_nav: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show clickable nav',
        default: false,
        description: 'If true, then a "Previous" and "Next" button will be displayed beneath the instructions.'
      },
      show_page_number: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Show page number',
          default: false,
          description: 'If true, and clickable navigation is enabled, then Page x/y will be shown between the nav buttons.'
      },
      page_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Page label',
        default: 'Page',
        description: 'The text that appears before x/y (current/total) pages displayed with show_page_number'
      },      
      button_label_previous: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label previous',
        default: 'Previous',
        description: 'The text that appears on the button to go backwards.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label next',
        default: 'Next',
        description: 'The text that appears on the button to go forwards.'
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
      taskID: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Parent task object',
        default: null,
        description: 'The parent task object.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var current_page = 0;
    var currentAudio = null; // Declare global audio reference.
    var view_history = [];

    var start_time = performance.now();

    var last_page_update_time = start_time;


    let gamemode=true;
    if(gamemode) response_element=document.getElementById("webrain-response-container"); //PHJ
    if(response_element===null) { gamemode=false;     response_element=display_element; }

    if(!Array.isArray(trial.pages)) trial.pages=[trial.pages];

    var voices = [];var lang= "ko-KR";
    function set_voice()
    {
        //const lang = navigator.language
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

    

    function speech_cancel() {
      var synth = window.speechSynthesis;
      if (synth.speaking || synth.pending) {
        synth.cancel(); // Stop ongoing speech synthesis.
      }
    }

// --- IndexedDB Helper Functions ---
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('audioDB', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('audios')) {
        db.createObjectStore('audios');
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject('Error initializing IndexedDB');
  });
}

async function storeAudioBlob(key, blob) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audios', 'readwrite');
    tx.objectStore('audios').put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject('Error storing audio in IndexedDB');
  });
}

async function getAudioBlob(key) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audios', 'readonly');
    const request = tx.objectStore('audios').get(key);
    request.onsuccess = (e) => {
      const blob = e.target.result;
      if (blob) {
        resolve(blob);
      } else {
        reject('Audio not found in IndexedDB');
      }
    };
    request.onerror = () => reject('Error retrieving audio from IndexedDB');
  });
}

// --- Modified speak function ---
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

  // Use a unique key for the text
  const cacheKey = 'audio-' + encodeURIComponent(text);

  // Check if audio already exists in IndexedDB
  let isCached = true;
  let blob;
  try {
    blob = await getAudioBlob(cacheKey);
    console.log("Audio found in IndexedDB, playing from local cache...");
  } catch (e) {
    isCached = false;
    console.log("Audio not found locally, will fetch from Cartesia...");
  }

  if (isCached) {
    // Play from cached blob
    currentAudio = new Audio(URL.createObjectURL(blob));
    currentAudio.play();
    currentAudio.addEventListener("ended", () => {
      console.log("Playback finished.");
    });
    return;
  }

  // If not cached, fetch from the API and stream
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

    // Progressive playback setup
    const mediaSource = new MediaSource();
    currentAudio = new Audio();
    currentAudio.src = URL.createObjectURL(mediaSource);

    let firstChunkAppended = false;
    let sourceBuffer;

    // We'll store all chunks in memory for eventual caching
    const allChunks = [];

    mediaSource.addEventListener("sourceopen", async () => {
      sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      const reader = response.body.getReader();
      const appendQueue = [];

      const appendChunk = async (chunk) => {
        return new Promise((resolve, reject) => {
          const onUpdateEnd = () => {
            sourceBuffer.removeEventListener("updateend", onUpdateEnd);
            resolve();
          };
          sourceBuffer.addEventListener("updateend", onUpdateEnd);
          try {
            sourceBuffer.appendBuffer(chunk);
          } catch (error) {
            reject(error);
          }
        });
      };

      console.log("Appending audio chunks...");
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
          // Push chunk into array for caching later
          allChunks.push(value);

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

      // Once done reading, create a blob from allChunks and store in IndexedDB
      const audioBlob = new Blob(allChunks, { type: 'audio/mpeg' });
      await storeAudioBlob(cacheKey, audioBlob);
      console.log("Audio cached in IndexedDB for future use.");
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

    function html2text(html) {
      //replace <img with alt text
      var container = $('<div>').html(html);
      container.find('img').replaceWith(function() { return this.alt; })
      var strAlt = container.html();
      console.log('output: '+strAlt);
      var text=jQuery(strAlt).text();
      return text;
    }  

    function btnListener(evt){
    	evt.target.removeEventListener('click', btnListener);
    	if(this.id === "webrain-unified-instructions-back"){
    		back();
    	}
    	else if(this.id === 'webrain-unified-instructions-next'){
    		next();
    	}
    }

    function preproc_page(html){  
      if(html===null) return '';
      if(html.slice(0,2)!=="<p>" && html.slice(0,4)!=="<div>"){ //If picture based instruction in figure
        if(html.match(/[^/]+(jpg|png|gif)$/)) { 
          var html = '<img src="'+html+'" id="jspsych-image-button-response-stimulus" style="';
          if(trial.stimulus_height !== null){
            html += 'height:'+trial.stimulus_height+'px; '
            if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
              html += 'width: auto; ';
            }
          }
          if(trial.stimulus_width !== null){
            html += 'width:'+trial.stimulus_width+'px; '
            if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
              html += 'height: auto; ';
            }
          }
          html +='">';      
        }
      }
      if(html.includes(trial.guide_image)) // guide image
      {
        let sources = html.match(/<img [^>]*src="[^"]*"[^>]*>/gm); //image tag        
        if(typeof sources!=='undefined')
        {
          html=html.replace(sources[0],"");
          if(typeof html.replaceAll==='undefined') html=html.replace("<p></p>","");
          else html=html.replaceAll("<p></p>","");

          let img= sources.map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0]; //extract image
          html=`<div class="webrain-instruction-container">
          <div id="webrain-instruction-guide"><img class="webrain-guide-img" src="${img}" ></div>
          <div id="webrain-instruction-info">${html}</div></div>`;
          if(typeof html.replaceAll==='undefined') html=html.replace("\n","");
          else html=html.replaceAll("\n","");
        }        
      }
      return html;
    }

    function show_current_page() {
      // Stop any ongoing speech or external audio.
      speech_cancel();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio = null;
      }

      var html = trial.pages[current_page];
      if(Array.isArray(html)) html=html[0]; //TOCHECK
      html=preproc_page(html);
      var pagenum_display = "";
      if(trial.show_page_number) {
          pagenum_display = "<span style='margin: 0 1em;' class='"+
          "webrain-unified-instructions-pagenum'>"+ trial.page_label + ' ' +(current_page+1)+"/"+trial.pages.length+"</span>";
      }
     
      if (trial.show_clickable_nav) {
        let nav_html= ''; let html1='';
        if(!gamemode) nav_html= "<div class='webrain-response-container' style='padding: 10px 0px;'>";

        if (trial.allow_backward) {
          let allowed = (current_page > 0 )? '' : "disabled='disabled'";
          if(trial.button_label_previous.includes("<button")){
            html1=trial.button_label_previous;
            if(!html1.includes("webrain-unified-instructions-back")) html1=html1.replace("<button","<button id='webrain-unified-instructions-back' "+allowed);   
            html1= `<div class="webrain-button-box">${html1}</div>`;    
          }else{            
            html1= "<button id='webrain-unified-instructions-back' class='webrain-btn response-btn2' style='margin-right: 5px;' "+allowed+">&lt; "+trial.button_label_previous+"</button>";
          }
          nav_html += html1;
        }
        if (trial.pages.length > 1 && trial.show_page_number) {
            nav_html += pagenum_display;
        }

        if(trial.button_label_next.includes("<button")){ 
          html1=trial.button_label_next;
          if(!html1.includes("webrain-unified-instructions-next")) html1=html1.replace("<button","<button id='webrain-unified-instructions-next' ");   
          html1 = `<div class="webrain-button-box">${html1}</div>`;         
        }
        else{
          html1= "<button id='webrain-unified-instructions-next' class='webrain-btn response-btn2'"+
            "style='margin-left: 5px;'>"+trial.button_label_next+
            " &gt;</button></div>";
        }

        if(gamemode)  { 
          nav_html += html1;
          display_element.innerHTML = html;
          response_element.innerHTML = nav_html;
        }
        else {
          nav_html += html1+"</div>";
          html += nav_html;
          display_element.innerHTML = html;
        }

        if(trial.speech_mode) { //replace <img with alt text
          var container = $('<div>').html(trial.pages[current_page]);
          container.find('img').replaceWith(function() { return this.alt; })
          var strAlt = container.html();
          console.log('output: '+strAlt);
          var text=jQuery(strAlt).text();
          speak(text);          
        }

        if (current_page != 0 && trial.allow_backward) {
          response_element.querySelector('#webrain-unified-instructions-back').addEventListener('click', btnListener);
        }
        response_element.querySelector('#webrain-unified-instructions-next').addEventListener('click', btnListener);
      } else {
        if (trial.show_page_number && trial.pages.length > 1) {
          // page numbers for non-mouse navigation
          html += "<div class='webrain-unified-instructions-pagenum'>"+pagenum_display+"</div>"
        } 
        display_element.innerHTML = html;
      }
      
    }

    function next() {
      // Stop any ongoing speech or external audio.
      speech_cancel();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio = null;
      }
    
      add_current_page_to_view_history();
      current_page++;
    
      if (current_page >= trial.pages.length) {
        endTrial();
      } else {
        show_current_page();
      }
    }

    function back() {
      // Stop any ongoing speech or external audio.
      speech_cancel();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio = null;
      }
    
      add_current_page_to_view_history();
      current_page--;
    
      show_current_page();
    }

    function add_current_page_to_view_history() {

      var current_time = performance.now();
      var page_view_time = current_time - last_page_update_time;
      view_history.push({
        page_index: current_page,
        viewing_time: page_view_time
      });

      last_page_update_time = current_time;
    }

    function endTrial() {
      // Stop any ongoing speech or external audio.
      speech_cancel();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio = null;
      }
    
      if (trial.allow_keys) {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
      }
    
      display_element.innerHTML = '';
    
      var trial_data = {
        view_history: view_history,
        rt: performance.now() - start_time
      };
    
      jsPsych.finishTrial(trial_data);
    }

    var after_response = function(info) {
      speech_cancel();
      // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long
      keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
      // check if key is forwards or backwards and update page
      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
        if (current_page !== 0 && trial.allow_backward) {
          back();
        }
      }

      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        next();
      }

    };

    show_current_page();

    if (trial.allow_keys) {
      var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance',
        persist: false
      });
    }
  };

  return plugin;
})();
