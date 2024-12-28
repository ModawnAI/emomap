class jsUXModules {
    constructor (rootpath) {
       this.html_ask_pretest_msg='<p class="font-message">연습해 보시겠습니까?</p>';        
       this.html_ask_retest_msg='<p class="font-message" >다시 하시겠습니까?</p>';
       this.html_ask_audioguide_msg='<p class="font-message">오디오 가이드를 사용하시는 것이 이해가 빠릅니다.<br>오디오를 사용하시겠습니까?</p>';             
       this.html_noresponse_msg='<p class="font-message" style="color:red">%NICKNAME%, 반응이 늦었네요.<br>집중해 주세요.<br>다시 하겠습니다.</p>';
       this.html_end_msg = "<p>참여해 주셔서 감사합니다.</p>";  
       this.html_pause_msg = "<p>%NICKNAME%, 잠시 쉬었다가 하시겠습니다.<br> 준비되셨으면 버턴을 눌러주세요.</p>";      
       this.html_warning_msg='<p class="font-message">%NICKNAME%, 어려우신가요? <br>다시 하겠습니다.</p>';   
       this.html_ask_arousal_msg='<p>현재 당신의 각성 상태는 어떠합니까?</p>';
       this.html_ask_valence_msg='현재 당신의 감정 상태는 어떠합니까?';
       this.html_full_screen_msg = '<p>다음 버턴을 누르면 전체 화면 보기로 넘어 갑니다. </p>';
       this.html_informed_consent_text = '<p> 다음 실험에 참가하는 것을 동의합니다. </p>';
       this.retest_notice_msg="수고하셨습니다. 한번 더 하겠습니다. 준비 되셨으면 시작을 눌러 주세요";
       this.not_supported_page = ["<p>이 과제를 하기 위해서는 크롬이나 파이어폭스를 추천합니다.</p>",];
       this.debrief_msg='<p class="font-message">결과는 다음과 같습니다.</p>';     
       this.ask_subjID_msg= '<p class="font-message">등록번호를 넣으세요.</p>';
       this.consent_html="external_consent_page.html";
       this.ask_age_msg = '<p class="font-message">나이:</p>';
       this.ask_gender_msg = '<p class="font-message">성별:</p>';
       this.ask_gender_options = ['남자','여자'];
       this.guide_image="guide.gif";
       this.test_ready_choices=["시작"];
       this.button_consent = '<p class="font-message">동의합니다</p>';
       this.audioguide_msg=null;
       this.html_screen_info=null;
       this.html_screeninfo_msg = window_info();
       this.init(rootpath);     
    }

    init(rootpath){
        this.audiopath=`${rootpath}sound/`;
        this.imagepath=`${rootpath}img/`;
        //
        this.image_button_goodjob=`${this.imagepath}etc/goodjob.png`;
        this.image_button_left=`${this.imagepath}button/left.png`;
        this.image_button_right=`${this.imagepath}button/right.png`;
        this.image_button_true=`${this.imagepath}button/true.png`;
        this.image_button_false=`${this.imagepath}button/false.png`;
        this.image_button_yes=`${this.imagepath}button/press_yes.png`;
        this.image_button_no=`${this.imagepath}button/press_no.png`;
        this.image_rh_press=`${this.imagepath}button/arrow_right_rhpress.png`;
        this.image_lh_press=`${this.imagepath}button/arrow_left_lhpress.png`;
        this.image_button_next=`${this.imagepath}button/next.png`;
        this.image_button_prev=`${this.imagepath}button/prev.png`;
        this.image_button_start=`${this.imagepath}button/start.png`;
        this.image_button_yes_kor=`${this.imagepath}button/yeskor.png`;
        this.image_button_no_kor=`${this.imagepath}button/nokor.png`;
        this.image_button_retry_kor=`${this.imagepath}button/replay.png`;
        this.image_button_finish_kor=`${this.imagepath}button/finish.png`;
        this.image_button_congruent=`${this.imagepath}button/congruent.png`;
        this.image_button_incongruent=`${this.imagepath}button/incongruent.png`;
        this.image_button_symmetric=`${this.imagepath}button/symmetric.png`;
        this.image_button_asymmetric=`${this.imagepath}button/asymmetric.png`;
        this.image_button_negative=`${this.imagepath}button/button_negative_kor.png`;
        this.image_button_positive=`${this.imagepath}button/button_positive_kor.png`;
        // SOUND DEFAULT
        this.sound_button_press=`${this.audiopath}tong-stimulus.wav`;
        this.sound_stimulus_presented=`${this.audiopath}tong-146721.wav`;
        this.sound_feedback_correct = `${this.audiopath}dingdongdaeng.mp3`;
        this.sound_feedback_incorrect=`${this.audiopath}clickpyong.mp3`;
        this.sound_test_end1=`${this.audiopath}dingdongdaeng.mp3`;
        this.sound_test_end=`${this.audiopath}ye.mp3`;//titididing.mp3
        this.sound_show_result=`${this.audiopath}theeek.mp3`;

        this.agreement_five_choices=["disagreestrong.png","disagree.png","neutral.png","agree.png","agreestrong.png"];
        this.scale_five_choices=["ckey_1.png","ckey_2.png","ckey_3.png","ckey_4.png","ckey_5.png"];

        this.agreement_four_choices=["disagreestrong.png","disagree.png","agree.png","agreestrong.png"];
        this.scale_four_choices=["ckey_1.png","ckey_2.png","ckey_4.png","ckey_5.png"];

        this.buttonpath=`${this.imagepath}button/`;
        this.agreement_five_choices.forEach((element,i)=> this.agreement_five_choices[i]=this.buttonpath+element ); //add localpath
        this.scale_five_choices.forEach((element,i)=> this.scale_five_choices[i]=this.imagepath+element ); //add localpath

        this.agreement_four_choices.forEach((element,i)=> this.agreement_four_choices[i]=this.buttonpath+element ); //add localpath
        this.scale_four_choices.forEach((element,i)=> this.scale_four_choices[i]=this.imagepath+element ); //add localpath


        this.html_goodjob_msg=`<p class="font-message">수고하셨습니다.<br><img src="${this.image_button_goodjob}" align="middle" style="width:150px;"></p>`;
        this.html_goodbye_msg=`<p class="font-message">또 만나요.</p><img src=" ${this.imagepath}bye.gif height=50%">`
      
        this.button_next='<button class="webrain-btn btn-next"><img src="'+ this.image_button_next + '" alt="다음" /></button>'
        this.button_prev='<button class="webrain-btn btn-prev"><img src="'+ this.image_button_prev + '" alt="이전" /></button>'
        this.button_start='<button class="webrain-btn btn-start"><img src="'+this.image_button_start+ '" alt="시작" /></button>'
        
        // BUTTONS
        this.pretest_answer_buttons=[
            '<button class="webrain-btn btn-retry-kor"><img src="'+ this.image_button_yes_kor+'" alt="예" /></button>',
            '<button class="webrain-btn btn-finish-kor"><img src="'+ this.image_button_no_kor+'" alt="아니오" /></button>',
        ];
        
        this.retest_notice_button=[
            '<button class="webrain-btn btn-start"><img src="'+ this.image_button_start+'" alt="시작"></button>',
        ];
        
        this.audioguide_answer_buttons=[
            '<button class="webrain-btn btn-yes-kor"><img src="'+ this.image_button_yes_kor+'" alt="예" /></button>',
            '<button class="webrain-btn btn-no-kor"><img src="'+ this.image_button_no_kor+'" alt="아니오" /></button>',
        ];
        
        this.retest_answer_buttons=[
            '<button class="webrain-btn btn-retry-kor"><img src="'+ this.image_button_retry_kor+'" alt="다시하기" /></button>',
            '<button class="webrain-btn btn-finish-kor"><img src="'+ this.image_button_finish_kor+'" alt="마치기" /></button>',
        ];
        this.yes_no_buttons=[
            '<button class="webrain-btn btn-yes-kor"><img src="'+ this.image_button_yes_kor+'" alt="예" /></button>',
            '<button class="webrain-btn btn-no-kor"><img src="'+ this.image_button_no_kor+'" alt="아니오" /></button>',
        ];
        this.neg_pos_buttons=[
            '<button class="webrain-btn btn-yes-kor"><img src="'+ this.button_negative_kor+'" alt="부정" /></button>',
            '<button class="webrain-btn btn-no-kor"><img src="'+ this.button_positive_kor+'" alt="긍정" /></button>',
        ];
        this.sym_asym_buttons=[
            '<button class="webrain-btn btn-symmetric"><img src="'+ this.image_button_symmetric+'" alt="대칭" /></button>',
            '<button class="webrain-btn btn-asymmetric"><img src="'+ this.image_button_asymmetric+'" alt="비대칭" /></button>',
        ];

        this.button_finish='<button class="webrain-btn btn-finish-kor" onclick="task_close();"><img src="'+ this.image_button_finish_kor+'" alt="마치기" /></button>'

        this.preload_audio=[];
        this.preload_audio=this.preload_audio.concat(this.sound_button_press,this.sound_stimulus_presented,this.sound_feedback_correct,this.sound_feedback_incorrect,this.sound_test_end);
        this.preload_images=[];        
        this.preload_images=this.preload_images.concat(this.image_button_yes_kor,this.image_button_no_kor,this.image_button_goodjob);
        this.preload_images=this.preload_images.concat(this.image_button_next,this.image_button_prev,this.image_button_start);
        this.preload_video=[];
    }
}