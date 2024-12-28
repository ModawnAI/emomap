const trlib=new jsTrialLibrary();
const exp=new jsExperiment('emomapAll');

exp.taskcode='01234'
exp.researcherID='emomap202411';
exp.projectID='emomap202411';
exp.nickname='모모님';
exp.gender='모모님';
exp.age='모모님';

exp.append_mode='promise';
env.use_audioguide_flag=true;
env.debug_display_border=false;

exp.tasklist = {
  	stroopemo: true,
	flankeremo: true,
	stopemo: true,
	nbackemo: true,
	emobias: true,
	dotprobe: true
}
exp.todolist = Object.assign({
	intro: true,
	askenv: true,
	register: true,
	//consent: false,
	speakaloud: false,
	speechrecog: false,
}, exp.tasklist);

// exp.schedule = ['emobias', 'dotprobe'];
exp.schedule = [
	'nbackemo',
	'emobias',
	'flankeremo',
	'stroopemo',
	'stopemo',
	'dotprobe',
];
//exp.schedule='random-all';

let testcode = '-' + exp.taskcode;
let level = 0;

let options = {
	background: '../../../assets/img/etc/consent_bg.png',
	background_size: 'keepratio',//'contain', //keep ratio
	background_position: 'center center',
	background_color: '',
	background_linear: 'linear-gradient(to bottom, #caefff 39.5%, #ebf69e 20.5%)'
};
exp.set_default_options(options);

let options_day = {
	background: '../../map/cogmap1.gif',
	background_size: 'keepratio',//'contain', //keep ratio
	background_position: 'center center',
	background_color: '#abbca8'
};

//음성으로 설명할지 여부 문의, 풀스크린 문의
exp.add_env_page(options_day);

//소개글
let pages = [
	'<p class ="font-message-trial">주의력 탐험의 첫 게임을 시작합니다. </p>',
	'<p class ="font-message-trial">각 과제를 완료하면 마음지도의 빈 공간이 채워집니다. </p>'
];
exp.add_page(pages, options_day);
//exp.add_page_delay(pages,[5000, 5000, 5000, 5000]); //정해진 시간 후에 자동으로 설명문 진행됨..

let page_endofeachtask = [
	'<p class="font-message-trial">%NICKNAME%님의 마음지도에 새로운 정보가 채워졌어요.</p>',
];
let pages_nextoftask = [
	'<p class="font-message-trial">주의력 탐험의 다음 목적지로 떠나 볼까요?</p>',
];
let pages_endoftask = [
	'<p class ="font-message-trial">수고하셨습니다. <br> 전두엽 마을의 탐험이 완료되어 주의력 지도가 완성되었습니다.</p>'
];
let pages_finishoftask = {
    type: "unified-button-response",
    stimulus_type: "html",
    stimulus: '<p class="font-message-trial">메인화면의 마음섬 탐험 결과보기에서 완성된 지도를 확인하세요.</p>',
    speech_text:jsFunc.html2text('<p class="font-message-trial">메인화면의 마음섬 탐험 결과보기에서 완성된 지도를 확인하세요.</p>'), 
    button_html: uxm.button_finish,
    on_start:function(trial){
        trial.stimulus=exp.replace_nickname(trial.stimulus);        
        trial.speech_text=exp.replace_nickname(trial.speech_text);   
    },
}

exp.unset_default_options();// 디폴트 세팅 해제 필요시..

level=1;
let work={};
let lasttrial=false;

