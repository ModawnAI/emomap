class jsRTSurvey extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='Survey';
        if(taskID===null) this.taskID='Survey'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='서베이';
        this.task_session_info={};

        this.variable_files=['var/variables.js','var/survey.js'];
    }

    create_task_trial() {
        this.task_trial=new jsRTSurveyTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial();
    }
    add_epilog_trials()
    {
        this.create_chart();
        this.epilog_trials=[];
        this.epilog_trials.push(this.radar_chart_trial);
        super.add_epilog_trials();
    }
    /** TASK SPECIFIC RESULT REPORT **/
   /* updated by task debrief
    conditions:null,
    mean_response_time:null, 
    result1:null,  
    result2:null, 
    result3:null, 
    result4:null, 
    result5:null, 
    results_descript:null, 
    task_file:null,  
    result_file:null, 
    etc:null,   
    */

    create_chart(){
        this.radar_chart_data={
            labels: [], //'Running', 'Swimming', 'Eating', 'Cycling'
            datasets: [{
                label:'점수',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                lineTension: 0.4,
                borderDash: [],
                pointRadius:2,
                data: [],//20, 10, 4, 15
            },{
            label:'반응시간',
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            lineTension: 0.4,
            borderDash: [],
            pointRadius:2,
            data: [],//20, 10, 4, 15    
        }]};
        
        this.radar_chart_options = {
            scale: {
                angleLines: {
                    display: false
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 20
                }
            }
        };
        
        this.radar_chart_trial = {
            type: 'unified-button-response',
            stimulus_type:'canvas',
            stimulus_canvas_function: function(canvas,trial) {
                document.querySelector("#webrain-statusbar-score").innerHTML = "당신의 회복탄력성";
                    var ctx = canvas.getContext("2d");
                    var chart = new Chart(ctx, {
                    type: 'radar',    
                    data: this.callback_get_chart_data,//변화
                    options: this.radar_chart_options,//수정해야
                });
            },
            button_html: uxm.button_next,
            choices: ["다음"],
        };
    }
    callback_get_chart_data(){
        return this.radar_chart_data;
    }

    callback_get_debrief(){
        //var rt = Math.round(jsPsych.data.get().filter({stim_type: true}).select('rt').mean());
        console.log(jsPsych.data.get().uniqueNames())
    
        var stim_id=jsPsych.data.get().select('stim_id').values.sort();
        var responsedata=jsPsych.data.get().select('button_pressed').values;
        var rtdata=jsPsych.data.get().select('rt').values;
        var nitem=responsedata.length; var nscore=5;
    
        /*
        var nitem=103; 
        stim_id=shuffleidx(nitem);
        responsedata=rand_response(nitem,nscore);
        rtdata=rand_rt(nitem,300,nscore);
        */
    
        let Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
        var pairs = stim_id.map(function (value, index){
            let a = Struct('stim_id', 'response','rt')
            return a(value,responsedata[index],rtdata[index]);
        });
        pairs.sort(jsFunc.compare_values('stim_id','ascend'));
        //let result = pairs.map(({ response }) => response); //
        var response = pairs.map(a => a.response);
        var stimid = pairs.map(a => a.stim_id);
        var rt= pairs.map(a => a.rt);
        //[ ...Array(N).keys() ].map((i) => f(i))
    
        var respresult=new Array(nitem).fill(0);// create zeros
        var rtresult=new Array(nitem).fill(0);// create zeros
        for (var i=0;i<stimid.length;i++) {
            respresult[stimid[i]]=response[i]+1;
            rtresult[stimid[i]]=rt[i];
        }
        console.log(respresult)
        console.log(rtresult)
        this.evaluate_response(respresult,rtresult);
    
        //var stims=jsPsych.data.get().filter({stim_type: true}).select('stim_id').values;
        var meanrt=jsPsych.data.get().select('rt').mean();
        var sdrt=jsPsych.data.get().select('rt').sd();
        var task_info={};
        task_info.rt_mean=Math.round(meanrt);
        task_info.rt_std=sdrt;
        this.task_session_info=Object.assign(this.task_session_info,task_info);
    
        return "%GUIDE%"+"<p>총 시행 설문수: <strong>" + nitem + "회</strong>.</p>"+
        "<p>평균 응답 속도: <strong>" + meanrt + "ms</strong>.</p>"+
        "<p>다시 하시겠습니까?</p>";
    }
    
    evaluate_response(resp,rts) {
        //console.log(resp[...cidx1]);
        //sum=items.reduce((a, b) => a + b, 0);
        var usert=false;
        if (arguments.length==2) {
          if(resp.length==rts.length) usert=true;
        }
        for(var i=0;i<categories.length;i++)
        {
          var name=categories[i]; var items; var rsp; var rt;
          eval(`items=category_index${i+1}`)
          var s=0; for(var j=0;j<items.length;j++) s+=resp[items[j]-1];      
          eval(`var ${name}=${s};`);eval(`rsp=${s}`); 
          console.log(`${name}=${s}`);
          let flag=true;
          eval(`if (typeof ${name}==='undefined') flag=false;`)
          if(flag){
            this.radar_chart_data.labels.push(name);
            this.radar_chart_data.datasets[0].data.push(eval(`${name}`));
            if(usert) { var r=0;for(var j=0;j<items.length;j++) r+=rts[items[j]-1]; 
                r=r/items.length;eval(`var ${name}_rt=${r};`);eval(`rt=${r}`);this.radar_chart_data.datasets[1].data.push(eval(`${name}_rt`));
            }
          }
        }
        var flag=true;
        for(var i=0;i<1000;i++)
        {
          var check=`if(typeof evaluation${i+1} ==='undefined') flag=false;`;
          eval(check)
          if(!flag) break;
          eval(check);
          var cmd= `var evaluation${i+1}`;  
          cmd=eval(cmd); var item;
          if(typeof cmd === 'undefined') continue; end
          if(cmd.includes('+') || cmd.includes('-') || cmd.includes('*'))
          {
            eval(cmd);  
            var ab=cmd.split("=");
            var name=ab[0]; var item;
            var cmd1=`item=${name};`;
            eval(`${cmd1}`)
            console.log(`var ${name}=${item}`);
      
            this.radar_chart_data.labels.push(name);
            this.radar_chart_data.datasets[0].data.push(item);
            if(usert){
              abc=ab[1].split(/[+]|[-]|[*]/);var rt=0; // calculate rt of item1=subitem1+subitem2+subitem3...; 
              for(var i=0;i<abc.length;i++){
                rt=rt+eval(`${abc[i]}_rt`);
              }
              rt=rt/abc.length;
              eval(`var ${name}_rt=rt`);
              console.log(rt);
              this.radar_chart_data.datasets[1].data.push(rt);
            }      
          }    
        }
        var task_info={};
        task_info.results_descript=''; var mn=this.radar_chart_data.labels.length>15 ? 15:this.radar_chart_data.labels.length;//maximum 15 results can be stored
        for (var i=0;i<mn;i++){
          var cmd=`task_info.result${i+1}=radar_chart_data.datasets[0].data[i];`    
          eval(cmd);
          if(i==mn-1) task_info.results_descript=task_info.results_descript+this.radar_chart_data.labels[i];
          else task_info.results_descript=task_info.results_descript+this.radar_chart_data.labels[i] +",";
        }
        this.task_session_info=Object.assign(this.task_session_info,task_info);
      
        if(usert)
        {
            this.radar_chart_data.datasets[1].data=jsFunc.sub_array(this.radar_chart_data.datasets[1].data,jsFunc.min_array(this.radar_chart_data.datasets[1].data));
            this.radar_chart_data.datasets[1].data=jsFunc.mult_array(this.radar_chart_data.datasets[1].data,jsFunc.max_array(this.radar_chart_data.datasets[0].data)/jsFunc.max_array(this.radar_chart_data.datasets[1].data));
        }
    }
}

class jsRTSurveyTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='Survey-v10';
        this.taskID='Survey_12345';

        this.stimulus_type='html'; //image, numbers, html 
        this.stimulus_duration=10000;
        this.trial_duration=10000; //total duration
        this.post_trial_gap=1000;
        this.response_ends_trial=true;
   
        this.stimulus_height=200;
        this.noresponse_warning=true;
        this.set_default()
    }
    set_default(){
        this.response_choices=uxm.agreement_five_choices;
    }
    init(){ //task specific initialization
        this.ctask.sequence_length=surveys.length;
    }

    setup(){
        this.init();   
        this.ctask.task_trial_sequence = []; 
        for (let i=0;i<this.ctask.sequence_length;i++)
        {
            let a=new Object(); let d=new Object();
            let sur=surveys[i];
            let rscale=1; // If xxx(R), xxx should be reversely scaled... 
            if(sur.includes("(R)")) {
                let surs=sur.split("(");
                sur=surs[0];
                rscale=-1;
            }
            if(sur.includes("(T)")) {
                let surs=sur.split("(");
                sur=surs[0];
                rscale=0;
            }
            a.stimulus='<p style="color: blue; font-size:' + this.stimulus_height +'; font-weight: bold;">'+ sur + '</p>'   
            a.speech_text=sur; 
            d.stim_type=exp.TARGET
            d.stim_subtype=rscale;
            d.stim_id=i;
            d.stim_duration=this.stimulus_duration;
            d.stimulus='';//sur;
            a.data=d;    
            this.ctask.task_trial_sequence.push(a);
        }
        /*
        this.ctask.sampling_method={
            type: 'without-replacement', 
            size: this.sequence_length,
        };
        */
        super.setup();   
    }
 
    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){ return jsPsych.timelineVariable('data',true); } 
    set_speech_text(){ return jsPsych.timelineVariable('speech_text',true);}
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    callback_response_audio(){  return uxm.sound_button_press; }

    callback_score_response =function(data){
        data.correct=true;
        return 1;
    }
}
