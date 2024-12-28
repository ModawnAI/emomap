class jsTrialtask extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='Trial';
        if(taskID===null) this.taskID='Trial'+'-'+jsPsych.randomization.randomID(5);
        this.set_blank();
    }

    set_background_option(option){
        if(option.hasOwnProperty('background_size')) {
            this.background_size=option.background_size;
            if(this.background_size=='keepratio') this.background_size="contain";      
            else if(option.background_size==='stretch') this.background_size='cover';          
        }
        if(option.hasOwnProperty('background_color')) this.background_color=options.background_color;
        if(option.hasOwnProperty('background_position')) this.background_position=options.background_position;
        if(option.hasOwnProperty('background_linear')) this.background_linear=options.background_linear;
        if(option.hasOwnProperty('background')) this.background=options.background;
    }

    set_task_trial(trial){
        if(typeof trial!=="undefined"){
            trial.taskID=this.taskID;
            this.task_trial=trial;            
            if(trial instanceof jsTrial) this.task_trial.set_task(this);
        }
        if(this.task_trial instanceof jsTrial) {
            this.task_trial.setup();        
            this.task_trial.compile();  
        }
        if(this.background_img!==null) {
            if(typeof this.task_trial.on_start!=='function'){
                this.task_trial.on_start=this.callback_on_start;
            }else {
                this.add_background_trial();
            }
        }
    }
    add_background_trial(delay=0){
        this.timeline.push({
          type: 'unified-no-response',
          taskID:this.taskID,
          ID:'background',
          stimulus: '',
          on_start: function(trial) {
            exp.set_current_task(this.taskID);
            exp.update_background();               
          },
          trial_duration: delay,
        });
    }    
    callback_on_start(trial){
        exp.set_current_task(this.taskID);
        exp.update_background();
        if(!env.use_audioguide_flag) trial.speech_text=null;
        //document.querySelector("body").style.backgroundBlendMode='soft-light'; //opacity = 0.5;        
    }
    init_variables(){}
    setup(){}
    compile(trialall=true,envmode=false) {
        if(this.task_trial) {    
            this.timeline.push(this.task_trial); 
        }
    }
    run(){ super.run();  }
}