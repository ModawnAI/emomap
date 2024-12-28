class jsEnv {
    constructor () {
        this.touch_mode=true;
        this.use_webaudio_flag=true;
        this.use_audioguide_flag=true;
        this.touch_status='touch';
        this.current_trial=null;        
        this.playground_ready=false;
        this.zoom_event=[];
        this.online=false;
        this.interaction=null;
        this.focus='focus';
        this.rootpath='../../';
        this.timeline_fullscreen_flag=false;
        this.audio_context=null;
        this.debug_display_border=false;

        this.init();

    }    
    check_device()
    {
        let is_touch_device = "ontouchstart" in document.documentElement;
        this.touch_mode = is_touch_device; //isMobileDevice();
        this.use_webaudio_flag = this.touch_mode;
        if(!this.timeline_fullscreen_flag && this.touch_mode) this.timeline_fullscreen_flag=true;
        //this.touch_mode = true;
        this.touch_status = is_touch_device ? "touch" : "no-touch";
        console.log('touchmode:'+this.touch_mode+" online:"+this.online+" webaudio:"+this.use_webaudio_flag)
    }
    static touchmode() { 
        return this.touch_mode;
    }
    init(){
        if (document.location.host) this.online = true;
        else this.online = false;
        this.check_device();
    }
}

////// INIT GLOBAL PARAMETERS ////////////////
const env=new jsEnv();
var sequence_ext;
// back1 //pc// back2 //태블릿// back3 //모바일
window.onload = function () {
    if(typeof exp!=="undefined") exp.update_background();
    //env.audio_context = new AudioContext();
};

/*
// One-liner to resume playback when user interacted with the page.
document.querySelector('button').addEventListener('click', function() {
    env.audio_context.resume().then(() => {
      console.log('Playback resumed successfully');
    });
});
*/

function window_info() {

    const window_width = document.documentElement.clientWidth;
    const  window_height = document.documentElement.clientHeight;
    const  page_width = document.documentElement.scrollWidth;
    const page_height = document.documentElement.scrollHeight;
    const center_x = window.innerWidth / 2 + "px";
    const center_y = window.innerHeight / 2 + "px";
    const ratio = window.devicePixelRatio || 1;  
    const width_height = "wh:" + screen.width + "x" + screen.height;
    const client_width_height = " cwh:" +  document.documentElement.clientWidth +"x" + document.documentElement.clientHeight;
    const rw = screen.width * ratio;
    const rh = screen.height * ratio;
    const ratio_width_height = " r:" + ratio + "</br> rwh:" + rw + "x" + rh;
    let is_touch_device = "ontouchstart" in document.documentElement;
    let touch_status = is_touch_device ? "touch" : "no-touch";
    const env_data_string =  width_height + client_width_height + ratio_width_height + touch_status;
    const env_data_string2 =" pw:" + page_width +" ph:" + page_height + " cx:" + center_x + " cy:" +center_y;

    return `<div><p> 현재 사용하시는 스크린 환경입니다. </br>" ${env_data_string}</br>${env_data_string2} </p></div>`;
}
window.addEventListener("resize",window_info);
  
  // <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
window.onresize = function () {
    console.log(window.devicePixelRatio);
    console.log("window width:"+window.innerWidth+" height:"+window.innerHeight);
    env.zoom_event.push({
      timestamp: performance.now(),
      zoom_ratio: window.devicePixelRatio,
    });

    if(typeof exp !== "undefined") {
        exp.onResize();
    }
}

function audio_iphone_check(){
        // Small game audio library I made
    var audioContext = new (window.AudioContext || window.webkitAudioContext)()
    function loadSound(filename) {
        var sound = {volume: 1, audioBuffer: null}
        
        var ajax = new XMLHttpRequest()
        ajax.open("GET", filename, true)
        ajax.responseType = "arraybuffer"
        ajax.onload = function()
        {
            audioContext.decodeAudioData
            (
                ajax.response,
                function(buffer) {
                    sound.audioBuffer = buffer
                },
                function(error) {
                   // debugger
                }
            )
        }        
        ajax.onerror = function() {
            console.log('!Failure in audio check')
            //debugger;
        }        
        try {ajax.send();return sound}
        catch(error) {return null;}        
        
    }
    function playSound(sound) {
        if(!sound.audioBuffer)
        return false
        
        var source = audioContext.createBufferSource()
        if(!source)
        return false
        
        source.buffer = sound.audioBuffer
        if(!source.start)
        source.start = source.noteOn
        
        if(!source.start)
        return false
    
        var gainNode = audioContext.createGain()
        gainNode.gain.value = sound.volume
        source.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        source.start(0)
        
        sound.gainNode = gainNode
        return true
    }
    function stopSound(sound) {
        if(sound.gainNode) sound.gainNode.gain.value = 0
    }
    function setSoundVolume(sound, volume) {
        sound.volume = volume    
        if(sound.gainNode)   sound.gainNode.gain.value = volume
    }
    // How to use:
    var mySound = loadSound("myFile.wav")
    // Then later after audio is unlocked and the sound is loaded:
    playSound(mySound)
    // How to unlock all sounds:
    var emptySound = loadSound("http://touchbasicapp.com/nothing.wav")
    document.body.addEventListener('touchstart', function(){playSound(emptySound)}, false)
};
audio_iphone_check();
let hasEnabledVoice = false;
document.addEventListener('click', () => {
  if (hasEnabledVoice) {
    return;
  }
  const lecture = new SpeechSynthesisUtterance('hello');
  lecture.volume = 0;
  speechSynthesis.speak(lecture);
  hasEnabledVoice = true;
});

