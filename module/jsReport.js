class jsReport extends jsTrialtask {
    constructor (name,localpath='./',taskID=null){
      super(name,localpath,taskID);
      this.type='Report';
      if(taskID===null) this.taskID='Report'+'-'+jsPsych.randomization.randomID(5);
      this.nickname='결과';
      this.report_trial=null;
      this.callback=null;
      this.background_color="#BDDC88";
      this.background_img=null;
      this.chartColors=null;
      this.background_img='';
      this.init();
    }
    example(){
    }
    
    set_default_trials(){ 
        if(this.taskID.length==0) this.taskID=this.name+'-'+jsPsych.randomization.randomID(5);
    }
    callback_report(){
        return "<p>당신의 결과는 100점입니다 </p>"
    }
    init(){
        this.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
          };
    }
    callback_get_chart_data(){
        let color = Chart.helpers.color;
        let labels=[]; let data1=[]; let data2=[];
        for(let i=0;i<exp.task_scores.length;i++){
            let ctask=exp.task_scores[i];
            labels.push(ctask.taskname);
            data1.push(ctask.score);
            data2.push(ctask.score);
        }

        return {
            labels: labels,
            datasets: [{
                label: '오늘 점수',
                backgroundColor: color(this.chartColors.red).alpha(0.8).rgbString(),
                borderColor: this.chartColors.red,
                borderWidth: 1,
                data: data1,
            }, {
                label: '기준 점수',
                backgroundColor: color(this.chartColors.blue).alpha(0.8).rgbString(),
                borderColor: this.chartColors.blue,
                borderWidth: 1,
                data: data2,
            }
            ]
        };
    }
    callback_bar_chart_options(){    
        return  {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '수행 결과',
                defaultFontSize:30,
                scaleFontSize: 30,
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                    }
                }],
                xAxes: [{
                    display: true,
                    scaleFontSize: 26,
                }]
            }
        }        
    }
    set_trial(){
        this.bar_chart_trial = {
            type: 'unified-button-response',
            taskID:this.taskID,
            stimulus_type:'canvas',
            on_start:function (trial) {
                var ctask=exp.getTask(trial.taskID);
                if(ctask!==null) {
                    document.querySelector("body").style.backgroundImage = `url("${ctask.background_img}")`;
                    document.querySelector("body").style.backgroundColor = ctask.background_color;
                    document.querySelector("body").style.backgroundRepeat = "no-repeat";
                    document.querySelector("body").style.backgroundPosition = "center center";
                    //document.querySelector("body").style.backgroundSize = "100% 100%";                    
                }
            },                        
            stimulus_canvas_function: function(canvas,trial) {         
                let data1=null; let options1=null;
                if(typeof trial.taskID==="undefined") var ctask=null;  
                else var ctask=exp.getTask(trial.taskID);
                if(ctask!==null) {
                    data1=ctask.callback_get_chart_data();
                    options1=ctask.callback_bar_chart_options();
                }
                document.querySelector("#webrain-statusbar-score").innerHTML = "당신 과제 점수";
                var ctx = canvas.getContext("2d");
                var chart = new Chart(ctx, {
                    type: 'bar',    
                    data: data1,
                    options: options1,
                });
            },
            button_html: uxm.button_next,
            choices: ["다음"],
        };
    }

    init_variables(){}
    setup(){}

    compile(trialall=true,envmode=false) { 
      this.set_trial();
      if(this.bar_chart_trial!==null) this.timeline.push(this.bar_chart_trial);
    }
}