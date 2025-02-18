class jsBasictask extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='Basic';
    }
    set_welcome_trial(welcome){
        if(welcome===undefined){ //no argument
            var welcome = {
                type: "html-keyboard-response",
                stimulus: `Welcome to the experiment ${this.name}. Press any key to begin.`
            };    
            this.welcome_trial = welcome;
        } else this.welcome_trial = welcome;
    }
    set_instruction_trial(instructions){
        if(instructions===undefined){
            var instructions = {
            type: "html-keyboard-response",
            stimulus: `<p>In this experiment ${this.name}, a circle will appear in the center ` +
                "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
                "press the letter F on the keyboard as fast as you can.</p>" +
                "<p>If the circle is <strong>orange</strong>, press the letter J " +
                "as fast as you can.</p>" +
                "<div style='width: 700px;'>"+
                "<div style='float: left;'><img src='img/blue.png'></img>" +
                "<p class='small'><strong>Press the F key</strong></p></div>" +
                "<div class='float: right;'><img src='img/orange.png'></img>" +
                "<p class='small'><strong>Press the J key</strong></p></div>" +
                "</div>"+
                "<p>Press any key to begin.</p>",
            post_trial_gap: 2000
            };
        }
        this.instruction_trial=instructions;
    }
    set_debrief_trial(debrief){
        if(debrief===undefined){
            var debrief = {
                type: "html-keyboard-response",
                stimulus: function() {

                    var trials = jsPsych.data.get().filter({test_part: 'test'});
                    var correct_trials = trials.filter({correct: true});
                    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
                    var rt = Math.round(correct_trials.select('rt').mean());

                    return "<p>You responded correctly on "+accuracy+"% of the trials.</p>"+
                    "<p>Your average response time was "+rt+"ms.</p>"+
                    "<p>Press any key to complete the experiment. Thank you!</p>";

                }
            };
        }
        this.debrief_trial=debrief;
    }

    set_epilog_trials(epilog){
        if(epilog===undefined) var epilog=this.epilog_trials;
        this.epilog_trials = epilog;
    }
    set_test_session(test_session){
        if (test_session===undefined){
            var test_stimuli = [
                { stimulus: "img/blue.png", data: { test_part: 'test', correct_response: 'f' } },
                { stimulus: "img/orange.png", data: { test_part: 'test', correct_response: 'j' } }
                ];

            var fixation = {
                type: 'html-keyboard-response',
                stimulus: '<div style="font-size:60px;">+</div>',
                choices: jsPsych.NO_KEYS,
                trial_duration: function(){
                    return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
                },
                data: {test_part: 'fixation'}
                }

            var test = {
                type: "image-keyboard-response",
                stimulus: jsPsych.timelineVariable('stimulus'),
                choices: ['f', 'j'],
                data: jsPsych.timelineVariable('data'),
                on_finish: function(data){
                    data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
                },
                }

            var test_session = {
                timeline: [fixation, test],
                timeline_variables: test_stimuli,
                repetitions: 2,
                randomize_order: true
                }
        }
        this.test_session=test_session;
    }
    compile() { 
        this.add_welcome_trial();
        this.add_instruction_trial();
        this.add_test_session();
        this.add_debrief_trial();
    }
    run()
    {
        super.run();
        console.log(`${this.name} run was called...`)
    }
}