function cleanDisplayElement(){
    var display_element=jsPsych.getDisplayElement();
    // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
    if (display_element.hasChildNodes()) {
        // can't loop through child list because the list will be modified by .removeChild()
        while (display_element.firstChild) {
          display_element.removeChild(display_element.firstChild);
        }
      }
}
function blankWebrainBars()
{
    var status = document.getElementById("webrain-statusbar-container");//equals document.getElementsByClassName('webrain-statusbar-container')[0]
    if(status !==null) status.remove();

    var top = document.getElementById("webrain-top-message-container");
    if(top!==null) top.parentNode.removeChild(top);

    var resp = document.getElementById("webrain-response-container");
    if(resp!==null) resp.parentNode.removeChild(resp);
    
    var bottom = document.getElementById("webrain-bottom-message-container"); //div#webrain-bottom-message-container
    if(bottom!==null) bottom.parentNode.removeChild(bottom);
}
function instructionWebrainBars()
{
    var status = document.getElementById("webrain-statusbar-score");
    if(status===null) drawWebrainBars();
    var status = document.getElementById("webrain-statusbar-container");//equals document.getElementsByClassName('webrain-statusbar-container')[0]
    //if(status !==null) status.style.height="10vh";

    //var top = document.getElementById("webrain-top-message-container");
    //if(top!==null) top.parentNode.removeChild(top);

    //var resp = document.getElementById("webrain-response-container");
    //if(resp!==null) resp.parentNode.removeChild(resp);
    
    //var bottom = document.getElementById("webrain-bottom-message-container"); //div#webrain-bottom-message-container
    //if(bottom!==null) bottom.parentNode.removeChild(bottom);

    //document.getElementsByClassName('webrain-statusbar-container')[0]
    //env.playground_ready=false;    

    if(env.debug_display_border) debug_border_displayed_objects();
}

function drawWebrainBars(message_bar_flag=true) {
    var jstate=document.querySelector(".jspsych-display-element");
    var status = document.getElementById("webrain-statusbar-score");
    if(jstate===null || jstate===undefined) return;
    if(status===undefined || status ===null){
        status =
        `<div id="webrain-statusbar-container">
        <div id="webrain-statusbar-status"><p class="font-score"></p></div>
        <div id="webrain-statusbar-score"><p class="font-score"></p></div>
        <div id="webrain-statusbar-info"><p class="font-score"></p></div>
        </div>`;
        if(message_bar_flag) {
            status+= '<div id="webrain-top-message-container"></div>';
        }
        document.querySelector(".jspsych-display-element").insertAdjacentHTML("afterbegin", status);

        var obj=document.querySelector('#webrain-statusbar-container');
        //if(obj!==undefined) obj.style.marginBottom='0px';

        if(message_bar_flag){
            var obj1=document.querySelector("#webrain-top-message-container");
            //if(obj1!==undefined) obj1.style.marginTop='-20px';
            var obj3=document.querySelector("#webrain-statusbar-status");
            //(obj3!==undefined) obj3.style.marginBottom='0px';
        }
    }

    var resp = document.getElementById("webrain-response-container");
    if(resp===undefined || resp===null){
        resp = '<div id="webrain-response-container"></div>';   
        if(message_bar_flag) resp += '<div id="webrain-bottom-message-container"></div>';  
             
        document.querySelector(".jspsych-display-element").insertAdjacentHTML("beforeend", resp);      
        if(message_bar_flag){
            var obj2=document.querySelector("#webrain-bottom-message-container");
            //if(obj2!==undefined) obj2.style.marginTop='0px';
        }
    }
    env.playground_ready=true;
    if(env.debug_display_border) debug_border_displayed_objects();
}
function add_response_container(message_bar_flag=true)
{
    var resp = document.getElementById("webrain-response-container");
    if(resp===undefined || resp===null){
        resp = '<div id="webrain-response-container"></div>';   
        if(message_bar_flag) resp += '<div id="webrain-bottom-message-container"></div>';  
             
        document.querySelector(".jspsych-display-element").insertAdjacentHTML("beforeend", resp);      
    }
}
function assign_style_border(obj,flag=true,color="black"){
    if(obj===undefined || obj===null) return;
    if(flag) {
        obj.style.border="1px solid "+color;   
    }
    else obj.style.border="none";
}
function debug_border_displayed_objects(flag=true) {
    assign_style_border(document.querySelector(".jspsych-display-element"),flag,'green');
    assign_style_border(document.getElementById("webrain-statusbar-container"),flag,'red');
    assign_style_border(document.getElementById("webrain-statusbar-score"),flag);
    assign_style_border(document.getElementById("webrain-statusbar-info"),flag);
    assign_style_border(document.getElementById("webrain-statusbar-status"),flag);
    assign_style_border(document.getElementById("webrain-response-container"),flag,'brown');
    assign_style_border(document.querySelector('div.jspsych-content'),flag,'blue');
    assign_style_border(document.getElementById("webrain-top-message-container"),flag,'magenta');
    assign_style_border(document.getElementById("webrain-bottom-message-container"),flag,'cyan');
    assign_style_border(document.getElementById("webrain-instruction-info"),flag,'cyan');
    assign_style_border(document.querySelector(".instruction-welcome"),flag,'green');
};






