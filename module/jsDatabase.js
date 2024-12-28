var dbServer = {};
dbServer.logging = false;
dbServer.mainpath=env.rootpath;
dbServer.response=null;
const callback_exclude=function(response){
  dbServer.response=response;
  console.log('Record already exist!!');
};
const callback_success=function(response){
  dbServer.response=response;
  console.log('Sucess in writing to db')
}
const callback_failure=function(response){
  if(response!==null) console.log(response.error_message);
  console.log('Failure in server side');
}
dbServer.register_participant = function(participantinfo){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', dbServer.mainpath+'php/register_participant.php');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    var response;
    if(xhr.status == 200){
      response = JSON.parse(xhr.responseText);
      if(dbServer.logging){
        console.log(response);
      }
      if(response.success){
        if(response.excluded){
          callback_exclude(response);
        } else {
          callback_success(response);
        }
      } else {        
        callback_failure(response);
      }
    }
  };
  xhr.onerror = function(){
    callback_failure(null);
  }
  xhr.send(JSON.stringify(participantinfo));
}

dbServer.save_task_session = function(task_info){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', dbServer.mainpath+'php/save_task_session.php');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    var response;
    if(xhr.status == 200){
      response = JSON.parse(xhr.responseText);
      if(dbServer.logging){
        console.log(response);
      }
      if(response.success){
        callback_success(response);
      } else {
        console.log(response.error_message);
        callback_failure();
      }
    }
  }
  xhr.onerror = function() {
    callback_failure();
  }
  xhr.send(JSON.stringify(task_info));
}

dbServer.save_trial_data = function(data){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', dbServer.mainpath+'php/save_trials.php');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    var response;
    if(xhr.status == 200){
      response = JSON.parse(xhr.responseText);
      if(dbServer.logging){
        console.log(response);
      }
      if(response.success){
        callback_success(response);
      } else {
        callback_failure();
      }
    }
  }
  xhr.onerror = function() {
    callback_failure();
  }
  xhr.send(JSON.stringify(data));
}

dbServer.get_score = function(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', dbServer.mainpath+'php/get_rank_from_db.php');
  xhr.setRequestHeader('Content-Type', 'application/json');
}

dbServer.get_user_info = function(subjid){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200){
      var response = JSON.parse(xhr.responseText);
      return response;
    }
  }
  xhr.open('POST', dbServer.mainpath+'php/get_user_info.php',true);
  //xhr.open('GET', dbServer.mainpath+'php/get_user_info.php?q='+subjid,true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(subjid));
};
//// DATABASE SERVER //// 


class jsDatabase {
  constructor () {
    this.ctask=null;
    this.researcherID=null;
    this.projectID=null;
    this.participantID=null;
    this.sessionID=null;   //게임 코스 고유값
    this.reload=null;   //이어하기 횟수

    this.Age=null;
    this.Gender=null;

    this.subj_infonames=null;
    this.env_infonames=null;
    this.task_infonames=null;
    this.trial_infonames=null;
    this.datainfos=null;

    this.save_csv_filename=null;
    this.save_json_filename=null;
    this.save_local_csv=true;
    this.save_remote_csv=false;

    this.ignore_columns = ['internal_node_id','stimulus_audio','rt_audio','key_press','button_pressed','responses','age','gender'];
    this.search_option = {phase: 'test'}; // we are only interested in our main stimulus, not fixation, feedback etc.
  }

  set_task(task) {
    if(task instanceof jsCogtask) this.ctask=task; 
    try{        
        //var info=this.get_subject_info();
        /*this.researcherID=info.researcherID;
        this.projectID=info.projectID;
        this.participantID=info.participantID;
        this.Age=info.Age;
        this.Gender=info.Gender;
        */
    }
    catch(err) {}
  }

  get_subject_info(subjid=null)
  {
    if(subjid!==null) return dbServer.get_user_info(subjid);

      // generate a random subject ID with 15 characters
      var participantID = "<?php echo $_SESSION['participantID']; ?>";
      var Age = "<?php echo $_SESSION['age']; ?>";
      var Gender = "<?php echo $_SESSION['gender']; ?>";        
      //var subjinfo=alert(dbServer.get_user_info(participantID));
      //var Age = subjinfo.age;
      //var Gender = subjinfo.gender;
      return {
          participantID:participantID,
          Age:Age,
          Gender:Gender,        
      }
  }
  init_default_info(){
    if(this.researcherID===null) this.researcherID = exp.researcherID;
    if(this.projectID===null) this.projectID = exp.projectID;
    if(this.participantID===null) this.participantID = exp.participantID;
    if(this.sessionID===null) this.sessionID = exp.sessionID; //게임 코스 고유값
    if(this.reload===null) this.reload = exp.reload; //이어하기 횟수
    if(this.Age===null) this.Age=exp.Age;
    if(this.Gender===null) this.Gender=exp.Gender;      
  }

