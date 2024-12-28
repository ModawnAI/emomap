class jsSurvey extends jsTrialtask {
    constructor (name,localpath='./',taskID=null){
      super(name,localpath,taskID);
      this.type='Survey';
      if(taskID===null) this.taskID='Survey'+'-'+jsPsych.randomization.randomID(5);
      this.nickname='설문';
      this.questions=null;
      this.randomize=false;
      this.preamble=null;
      this.background_color="#BDDC88";
      this.background_img=null;
      this.consent_flag=false;
      this.db=null;
      this.post_callback=null;
    }

    example(){
      console.log(`questions= [
        {prompt: 'How old are you?', columns: 3, required: true, name: 'Age'},
        {prompt: 'Where were you born?', placeholder: 'City, State/Province, Country', columns: 50, name: 'BirthLocation'}
      ];`);
      console.log(`
      var page_1_options = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
      var page_2_options = ["Strongly Disagree", "Disagree", "Somewhat Disagree", "Neural", "Somewhat Agree", "Agree", "Strongly Agree"];
      multichoice_questions=[
        {prompt: "I like vegetables", name: 'Vegetables', options: page_1_options, required:true}, 
        {prompt: "I like fruit", name: 'Fruit', options: page_2_options, required: false}
      ];`);
      console.log(`const survey=new jsSurvey();survey.questions=questions;survey.multi_choices=multichoice_questions;`);
    }
    

    set_default_trials(){ 
        if(this.taskID.length==0) this.taskID=this.name+'-'+jsPsych.randomization.randomID(5);
    }
    callback(responses){
      for (const [key, value] of Object.entries(responses)) {
        console.log(`${key}: ${value}`);
        if(value.length>0) {          
          if(key==='nickname' && value.charAt(value.length-1)!=='님') exp[key]=value+"님";
          else exp[key]=value;//
        }
      }
    }
    
    set_trial(){
      if(this.questions!==null){
        this.ask_questions_trial ={
          type: 'unified-survey',
          taskID:this.taskID,
          questions: this.questions,
          button_label: "제출",//uxm.button_next,
          preamble:this.preamble,
          randomize_question_order:this.randomize,
          on_start: function(trial){
            blankWebrainBars();
            exp.get_DOM_contents_container().style='flex-direction: column';
            exp.set_current_task(trial.taskID); //this.. 
            var ctask=exp.getTask(trial.taskID);

            if(ctask.background_color!==null && ctask.background_img===null) exp.fill_background(ctask.background_color);
            if(ctask.background_img!==null) exp.update_background();
          },
          on_finish: function(data) {
            var responses = JSON.parse(data.responses);
            var ctask=exp.getTask(this.taskID);
            if(typeof ctask.callback==='function') {
              ctask.callback(responses);
            }
            if(typeof ctask.post_callback==='function') {
              ctask.post_callback(ctask,responses);
            }
            jsPsych.data.addProperties(responses);

            if(exp.Age<20) {
              //add time line for the consent...
            }

          }  
        }
      }
    }

    init_variables(){}
    setup(){
      this.db=new jsDatabase();
      this.db.set_task(this); 
    }

    compile(trialall=true,envmode=false) { 
      this.set_trial();
      if(this.questions!==null) this.timeline.push(this.ask_questions_trial);
    }
}