class jsWCSort extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='wcsort';
        if(taskID===null) this.taskID='wcsort'+'-'+jsPsych.randomization.randomID(5);
        this.nickname='규칙찾기';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=20;
        this.sequence_length=1500; //max_iteration x 15
    }

    create_task_trial() {
        this.task_trial=new jsWCSortTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    score_display (count=this.trial_count, score=this.score,phase=this.phasemode) {
        if(!env.playground_ready) return;
        let scorevar=`<p class="font-score">시행:${count+1}<font color='red'> 점수: ${score} </p></font>`;//규칙:${this.task_trial.current_iteration+1}
        document.querySelector("#webrain-statusbar-score").innerHTML = scorevar;
        //calcTextSize('webrain-statusbar-score');
    };

    evaluate_performance(targetcode,nontargetcode)
    {
        let trial_sequence = jsPsych.data.get().filter({phase: 'test'}).last(this.sequence_length);
        let result={};

        result.total_count=trial_sequence.count();
        if(result.total_count>0){
            result.total_rt_mean = trial_sequence.select('rt').mean();
            result.total_rt_sd = trial_sequence.select('rt').sd();
            result.total_score = trial_sequence.select('score').sum();
        } else {
            result.total_rt_mean=null;
            result.total_rt_sd=null;
            result.total_score=null;
        }
        result.total_unresponded_count=trial_sequence.filter({button_pressed:undefined,}).count();
        result.result=[];
        const nit=this.task_trial.rule_response_count.length;
        for(let i=0;i<nit;i++) {
            result.result=result.result+this.task_trial.rule_response_count[i];
            if(i<nit-1) result.result = result.result + ',';
        }
        let cdata=trial_sequence.filter({correct:true,});
        result.target_correct_count = cdata.count();
        if(result.target_correct_count>0){
            result.target_correct_rt_mean = cdata.select('rt').mean();
            result.target_correct_rt_sd = cdata.select('rt').sd();
        } else {
            result.target_correct_rt_mean=null;
            result.target_correct_rt_sd=null;
        }
        cdata=trial_sequence.filter({correct:false,});
        result.target_incorrect_count = cdata.count();
        if(result.target_incorrect_count>0){
            result.target_incorrect_rt_mean = cdata.select('rt').mean();
            result.target_incorrect_rt_sd = cdata.select('rt').sd();
        } else {
            result.target_incorrect_rt_mean=null;
            result.target_incorrect_rt_sd=null;
        }

        this.performance=result;
    }

    callback_get_debrief(){
        this.evaluate_performance(exp.TARGET,exp.NONTARGET);
        var ntot = jsPsych.data.get().filter({stim_type:exp.TARGET}).count();
        var score1 = jsPsych.data.get().select('score').sum();
        let score=Math.round(score1/ntot*100)
        this.score=score;
        return "%GUIDE%"+"잘하셨습니다!<br>"+
        "총 " + ntot + "회로 마쳤습니다.<br>"+
        "당신의 점수는 "+ score+"점 입니다.<br>"+
        "다시 하시겠습니까?";
    }
}

class jsWCSortTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='wcsort-v10';
        this.stimulus_type='image'; //image, numbers, html
        this.stimulus_duration=1000;
        this.trial_duration=2000; //total duration
        this.post_trial_gap=0;
        this.response_ends_trial=false;
        this.poststimulus='fixation';
        this.button_stimulus_mode=false;
        this.wait_duration_after_multiresponses=1000;
        this.fixation_size=50;
        this.stimulus_height=300;
        this.noresponse_warning=false;
        this.rule_response_count=[];
        this.feedback_audios=[uxm.sound_feedback_correct,uxm.sound_feedback_incorrect];
        this.sequence_random_online=true;
        this.set_default()
    }
    set_default(){
        this.max_iteration=10;
        this.max_responses_to_change=4; //rule updating criteria
        this.max_ruleblock_length=15; //how many trials can be allowed per rule
        this.count_block_trial=0;
        this.stimuli_set=[];     this.sequence=[];
        this.mode=true;
        if (this.mode){
            this.colors=['red','yellow','green','blue'];
            this.shapes=['fish','turtle','horse','crab'];
        } else{
            this.colors=['brown','green','pink','purple'];
            this.shapes=['heart','square','cross','circle'];
        }
        this.numbers=[1,2,3,4];
        this.rulenames=['shapes','numbers','colors'];

    }
    init(){ //task specific initialization
        super.init()
        var img;
        for (var i=0;i<this.shapes.length;i++)
            for(var j=0;j<this.numbers.length;j++)
                for(var k=0;k<this.colors.length;k++){
                    img=this.ctask.localpath+'img/'+this.shapes[i]+this.numbers[j]+this.colors[k]+'.png';
                    this.ctask.preload_images.push(img);
                    this.stimuli_set.push(img);
                }
        // essential for multi label buttons
        this.response_choices=[];
        for(let i=0;i<4;i++) this.response_choices.push(this.get_sample_image(i,i,i));
    }
    get_sample_image(){
        var img;
        switch(arguments.length){
            case 0:
                img=this.ctask.localpath+'img/'+rand(this.shapes)+rand(this.numbers)+rand(this.colors)+'.png';
                break;
            case 3:
                img=this.ctask.localpath+'img/'+this.shapes[arguments[0]]+this.numbers[arguments[1]]+this.colors[arguments[2]]+'.png';
                break;
            case 1:
                img=this.ctask.localpath+'img/'+this.shapes[arguments[0]]+rand(this.numbers)+rand(this.colors)+'.png';
                break;
            case 2:
                img=this.ctask.localpath+'img/'+this.shapes[arguments[0]]+this.numbers[arguments[1]]+rand(this.colors)+'.png';
                break;
            default:
        }
        return img
    }

    comprule(img1,img2,rule)
    {
        var rs;var correct=false;
        var cmd="rs=this."+this.rulenames[rule]+".slice();"; eval(cmd);
        console.log(img1+","+img2);var flag=false; var numflag=false;
        if(this.rulenames[rule]=="numbers") numflag=true;

        for(var i=0;i<rs.length;i++)
        {
            if(numflag) flag=img1.includes(rs[i]+1) && img2.includes(rs[i]+1);
            else flag=img1.includes(rs[i]) && img2.includes(rs[i]);
            if(flag) { correct=true; break; }
        }
        return correct;
    }

    setup(){
        this.init();
        this.setup_random_rules(this.max_iteration)
        this.current_iteration=0;
        this.current_rule=this.rule_sequence[this.current_iteration];
        this.correctly_responded=0;
        for(let i=0;i<this.ctask.sequence_length;i++) this.ctask.task_trial_sequence.push(i);
        for(let i=0;i<this.ctask.pretest_sequence_length;i++) this.ctask.pretest_trial_sequence.push(i);
        //this.sequence_length=this.ctask.task_trial_sequence.length;
        this.current_iteration=-1;
        this.update_rule();
        super.setup();
    }

    setup_random_rules(max_iteration){
        this.rule_sequence=[]; let rule;
        const rules=[0,1,2];
        this.current_rule=jsFunc.randidx(rules.length);
        this.rule_sequence.push(this.current_rule);
        this.rule_response_count.push(0);
        for(let i=1;i<max_iteration;i++){
            this.rule_response_count.push(0);
            while(1){
                var flag=true;
                rule=jsFunc.randidx(rules.length);
                if (i>0 && rule==this.rule_sequence[i-1]) flag=false;
                if (i>1 && rule==this.rule_sequence[i-2]) flag=false;
                if(flag) break;
            }
            this.rule_sequence.push(rule);
        }
        this.current_rule=this.rule_sequence[0];
    }
    setup_random_sequence(sequence_length,ruleidx=-1){
        let task_trial_sequence=[];
        var stims=jsFunc.create_array(sequence_length,3);
        for (var i=0;i<sequence_length;i++) {
            var flag=true;
            while(1) {
                let flag=true;
                var a=[jsFunc.randidx(4), jsFunc.randidx(4), jsFunc.randidx(4)];
                if(a[0]==a[1] && a[0]==a[2]) continue; //same with the buttons
                if(i>0){
                    //if(flag) if(a==stims[i-1][0] && b==stims[i-1][1] && c==stims[i-1][2]) flag=false;
                    for(let k=0;k<3;k++) if(flag && a[k]==stims[i-1][k]) flag=false;
                    if(flag && ruleidx>=0){
                        if(flag && a[ruleidx]==ruleidx) flag=false;
                        if(flag && i>1 && a[ruleidx]==stims[i-2][ruleidx]) flag=false;
                    }
                }
                if(flag) break;
            }
            stims[i][0]=a[0]; stims[i][1]=a[1]; stims[i][2]=a[2];
        }
        for (var i=0;i<sequence_length;i++) {
            var a=new Object(); var d=new Object();
            a.stimulus=this.get_sample_image(stims[i][0],stims[i][1],stims[i][2]);
            d.stim_type=exp.TARGET;
            d.stim_id=stims[i][0]*100+stims[i][1]*10+stims[i][2];
            d.stimulus=jsFunc.get_filename(a.stimulus);
            if(ruleidx>=0){
                d.states=this.rulenames[ruleidx];
                d.correct_response=stims[i][ruleidx];
            }
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }
    update_session_level()
    {
        this.setup_random_rules(this.max_iteration)
        this.current_iteration=0;
        this.current_rule=this.rule_sequence[this.current_iteration];
        this.correctly_responded=0;
        for(let i=0;i<this.ctask.sequence_length;i++) this.ctask.task_trial_sequence.push(i);
        //this.sequence_length=this.ctask.task_trial_sequence.length;
        this.current_iteration=-1;
        this.update_rule();
    }

    callback_trial_stimulus(){
        let img=this.conditions[this.count_block_trial]
        return img.stimulus;
    }
    callback_trial_data(){
        return this.conditions[this.count_block_trial].data;
    }
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }
    //callback_prompt(){ return jsPsych.timelineVariable('prompt',true);}
    callback_evaluate_performance(data){
        if (this.current_iteration==this.max_iteration)
            jsPsych.endCurrentTimeline();
        else{
            if (this.ctask.trial_count==this.ctask.sequence_length)
                jsPsych.endCurrentTimeline();
        }
        
    }
    callback_score_response(data){
        var correct=false;
        var cstim=this.conditions[this.count_block_trial].stimulus;//jsPsych.timelineVariable('stimulus');        
        this.rule_response_count[this.current_iteration]=this.rule_response_count[this.current_iteration]+1;    
        
        data.correct=correct;
        data.states=this.rulenames[this.current_rule];

        this.count_block_trial++;
        
        if(data.responses==undefined || data.responses==null || data.responses.length==0) {
            if(this.count_block_trial>=this.max_ruleblock_length) 
            jsPsych.endCurrentTimeline();
            return false;
        }
        var ch=this.response_choices[parseInt(data.button_pressed)];
        //console.log(this.rulenames[this.current_rule]+"||S||"+cstim+":"+ch+"("+ri+")");
        correct=this.comprule(ch,cstim,this.current_rule);
        data.correct=correct;        
        if(correct) this.correctly_responded++;
        var score=correct ? 1:0;
        
        if (this.correctly_responded===this.max_responses_to_change){
            this.update_rule();
        }
        if(this.count_block_trial>=this.max_ruleblock_length) 
        jsPsych.endCurrentTimeline();
        return score;
    }
    update_rule(){
        this.current_iteration++;
        this.current_rule=this.rule_sequence[this.current_iteration];
        this.correctly_responded=0;
        this.rule_response_count[this.current_iteration]=0;

        this.conditions=this.setup_random_sequence(this.max_ruleblock_length,this.current_rule);
        this.count_block_trial=0;

        console.log("New rule is " + this.rulenames[this.current_rule]);
    }

    callback_feedback_audio_index(stimulus,responses){
        var aid=1;
        var resp=parseInt(responses[responses.length-1].button);
        //var ch=this.response_choices[resp];
        //console.log(this.rulenames[this.current_rule]+"||A||"+stimulus+":"+ch+"("+resp+")");
        //correct=this.comprule(ch,stimulus,this.current_rule);
        aid=resp==this.conditions[this.count_block_trial].data.correct_response ? 0 : 1;
        return aid;
    }
}