for (let tnum=0; tnum<exp.schedule.length; tnum++){
	work = {}; for (key in exp.todolist) work[key] = false;
	key = exp.schedule[tnum];
	if (!exp.todolist.hasOwnProperty(key)) continue;
	if (exp.todolist[key]) work[key] = true;
	if (tnum == exp.schedule.length - 1) lasttrial = true;

	if (work.nbackemo) {
		const nback = new jsNBack('emonback', '../../games/nback_emo/', 'nback' + testcode);
		nback.nickname = '정서작업기억';
		nback.level_info = level + '단계';
		nback.create_task_trial();
		let images = [];
		let prefixes = ['A', 'G', 'H','S'];
		let numImages = 4;
		for (let i = 1; i <= numImages; i++) {
			prefixes.forEach(function(prefix) {
				let imageName = 'img/' + prefix + i + '.png';
				images.push(imageName);
			});
		}
		nback.set_trial_variables({ stimulus_duration:1500,trial_duration:2500,stimulus_height: 500,stimuli_set:images});
		nback.set_task_variables({ instruction_keyword: '전전에 나온 표정을 찾으세요',sequence_length:5 });
		exp.add_task(nback);
		options = {
			background: '../../map/cogmap2.gif',
			background_size: 'keepratio',//'contain', //keep ratio
			background_position: 'center center',
			background_color: '#abbca8'
		};
		exp.add_page(page_endofeachtask, options);    
		if (lasttrial) {
			exp.add_page(pages_endoftask, options);
			exp.add_page(pages_finishoftask, options);      
		}else {
			exp.add_page(pages_nextoftask, options);      
		}    
    	level++;
	}

	if (work.flankeremo) {
		const flanker = new jsFlanker('flanker', '../../games/flanker_emo/', 'flanker' + testcode);

		flanker.background_size = 'keepratio';
		flanker.background_position = 'center center';
		flanker.background_linear = 'linear-gradient(#91b54b 14.5%, #a2e3df 14.5%, #83d1d0 91%, #91b54b 9%)';

		flanker.nickname = '정서주의력';
		flanker.level_info = level + '단계';
		flanker.create_task_trial();
		flanker.set_trial_variables({
			stimulus_duration:500,
			trial_duration:1500,
			stimulus_height:90,
			stimulus_width:450,
			user_stim_style_flag:true,
			response_choices: ['../../../assets/img/button/sad_str.png', '../../../assets/img/button/happy_str.png']
		});
		flanker.set_task_variables({sequence_length:30, instruction_keyword: '가운데 얼굴그림의 표정을 보고 빠르게 버튼을 누르세요', });
		exp.add_task(flanker);
		options = {
			background: '../../map/cogmap3.gif',
			background_size: 'keepratio',//'contain', //keep ratio
			background_position: 'center center',
			background_color: '#abbca8'
		};
		exp.add_page(page_endofeachtask, options);
		if (lasttrial) {
			exp.add_page(pages_endoftask, options);
			exp.add_page(pages_finishoftask, options);
		}else {
			exp.add_page(pages_nextoftask, options);
		}
		level++;
	}

	if (work.stroopemo) {
		const stroop = new jsStroop('stroop', '../../games/stroop_emo/', 'stroop' + testcode);

		stroop.background_size = 'keepratio';
		stroop.background_position = 'center';
		stroop.background_linear = 'linear-gradient(rgb(233, 233, 233) 59.5%, rgb(227, 181, 147) 40.5%)';

		stroop.nickname = '정서인지억제';
		stroop.level_info = level + '단계';
		stroop.create_task_trial();
		const faces=['angry','sad','neutral','happy'];
		const texts=['angry','sad','neutral','happy'];
		const rulestr=['text','face']; // 테이블 칼럼 이름으로 salient/unsalient 순임.
		const butt=['./img/button_angry.png','./img/button_sad.png','./img/button_neutral.png','./img/button_happy.png']; //순서가 unsalient 와 같아야 함.
		const randomorder=['angryangry_f1','angrysad_m1','angryneutral_f2','angryhappy_m2',
			'sadangry_f1','sadsad_m1','sadneutral_f2','sadhappy_m2',
			'neutralangry_f1','neutralsad_m1','neutralneutral_f2','neutralhappy_m2',
			'happyangry_f1','happysad_m1','happyneutral_f2','happyhappy_m2'
		];// salient x unsalient examples for random
		stroop.create_task_trial();
		stroop.set_trial_variables({stimulus_duration:1500,trial_duration:3000,stimulus_height:500,stimulus_width:400,user_stim_style_flag:true, response_choices:butt,unsalient:faces,salient:texts,rulestr:rulestr,random_conditions:randomorder});
		stroop.set_task_variables({instruction_keyword:'얼굴표정을 찾아보세요'});
		exp.add_task(stroop);
		options = {
			background: '../../map/cogmap4.gif',
			background_size: 'keepratio',//'contain', //keep ratio
			background_position: 'center center',
			background_color: '#abbca8'
		};
		exp.add_page(page_endofeachtask, options);    
		if (lasttrial) {
			exp.add_page(pages_endoftask, options);
			exp.add_page(pages_finishoftask, options);      
		}else {
			exp.add_page(pages_nextoftask, options);      
		}    
    	level++;
	}

	if (work.stopemo) {
		sequence_ext = undefined;
		const stop = new jsStop('stop', '../../games/stop-emo/', 'stop' + testcode);
		stop.nickname = '정서반응억제';
		stop.level_info = level + '단계';
		stop.create_task_trial();
		stop.set_trial_variables({ stimulus_duration: 1000, trial_duration: 2000, stimulus_width: 300, stimulus_height: 334 });
		stop.set_task_variables({ sequence_length: 8, instruction_keyword: '화난 얼굴이 나오면 멈추세요', });
		exp.add_task(stop);
		options = {
			background: '../../map/cogmap5.gif',
			background_size: 'keepratio',//'contain', //keep ratio
			background_position: 'center center',
			background_color: '#abbca8'
		};
		exp.add_page(page_endofeachtask, options);    
		if (lasttrial) {
			exp.add_page(pages_endoftask, options);
			exp.add_page(pages_finishoftask, options);      
		}else {
			exp.add_page(pages_nextoftask, options);      
		}    
    	level++;
	}

	if (work.emobias) {
		sequence_ext = undefined;
		const emobias = new jsEmoBias('emobias', '../../games/emobias/', 'emobias' + testcode);

		emobias.background_color = '#b6d87c';
		emobias.background_size = 'keepratio';
		emobias.background_position = 'center top';

		emobias.nickname = '정서편향';
		emobias.level_info = level + '단계';
		emobias.create_task_trial();
		emobias.set_trial_variables({
			stimulus_duration: 4000,
			trial_duration: 5000,
			stimulus_height:60,
			response_ends_trial:true
		});
		emobias.set_task_variables({
			sequence_length:30,
			instruction_keyword: '긍정적인 표정이 많은지, 부정적인 표정이 많은지 살펴보세요'
		});

		exp.add_task(emobias);
		options = {
			background: '../../map/cogmap6.gif',
			background_size: 'keepratio',
			background_position: 'center center',
			background_color: '#abbca8'
		};
		exp.add_page(page_endofeachtask, options);
		if (lasttrial) {
			exp.add_page(pages_endoftask, options);
			exp.add_page(pages_finishoftask, options);
		} else {
			exp.add_page(pages_nextoftask, options);
		}
		level++;
	}

	if (work.dotprobe) {
		const dotprobe = new jsDotProbe('dotprobe', '../../games/dotprobe/', 'dotprobe' + testcode);

		dotprobe.background_color = '#b6d87c';
		dotprobe.background_size = 'keepratio';
		dotprobe.background_position = 'center top';

		dotprobe.nickname = '정서주의전환';
		dotprobe.level_info = level + '단계';
		dotprobe.create_task_trial();
		dotprobe.set_trial_variables({
			stimulus_duration:500,
			trial_duration:2500,
			stimulus_height:50,
			response_ends_trial:true
		});
		dotprobe.set_task_variables({
			sequence_length:40,
			instruction_keyword: '점의 위치를 빠르게 찾아보세요'
		});
		exp.add_task(dotprobe);
		options = {
			background: '../../map/cogmap7.gif',
			background_size: 'keepratio',//'contain', //keep ratio
			background_position: 'center center',
			background_color: '#abbca8'
		};
		exp.add_page(page_endofeachtask, options);    
		if (lasttrial) {
			exp.add_page(pages_endoftask, options);
			exp.add_page(pages_finishoftask, options);      
		}else {
			exp.add_page(pages_nextoftask, options);      
		}    
    level++;
	}


}
function task_close(){
  self.close();
}

exp.run_all();
