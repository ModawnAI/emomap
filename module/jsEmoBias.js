class jsEmoBias extends jsCogtask {
    constructor (name,localpath='./',taskID=null){
        super(name,localpath,taskID);
        this.type='EmoBias';
        if(taskID===null) this.taskID='EmoBias'+'-'+jsPsych.randomization.randomID(5);
        this.sequence_length = 5;
        this.nickname='정서편향';
        this.set_default();
    }
    set_default(){
        this.pretest_sequence_length=5;
        this.sequence_length=20;
    }
    create_task_trial() {
        this.task_trial=new jsEmoBiasTrial('trial',this);
    }
    set_task_trial(trial){
        super.set_task_trial(); //compile
    }
    callback_get_debrief(){
        return this.get_debrief_type('congruent');
    }
}

class jsEmoBiasTrial extends jsTrial {
    constructor (name,task){
        super(name,task);
        this.type='EmoBias-v10';
        this.stimulus_type='html'; //image, numbers, html
        this.stimulus_duration=4000;
        this.trial_duration=4000;
        this.post_trial_gap=100;
        this.response_ends_trial=true;
        this.poststimulus='fixation';
        this.fixation_size=50;
        this.stimulus_height=150;
        this.stimulus_number=16
        this.grid_rows=6
        this.set_default()
    }
    set_default() {

        this.responses=[];
        this.stimulus_isi=500;
        this.trial_duration=3000; //total duration
        this.number_random_sequence=1;
        this.stimuli_set_pos=[];
        this.stimuli_set_neg=[];
        this.response_choices=[];
        this.keyboard_choices=['j','k'];//['leftarrow','rightarrow']
        this.response_choices=['부정','긍정'];
    }
    init(){ //task specific initialization
        super.init()
        for(let i=1;i<21;i++){
            this.stimuli_set_pos.push(`img/p${i}.png`);
        }
        for(let i=1;i<21;i++){
            this.stimuli_set_neg.push(`img/n${i}.png`);
        }
        // just one time for stimuli and stimuli_set when we assign like above
        this.stimuli_set_pos.forEach((element,i)=> this.stimuli_set_pos[i]=this.ctask.localpath+element ); //add localpath
        this.stimuli_set_neg.forEach((element,i)=> this.stimuli_set_neg[i]=this.ctask.localpath+element ); //add localpath
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set_pos);   
        this.ctask.preload_images=this.ctask.preload_images.concat(this.stimuli_set_neg);             
        this.stimuli_isi=[];
        this.ctask.task_trial_sequence = [];
        this.max_response_count=1;
    }

    setup(){
        this.init();
        if(typeof sequence_ext!=='undefined' && sequence_ext.length > 0)
        {
            this.ctask.sequence_data=sequence_ext;//.slice(0,10);
            this.sequence_random=false;
            this.ctask.sequence_length=this.ctask.sequence_data.length;
        }
        this.ctask.pretest_trial_sequence=this.setup_random_sequence(this.ctask.pretest_sequence_length);
        if(this.sequence_random){
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
        } else {
            this.ctask.task_trial_sequence=this.setup_random_sequence(this.ctask.sequence_length);
            //this.setup_ordered_sequence();
        }
        this.ctask.sequence_data=[];
        super.setup();
    }
    setup_ordered_sequence () {

    }
    get_random_positions(nrow,ncol, count) {
        let maxValue=nrow*ncol;
        let hcol=Math.floor(ncol/2);
        let hrow=Math.floor(nrow/2);
        let cent1=(hrow-1)*ncol+hcol-1;
        let cent2=hrow*ncol+hcol-1;
        let positions = []; let skips=[0,ncol-1,maxValue-ncol,maxValue-1,cent1,cent1+1,cent2,cent2+1];
        
        while(positions.length<count) {
          let position = Math.floor(Math.random() * maxValue);
          while (positions.includes(position) || skips.includes(position)) {
            position = Math.floor(Math.random() * maxValue);
          }
          positions.push(position);
        }
        return positions;
    }

    getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
      
    generate_image_grid(imagePaths, gridSize,cellWidth='50',cellHeight='50',gapSize,marginSize) {
        let numImages = Math.min(gridSize * gridSize, imagePaths.length);
        let positions = this.get_random_positions(gridSize,gridSize, numImages);
        let cellWidth1=cellWidth; let cellHeight1=cellHeight;
        if(cellWidth=="auto") cellWidth1=cellHeight;
        if(cellHeight=="auto") cellHeight1=cellWidth;
        if (typeof cellWidth === 'number') {
            cellWidth = cellWidth.toString() + 'px';
        }
        if (typeof cellHeight === 'number') {
            cellHeight = cellHeight.toString() + 'px';
        }
        if (typeof gapSize === 'number') {
            gapSize = gapSize.toString() + 'px';
        }
        if (typeof marginSize === 'number') {
            marginSize = marginSize.toString() + 'px';
        }
        let html = '<div id="grid-container" style="display: grid; grid-template-columns: repeat(' + gridSize + ', ' + cellWidth + '); grid-template-rows: repeat(' + gridSize + ', ' + cellHeight + ');gap: ' + gapSize + ';">';

        let imageIndex = 0;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (imageIndex < numImages) {
                    
                    var offsetX = Math.round(this.getRandomNumber(-cellWidth1 / 3, cellWidth1 / 3));
                    var offsetY = Math.round(this.getRandomNumber(-cellHeight1 / 3, cellHeight1 /3));
                    // Create the image tag with the random position shifts
                    let image = '<img src="' + imagePaths[imageIndex] + '" style="object-fit: cover; width: ' + cellWidth + '; height: ' + cellHeight + '; margin: ' + marginSize + '; position: relative; left: ' + offsetX + 'px; top: ' + offsetY + 'px;">';
                    let position = positions[imageIndex];
                    let row = Math.floor(position / gridSize);
                    let col = position % gridSize;
                    html += '<div style="grid-column: ' + (col + 1) + '; grid-row: ' + (row + 1) + ';">' + image + '</div>';
                    imageIndex++;
                } else {
                    html += '<div style="grid-column: ' + (j + 1) + '; grid-row: ' + (i + 1) + ';"></div>';
                }
            }
        }
        html += '</div>';
        return html;
    } 

    setup_ratio_sequence(ratios,n) {
        let ratioSequence = [];
        let occurrences = Math.floor(n / ratios.length);
        for (let i = 0; i < occurrences; i++) {
            ratioSequence = ratioSequence.concat(ratios);
        }
        let remaining = n % ratios.length;
        for (let i = 0; i < remaining; i++) {
            let randomIndex = Math.floor(Math.random() * ratios.length);
            ratioSequence.push(ratios[randomIndex]);
        }
        return jsFunc.shuffle(ratioSequence);
    }

    setup_random_sequence(sequence_length){
        let nbut=this.stimulus_number;
        let positions=[]; for (let i=0;i<nbut;i++) positions.push(i);
        let task_trial_sequence=[];
        let ratios=[0.2,0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        let ratioseq=this.setup_ratio_sequence(ratios,sequence_length);
        for (let it=0;it<sequence_length;it++) {
            let a=new Object(); let d=new Object(); 
            let npos=Math.round(ratioseq[it]*nbut);
            let itemsn=jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set_neg,nbut-npos); 
            let itemsp=jsPsych.randomization.sampleWithoutReplacement(this.stimuli_set_pos,npos); 
            let items=itemsp.concat(itemsn);
            items=jsFunc.shuffle(items);

            if (ratioseq[it]>0.5)
                d.correct_response=1
            else d.correct_response=0

            d.stim_id=ratioseq[it];
            a.stimulus=this.generate_image_grid(items,this.grid_rows,'auto',this.stimulus_height,10,10); ;
            a.stim_type=exp.TARGET;
            a.data=d;
            task_trial_sequence.push(a);
        }
        return task_trial_sequence;
    }

    callback_trial_stimulus(){return jsPsych.timelineVariable('stimulus',true); }
    callback_trial_data(){return jsPsych.timelineVariable('data',true); }
    set_speech_text(){ return jsPsych.timelineVariable('speech_text',true);}
    callback_stimulus_audio(){  return uxm.sound_stimulus_presented; }
    //callback_response_audio(){  return uxm.sound_button_press; }

    callback_adaptive_procedure(trial){
        if(this.adaptivemode){
            let flag=0;let nadapt=3;
            if (this.responses.length<nadapt) return;
            for (i=1;i<=nadapt;i++)
            {
                if(this.responses[this.responses.length - i].correct) {  flag=flag+1;   }
                else { flag=flag-1;}
            }
            if (flag==nadapt) trial.stimulus_duration=trial.stimulus_duration*0.5;
            else if(flag==-nadapt) trial.stimulus_duration=trial.stimulus_duration*5;
            console.log(trial.stimulus_duration);
        }
    }
    callback_score_response =function(data){
        data.correct=data.button_pressed == data.correct_response  ? true : false;
        let score=data.correct ? 1:0;
        return score;
    }
}
