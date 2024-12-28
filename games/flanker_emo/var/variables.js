var welcome_msg = '%GUIDE%'+'%WELCOME_LOGO%'+
'<p style="color: black; font-size: 24pt;"> 플랭커 게임을 시작합니다.<br>'+
'이 과제에서는 정서 주의력을 측정합니다.<br></p>';

var instruction_msg1 = `%GUIDE%
<p style="color: black; font-size: 24pt;"> 
	<img src="img/demo1.png" class="img-demo" class="img-desc" style="width: auto; height: 100px;"/><br>
	위에 보이는 것 처럼 얼굴그림이 나올 때마다,<br>
	가운데에 있는 얼굴그림이 나타내는 표정에 알맞은 버튼을 누르십시오.
</p>
<p>
	슬픈 표정이면 ,<img src="%IMAGEPATH%button/sad_str.png" alt="슬픔" class="img-desc"/> 버튼을 누르고,<br />
	기쁜 표정이면, <img src="%IMAGEPATH%button/happy_str.png" alt="기쁨" class="img-desc" /> 버튼을 누르세요.<br>
        컴퓨터에서 이 게임을 하신다면 키보드를 사용하여 부정적 표정은 <strong>J</strong>,  <br>
        긍정적 표정은 <strong>K</strong>를 누르세요. <br>
</p>`;

var instruction_msg2 = `%GUIDE%
<p>
	<img src="img/congruent2.png" alt="이런 그림" class="img-demo" class="img-desc" style="width: auto; height: 100px;" />이 나오면,<br>
	가운데 얼굴이 기쁜 표정이므로,<br>
	<img src="%IMAGEPATH%button/happy_str.png" alt="기쁨" class="img-desc" /> 버튼을 누릅니다.<br>
	<img src="img/incongruent1.png" alt="이런" class="img-demo" class="img-desc" style="width: auto; height: 100px;"/>이 나오면,<br>
	가운데 얼굴이 슬픈 표정이므로,<br>
	<img src="%IMAGEPATH%button/sad_str.png" alt="슬픔" class="img-desc" /> 버튼을 누르세요.
</p>`;

var ready_msg = `%GUIDE%
<p>
	가운데 얼굴그림의 표정을 보고 버튼을 빨리 누르세요.
</p>
<p>
	주변에 있는 얼굴그림은 중요하지 않습니다.<br>
	준비가 되셨으면 시작버튼을 눌러주세요.
</p>`;

var sequence_ext = 'sequence,stimulus,stim_id,stim_type,correct_response,response_type \n\
1,incongruent1,2,i,0,sad\n\
2,incongruent1,2,i,0,sad\n\
3,congruent2,1,c,1,happy\n\
4,congruent1,0,c,0,sad\n\
5,congruent2,1,c,1,happy\n\
6,congruent2,1,c,1,happy\n\
7,incongruent2,3,i,1,happy\n\
8,incongruent1,2,i,0,sad\n\
9,congruent2,1,c,1,happy\n\
10,incongruent2,3,i,1,happy\n\
11,congruent2,1,c,1,happy\n\
12,congruent1,0,c,0,sad\n\
13,incongruent2,3,i,1,happy\n\
14,congruent1,0,c,0,sad\n\
15,congruent2,1,c,1,happy\n\
16,congruent1,0,c,0,sad\n\
17,incongruent2,3,i,1,happy\n\
18,congruent1,0,c,0,sad\n\
19,incongruent2,3,i,1,happy\n\
20,congruent1,0,c,0,sad\n\
21,congruent2,1,c,1,happy\n\
22,congruent2,1,c,1,happy\n\
23,congruent1,0,c,0,sad\n\
24,incongruent1,2,i,0,sad\n\
25,incongruent1,2,i,0,sad\n\
26,congruent1,0,c,0,sad\n\
27,congruent2,1,c,1,happy\n\
28,congruent1,0,c,0,sad\n\
29,congruent2,1,c,1,happy\n\
30,congruent1,0,c,0,sad';

sequence_ext=jsFunc.csvJSON(sequence_ext)
sequence_ext=sequence_ext.slice(0, 5);