  init(){
    if(this.researcherID===null) this.researcherID = jsPsych.randomization.randomID(15);
    if(this.projectID===null) this.projectID = jsPsych.randomization.randomID(15);
    if(this.participantID===null) this.participantID = jsPsych.randomization.randomID(15);
    if(this.sessionID===null) this.sessionID = jsPsych.randomization.randomID(16); //게임 코스 고유값
    if(this.reload===null) this.reload = 0; //이어하기 횟수
    if(this.Age===null) this.Age=undefined;
    if(this.Gender===null) this.Gender=undefined;
    //task_condition ===null ?  null : task_condition

    this.data_participant_info={ // add these variables to all rows of the datafile
      projectID:this.projectID,  
      participantID:this.participantID,   
      sessionID:this.sessionID, 
      reload:this.reload,
      taskID:this.ctask.taskID, 
      taskname:this.ctask.name,    
      age:this.Age,
      gender:this.Gender,
    };

    var date=new Date();
    var fdatestr=date.getFullYear().toString()+date.getMonth().toString()+date.getDate().toString()+'_'+date.getHours().toString()+date.getMinutes().toString()+date.getSeconds().toString();
    if(this.save_csv_filename===null) this.save_csv_filename=this.participantID+'_'+this.task_name+'_'+fdatestr+".csv";
    if(this.save_json_filename===null) this.save_json_filename=this.participantID+'_'+this.task_name+'_'+fdatestr+".json";

    if(this.subj_infonames===null) this.subj_infonames="participantID,age,gender";  
    if(this.env_infonames===null) this.env_infonames='browser_name,browser_version,os_name,os_version,tablet,mobile,screen_resolution,window_resolution,fullscreen';
    if(this.task_infonames===null) this.task_infonames='projectID,taskID,taskname,session';
    if(this.trial_infonames===null) this.trial_infonames='stim_id,stim_type,stim_subtype,stim_duration,stim_soa,session,start_time,time_elapsed,multi_responses,states,response,rt,correct_response,correct,score'
    //   
    
    jsPsych.data.addProperties(this.data_participant_info);
    if(exp.verbose) {
      var d=jsPsych.data.get().values();
      if(d.length>0) console.log('+++ ' + this.data_participant_info.taskID+' is appended to data:'+d[0].taskID);
      else console.log('+++ ' + this.data_participant_info.taskID+' is appended to data');
    }

    this.save_local_csv=!env.online;
    this.save_remove_csv=env.online;
  }
    //var subjID = jsPsych.data.get().last(1).values()[0]['participantID'];
    //var full_data = jsPsych.data.get();
    //console.log(jsPsych.data.get().uniqueNames()); console.log(selected_data.uniqueNames());
  save_to_csv(local=true,remote=false){
    let tocsv_data = jsPsych.data.get().filter(this.search_option).ignore(this.ignore_columns);

    this.datainfos=this.subj_infonames+','+this.task_infonames+','+this.trial_infonames+','+this.env_infonames;
    this.datainfos=this.datainfos.split(',');
    let datainfovalue=Object.assign({},this.data_participant_info,this.ctask.task_session_info,this.ctask.env_info);
   
    let d = tocsv_data.values() // get the data values    
    var obj={}; var new_obj={};
    function myFunction(item,idx,arr) { // this is function is called in the arr.forEach call below
      if (obj[item] instanceof Date) {
          new_obj[item] = jsFunc.toSqlDatetime(obj[item]);
      }
      else if(obj[item]!==obj[item]) {} //numeric nan
      else new_obj[item] = obj[item];
    }
    // order it for the whole data array according to datainfo order
    for (let i = 0; i < d.length; i++) {
      obj = Object.assign(datainfovalue,d[i]); // get one row of data            
      new_obj={};
      this.datainfos.forEach(myFunction); // for each element in the array run my function
      tocsv_data.values()[i] = new_obj; // insert the ordered values back in the jsPsych.data object
    }
    if(local) tocsv_data.localSave('csv', this.save_csv_filename);    
    if(remote) {
      this.save_data_xhr(this.save_csv_filename,jsFunc.format_to_sql(tocsv_data.values()));// jsPsych.data.get().csv());
      console.log('save data to csv at the remote server using xhr')  
    }
  }

