/**
 * jspsych-unified-survey
 * Hae-Jeong Park, modified from jspsych-survey-xxx by Josh de Leeuw
*/
jsPsych.plugins['unified-survey'] = (function() {
  var plugin = {};
  plugin.info = {
    name: 'unified-survey',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          placeholder: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: "",
            description: 'Placeholder text in the textfield.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 40,
            description: 'The number of columns for the response text box.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Require a response'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          },
          options: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Options',
            array: true,
            default: null,
            description: 'Displays options for an individual question.'
          },
          codes: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Codes',
            array: true,
            default: null,
            description: 'Codes corresponding to options for an individual question.'
          },
          horizontal: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Horizontal',
            default: true,
            description: 'If true, then questions are centered and options are displayed horizontally.'
          },
          multiselect: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Multiselect',
            default: false,
            description: 'Multiple select'
          },
          labels: {
            type: jsPsych.plugins.parameterType.STRING,
            array: true,
            pretty_name: 'Labels',
            default: null,
            description: 'Labels to display for individual question.'
          },
        }
      },
      taskID: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Parent task object',
        default: null,
        description: 'The parent task object.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      },
      autocomplete: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow autocomplete',
        default: false,
        description: "Setting this to true will enable browser auto-complete or auto-fill for the form."
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
        description: 'If true, the order of the questions will be randomized'
      },
      required_message: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Required message',
        default: 'You must choose at least one response for this question',
        description: 'Message that will be displayed if required question is not answered.'
      },
      scale_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Scale width',
        default: null,
        description: 'Width of the likert scales in pixels.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-unified-survey";
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == 'undefined') {
        trial.questions[i].rows = 1;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].columns == 'undefined') {
        trial.questions[i].columns = 40;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = "";
      }
    }
 

    // generate question order
    var question_order = [];
    for(var i=0; i<trial.questions.length; i++){
        question_order.push(i);
    }
    if(trial.randomize_question_order){
        question_order = jsPsych.randomization.shuffle(question_order);
    }
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    } 


    function configure_multichoice()
    {  // inject CSS for trial
      if(trial.scale_width !== null){
        var w = trial.scale_width + 'px';
      } else {
        var w = '100%';
      }
    }
 
    function open_form(){
        // show preamble text
        if(trial.preamble !== null){
            html += '<div id="jspsych-unified-survey-preamble" class="jspsych-unified-survey-preamble" style="">'+trial.preamble+'</div>';
        }
        // start form
        if (trial.autocomplete) {
            html += '<form id="jspsych-unified-survey-form">';
        } else {
            html += '<form id="jspsych-unified-survey-form" autocomplete="off">';
        }
    }
    function add_question(question)
    {
        html += '<div id="jspsych-unified-survey-'+question.id+'" class="jspsych-unified-survey-question" >';
        html += '<p class="jspsych-unified-survey-text ">' + question.prompt;
        if(question.required){
          html += "<span class='required'>*</span>";
        };
        html +=': </p>';
        var autofocus = i == 0 ? "autofocus" : "";
        var req = question.required ? "required" : "";
        if(question.rows == 1){
            html += '<input type="text" id="input-'+question.id+'"  name="#jspsych-unified-survey-response-' + question.id + '" data-name="'+question.name+'" size="'+question.columns+'" '+autofocus+' '+req+' placeholder="'+question.placeholder+'"></input>';
        } else {
            html += '<textarea id="input-'+question.id+'" name="#jspsych-unified-survey-response-' + question.id + '" data-name="'+question.name+'" cols="' + question.columns + '" rows="' + question.rows + '" '+autofocus+' '+req+' placeholder="'+question.placeholder+'"></textarea>';
        }
        html += '</div>';
    }
    function add_multichoice(question)
    {
        // create question container
        var question_classes = ['jspsych-unified-survey-question'];
        if (question.horizontal) {
          question_classes.push('jspsych-unified-survey-horizontal');
        }

        html += '<div id="jspsych-unified-survey-'+question.id+'" class="'+question_classes.join(' ')+'"  data-name="'+question.name+'">';

        // add question text
        html += '<p class="jspsych-unified-survey-text " >' + question.prompt 
        if(question.required){
          html += "<span class='required'>*</span>";
        }
        html += ': </p>';

        // create option radio buttons
        for (var j = 0; j < question.options.length; j++) {
          // add label and question text
          var option_id_name = "jspsych-unified-survey-option-"+question.id+"-"+j;
          var input_name = 'jspsych-unified-survey-response-'+question.id;
          var input_id = 'jspsych-unified-survey-response-'+question.id+'-'+j;

          var required_attr = question.required ? 'required' : '';
          if(!question.multiselect) {
            // add radio button container
            html += '<div id="'+option_id_name+'" class="jspsych-unified-survey-option">';
            html += '<label class="jspsych-unified-survey-text" for="'+input_id+'">';
            html += '<input type="radio" name="'+input_name+'" id="'+input_id+'" value="'+question.options[j]+'" '+required_attr+'></input>';
            html += question.options[j]+'</label>';
            html += '</div>';
          } else {
            // add radio button container
            html += '<div id="'+option_id_name+'" class="jspsych-unified-survey-option">';
            html += '<label class="jspsych-unified-survey-text" for="'+input_id+'">';
            html += '<input type="checkbox" name="'+input_name+'" id="'+input_id+'" value="'+question.options[j]+'" '+required_attr+'></input>';
            html += question.options[j]+'</label>';
            html += '</div>';
          }
        }
        html += '</div>';
    }
    function add_likert(question)
    {
        // create question container
        var question_classes = ['jspsych-unified-survey-question'];
        if (question.horizontal) {
          question_classes.push('jspsych-unified-survey-horizontal');
        }
        html += '<div id="jspsych-unified-survey-'+question.id+'" class="'+question_classes.join(' ')+'"  data-name="'+question.name+'">';
        // add question text
        html += '<p class="jspsych-unified-survey-text ">' + question.prompt 
        if(question.required){
          html += "<span class='required'>*</span>";
        }
        html += ': </p></div>';
        //html += '<label class="jspsych-unified-survey-statement">' + question.prompt + '</label>';

        // add options
        var width = 100 / question.labels.length;
        var options_string = '<ul class="jspsych-unified-survey-opts" data-name="'+question.name+'" data-radio-group="Q' + question.id + '">';
        for (var j = 0; j < question.labels.length; j++) {
          options_string += '<li style="width:' + width + '%"><label class="jspsych-unified-survey-opt-label"><input type="radio" name="Q' + question.id + '" value="' + j + '"';
          if(question.required){
            options_string += ' required';
          }
          options_string += '>' + question.labels[j] + '</label></li>';
        }
        options_string += '</ul>';
        html += '<div>'+options_string+'</div>';
    }
    function check_required_inputs(){ //나중 확인.. 작동 안함.
       // validation check on the data first for custom validation handling
      // then submit the form
      display_element.querySelector('#jspsych-unified-survey-next').addEventListener('click', function(){
        for(var i=0; i<trial.questions.length; i++){
          if(trial.questions[i].required){
            if(display_element.querySelector('#jspsych-unified-survey-'+i+' input:checked') == null){
              display_element.querySelector('#jspsych-unified-survey-'+i+' input').setCustomValidity(trial.required_message);
            } else {
              display_element.querySelector('#jspsych-unified-survey-'+i+' input').setCustomValidity('');
            }
          }
        }
        display_element.reportValidity();
      })      
    }

    function close_form(){
        // add submit button
        html += '<input type="submit" id="jspsych-unified-survey-next" class="jspsych-btn jspsych-unified-survey" value="'+trial.button_label+'"></input>';
        html += '</form>'
    }

    var html = '';
    configure_multichoice();
    open_form();
    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
        var question = trial.questions[question_order[i]];
        var question_index = question_order[i];
        question.id=question_index;
        if(question.options!==null) add_multichoice(question); 
        else if(question.labels!==null) add_likert(question);
        else add_question(question);
    }
    close_form();
    //check_required_inputs();
    
    display_element.innerHTML = html;

    // backup in case autofocus doesn't work
    display_element.querySelector('#input-'+question_order[0]).focus();

    display_element.querySelector('#jspsych-unified-survey-form').addEventListener('submit', function(e) {
      e.preventDefault();
      // measure response time
      var endTime = performance.now();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {}; let likert=false;
      for(var index=0; index < trial.questions.length; index++){
        if(trial.questions[index].options!==null){ //multichoice
          if(!trial.multiselect) {
            var match = display_element.querySelector('#jspsych-unified-survey-'+index);
            var id = "Q" + index;
            if(match.querySelector("input[type=radio]:checked") !== null){
              var val = match.querySelector("input[type=radio]:checked").value;
              if(trial.questions[index].codes!==null && (trial.questions[index].options.length===trial.questions[index].codes.length)) {
                id=trial.questions[index].options.indexOf(val);
                val=trial.questions[index].codes[id];
              } 
            } else {
              var val = "";
            }
            var obje = {};
            var name = id;
            if(match.attributes['data-name'].value !== ''){
              name = match.attributes['data-name'].value;
            }
            obje[name] = val;
            Object.assign(question_data, obje);
          } else { //multiselect
            var match = display_element.querySelector('#jspsych-unified-survey-'+index);
            var val = [];
            var inputboxes = match.querySelectorAll("input[type=checkbox]:checked")
            for(var j=0; j<inputboxes.length; j++){
              currentChecked = inputboxes[j];
              val.push(currentChecked.value)
            }
            var id = 'Q' + index
            var obje = {};
            var name = id;
            if(match.attributes['data-name'].value !== ''){
              name = match.attributes['data-name'].value;
            }
            obje[name] = val;
            Object.assign(question_data, obje);
            if(val.length == 0){ has_response.push(false); } else { has_response.push(true); }
          }
        } else if (trial.questions[index].labels!==null){//likert
          likert=true;
        } else { // text input
          var id = "Q" + index;
          var q_element = document.querySelector('#jspsych-unified-survey-'+index).querySelector('textarea, input'); 
          var val = q_element.value;
          var name = q_element.attributes['data-name'].value;
          if(name == '') name = id;
      
          var obje = {};
          obje[name] = val;
          Object.assign(question_data, obje);      
        }
      }

      if(likert){
        var matches = display_element.querySelectorAll('#jspsych-unified-survey-form .jspsych-unified-survey-opts');
        for(var index = 0; index < matches.length; index++){
          var id = matches[index].dataset['radioGroup'];
          var el = display_element.querySelector('input[name="' + id + '"]:checked');
          if (el === null) {
            var response = "";
          } else {
            var response = parseInt(el.value);
          }
          var obje = {};
          if(matches[index].attributes['data-name'].value !== ''){
            var name = matches[index].attributes['data-name'].value;
          } else {
            var name = id;
          }
          obje[name] = response;
          Object.assign(question_data, obje);
        }
      }
      
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data),
        "question_order": JSON.stringify(question_order)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = performance.now();
  };

  return plugin;
})();
