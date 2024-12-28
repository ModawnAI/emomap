var welcome_msg = '%GUIDE%'+'%WELCOME_LOGO%'+
'<p>스트룹 게임을 시작합니다. <br>'+
'이 과제는 %NICKNAME%의 <strong>인지적반응 억제력</strong>을 평가합니다.</p>';

var instruction_msg1 = `%GUIDE%
<p>
	<img src="../../games/stroop_emo/img/stroop_demo.png" class="img-demo" /><br>
  위의 그림처럼 얼굴 속에 글자가 적혀 있습니다.<br>
  이 글자의 뜻은 중요하지 않습니다.<br>
  얼굴에 나타난 표정을 확인하세요.<br>
  현재 상황에서는
   <img src="%IMAGEPATH%button/button_angry.png" alt="분노" class="img-desc img-desc-01" />
   <img src="%IMAGEPATH%button/button_sad.png" alt="슬픔" class="img-desc img-desc-01" />
   <img src="%IMAGEPATH%button/button_neutral.png" alt="무표정" class="img-desc img-desc-01" />
   <img src="%IMAGEPATH%button/button_happy.png" alt="행복" class="img-desc img-desc-01" />
  버튼을 눌러야 합니다.<br>
  얼굴표정이 행복에 해당하기 때문입니다.<br>
  얼굴 표정은 "분노, 슬픔, 무표정, 행복" 네 가지가 나타납니다.<br>
  <img src="../../games/stroop_emo/img/stroop_emotions.png" class="img-demo" />

</p>`;

var ready_msg = `%GUIDE%
<p>
  시작하겠습니다.<br>
  얼굴표정을 확인하고 버튼을 빨리 누르세요</br>
  새로운 얼굴표정이 나오기 전에는 항상 화면의 가운데에 나오는 <strong>+</strong> 를 보고 계세요.<br>
  준비되셨으면 시작 버튼을 눌러주세요. %NICKNAME%, 화이팅!
</p>`;

var sequence_ext = 'trial_nr,stimulus,text,face,stim_type \n\
1,angryangry_f1.png,angry,angry,c\n\
2,sadsad_m1.png,sad,sad,c\n\
3,happysad_f2.png,happy,sad,i\n\
4,angryangry_m2.png,angry,angry,c\n\
5,neutralneutral_f2.png,neutral,neutral,c\n\
6,neutralsad_f1.png,neutral,sad,i\n\
7,happyneutral_m1.png,happy,neutral,i\n\
8,sadangry_m2.png,sad,angry,i\n\
9,happyhappy_m1.png,happy,happy,c\n\
10,angryangry_f2.png,angry,angry,c\n\
11,angryhappy_f1.png,angry,happy,i\n\
12,sadsad_m1.png,sad,sad,c\n\
13,angryangry_m2.png,angry,angry,c\n\
14,sadhappy_f1.png,sad,happy,i\n\
15,angryneutral_m2.png,angry,neutral,i\n\
16,angryangry_m1.png,angry,angry,c\n\
17,neutralhappy_f2.png,neutral,happy,i\n\
18,angryangry_m2.png,angry,angry,c\n\
19,sadsad_f1.png,sad,sad,c\n\
20,neutralneutral_f1.png,neutral,neutral,c\n\
21,neutralhappy_m2.png,neutral,happy,i\n\
22,sadneutral_f2.png,sad,neutral,i\n\
23,happyhappy_f1.png,happy,happy,c\n\
24,sadsad_f2.png,sad,sad,c\n\
25,sadsad_f1.png,sad,sad,c\n\
26,sadhappy_m2.png,sad,happy,i\n\
27,neutralangry_f1.png,neutral,angry,i\n\
28,angryhappy_f2.png,angry,happy,i\n\
29,neutralneutral_m1.png,neutral,neutral,c\n\
30,angryneutral_f1.png,angry,neutral,i\n\
31,sadsad_f2.png,sad,sad,c\n\
32,neutralneutral_m2.png,neutral,neutral,c\n\
33,neutralsad_f2.png,neutral,sad,i\n\
34,neutralneutral_m2.png,neutral,neutral,c\n\
35,happyhappy_f2.png,happy,happy,c\n\
36,sadsad_m2.png,sad,sad,c\n\
37,neutralangry_f2.png,neutral,angry,i\n\
38,neutralneutral_m1.png,neutral,neutral,c\n\
39,angrysad_m2.png,angry,sad,i\n\
40,happyangry_m1.png,happy,angry,i\n\
41,sadangry_f1.png,sad,angry,i\n\
42,happysad_f2.png,happy,sad,i\n\
43,happyangry_f1.png,happy,angry,i\n\
44,happyhappy_m2.png,happy,happy,c\n\
45,angryangry_f1.png,angry,angry,c\n\
46,angrysad_f1.png,angry,sad,i\n\
47,happyneutral_m2.png,happy,neutral,i\n\
48,happyangry_m2.png,happy,angry,i\n\
49,neutralhappy_m1.png,neutral,happy,i\n\
50,happyneutral_f1.png,happy,neutral,i\n\
51,neutralsad_f2.png,neutral,sad,i\n\
52,neutralangry_m1.png,neutral,angry,i\n\
53,happyhappy_f2.png,happy,happy,c\n\
54,happysad_m2.png,happy,sad,i';

sequence_ext=jsFunc.csvJSON(sequence_ext)
sequence_ext=sequence_ext.slice(0, 5);