  save_to_db(selected_data){
    //if(!env.online) return;
    let datainfovalue=Object.assign({},this.ctask.task_session_info,this.ctask.env_info);
    
    dbServer.save_task_session(jsFunc.format_to_sql(datainfovalue),
    function(){
            //start_experiment();
            //console.log('Start experiment with conditions')
        },
        function(){
            //document.querySelector('body').innerHTML = '<p>Our apologies. There was a technical error on our end while loading the experiment.</p><p>You will not be able to complete the experiment. We are sorry for the trouble.</p>';
        }
    )
    dbServer.save_trial_data(jsFunc.format_to_sql(selected_data.values())); //jsPsych.data.get().values());
    console.log('save data to mysql')  
    //window.opener.location.reload(); //db 저장 완료 후 부모창 reload
  }

  register_participant(info=null){
    let participant_info={
      registration_date:jsFunc.toSqlDatetime(new Date()),
    }
    participant_info=Object.assign(participant_info,this.data_participant_info);
    if(info!==null) {
      let replaces=[['Age','age'],['Gender','gender']]
      for(let i=0;i<replaces.length;i++) {
        if(info[replaces[i][0]]!==undefined) {
          info[replaces[i][1]]=info[replaces[i][0]];
          delete info[replaces[i][0]];
        }
      }
      participant_info=Object.assign(participant_info,info);
    }
    dbServer.register_participant(participant_info)
    //register php 
  }


  save_result_data() {
    this.save_to_csv(this.save_local_csv,this.save_remote_csv);
    // FOR SAVING TO LOCAL CSV
    let selected_data = jsPsych.data.get().filter(this.search_option).ignore(this.ignore_columns);
    let d = selected_data.values() // get the data values
    var new_obj={};
    for (let i = 0; i < d.length; i++) {
      new_obj = jsFunc.format_to_sql(d[i]);
      selected_data.values()[i] = new_obj; // insert the ordered values back in the jsPsych.data object
    }
    this.save_to_db(selected_data);
  }

  on_data_update(data,headermode=false) { // each time the data is updated:
    if (env.online){
      if (headermode){ // write header
          var data_row=[];for(var i=0;i<this.datainfos.length;i++) data_row += ','+ this.datainfos[i];  data_row+='\n';
          append_data(this.save_csv_filename,data_row);
      } else {
          var data_row=[];for(var i=0;i<this.datainfos.length;i++) data_row += ','+ data[this.datainfos[i]];  data_row+='\n';
          append_data(this.save_csv_filename,data_row);
      }
    } 
  }

  // function that appends data to an existing file (or creates the file if it does not exist)
  append_data(filename, filedata) {
    $.ajax({ // make sure jquery-1.7.1.min.js is loaded in the html header for this to work
        type: 'post',
        cache: false,
        url: dbServer.mainpath+'php/save_data_append.php', // IMPORTANT: change the php script to link to the directory of your server where you want to store the data!
        data: {
        filename: filename,
        filedata: filedata
        },
    });
  };

  save_data_xhr(name, data){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', dbServer.mainpath+'php/write_data_csv.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
  }
  get_rank_from_db(){
    
  }

  save_file_to_jatos(data) {
    return new Promise(function (resolve) {
      const blob = new Blob(data, { type: 'audio/webm; codecs=opus' });
      // create URL from the audio blob, which is used to replay the audio file (if allow_playback is true)
      let url = URL.createObjectURL(blob);
      // use the trial number as the file name
      var filename = trial_count.toString() + ".webm";
      jatos.uploadResultFile(blob, filename);
      // need to pass an object with the URL and data string to the onRecordingFinish function
      // - url allows the audio to be replayed if playback is true
      // - str is used to either save the audio data as base64 string or save the filename to the jsPsych trial data
      var trial_data = { url: url, str: filename };
      resolve(trial_data);
    });
  }
}