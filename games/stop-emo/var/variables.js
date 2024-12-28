var welcome_msg = '%GUIDE%'+'%WELCOME_LOGO%'+
'<p>화살표 게임을 시작합니다.</p>'+
'<p>이 게임에서는 당신의 <span style="font-weight: bold;">운동반응 억제 능력</span>을 측정합니다.</p>';

var instruction_msg1 = `%GUIDE%
<p>
  <img src="img/demo_go.png" class="img-demo" /><br>
  웃는얼굴은 <strong> 방향신호 </strong>입니다.<br>
  화면의 중앙에 남자의 웃는얼굴이 나타나면 왼쪽 화살표 버튼, <br>
  여자의 웃는 얼굴이 나타나면 오른쪽 화살표 버튼을 빠르게 누르세요. <br>
  컴퓨터에서 이 게임을 하신다면 키보드를 사용하여 왼쪽 화살표는 <strong>J</strong>,  <br>
  오른쪽 화살표는 <strong>K</strong>를 누르세요. <br>
  이 게임에서는 속도가 매우 중요하기 때문에, 마우스를 사용하면 좋은 점수를 받기 힘듭니다.<br>
</p>`;

var instruction_msg2 = `%GUIDE%
<p>
  <img src="img/demo_stop.gif" class="img-demo" /><br>
  웃는얼굴이 화난얼굴로 변하는 것은 <strong> 멈춤신호 </strong>라고 합니다.<br>
  멈춤 신호에는 모든 동작을 멈추어야 하므로 버튼을 누르지 마세요.<br>
  얼굴표정이 바뀌는 것에 주의하면서, <br> 웃는얼굴에는 빨리 화살표 방향 버튼을 눌러야 합니다.<br>
</p>`;

var ready_msg = '%GUIDE%'+'<p> 화살표의 방향을 최대한 빠르고 정확하게 판단하세요.<br>'+
'그러나 화난얼굴로 변할 때는 화살표는 누르면 안됩니다.<br></p>'+
'키보드를 사용하신다면 영어로 바꾸어 놓고 시작하세요.<br>'+
'<p>준비되셨으면 시작 버튼을 누르세요.</p>';

// we use only stim_direction,SSD,stim_condition
var sequence_ext = 'block_number,trial_number,stim_direction,SSD,stim_condition \n\
1,1,left,200,go \n\
1,2,right,200,go \n\
1,3,left,200,go \n\
1,4,left,200,go \n\
1,5,left,200,stop \n\
1,6,right,150,go \n\
1,7,right,150,stop \n\
1,8,right,200,go \n\
1,9,right,200,go \n\
1,10,left,200,go \n\
1,11,right,200,stop \n\
1,12,right,150,go \n\
1,13,right,150,go \n\
1,14,left,150,stop \n\
1,15,left,200,go \n\
1,16,left,200,go \n\
1,17,right,200,go \n\
1,18,right,200,go \n\
1,19,left,200,go \n\
1,20,left,200,go \n\
1,21,right,200,go \n\
1,22,left,200,stop \n\
1,23,right,250,stop \n\
1,24,left,200,go \n\
1,25,right,200,go \n\
1,26,left,200,go \n\
1,27,left,200,stop \n\
1,28,left,250,go \n\
1,29,left,250,go \n\
1,30,right,250,stop \n\
1,31,right,300,go \n\
1,32,right,300,go \n\
2,1,left,300,go \n\
2,2,left,300,stop \n\
2,3,right,350,go \n\
2,4,left,350,go \n\
2,5,right,350,go \n\
2,6,right,350,stop \n\
2,7,right,300,go \n\
2,8,left,300,go \n\
2,9,left,300,go \n\
2,10,left,300,go \n\
2,11,left,300,go \n\
2,12,right,300,go \n\
2,13,left,300,stop \n\
2,14,right,250,stop \n\
2,15,right,200,go \n\
2,16,right,200,go \n\
2,17,left,200,go \n\
2,18,right,200,stop \n\
2,19,left,250,stop \n\
2,20,left,300,go \n\
2,21,right,300,go \n\
2,22,right,300,go \n\
2,23,left,300,go \n\
2,24,right,300,go \n\
2,25,right,300,go \n\
2,26,right,300,go \n\
2,27,left,300,go \n\
2,28,right,300,go \n\
2,29,left,300,go \n\
2,30,left,300,go \n\
2,31,right,300,stop \n\
2,32,left,250,stop \n\
2,33,right,300,stop \n\
2,34,right,350,go \n\
2,35,right,350,go \n\
2,36,right,350,go \n\
2,37,left,350,stop \n\
2,38,left,300,go \n\
2,39,left,300,go \n\
2,40,left,300,go \n\
2,41,left,300,go \n\
2,42,right,300,stop \n\
2,43,right,350,go \n\
2,44,right,350,go \n\
2,45,left,350,go \n\
2,46,left,350,go \n\
2,47,right,350,go \n\
2,48,left,350,stop \n\
2,49,right,300,go \n\
2,50,left,300,go \n\
2,51,right,300,go \n\
2,52,right,300,go \n\
2,53,right,300,stop \n\
2,54,left,350,go \n\
2,55,left,350,go \n\
2,56,left,350,stop \n\
2,57,right,300,stop \n\
2,58,left,350,go \n\
2,59,right,350,go \n\
2,60,left,350,go \n\
2,61,right,350,go \n\
2,62,left,350,stop \n\
2,63,right,300,go \n\
2,64,left,300,go \n\
3,1,right,300,stop \n\
3,2,right,350,go \n\
3,3,right,350,go \n\
3,4,left,350,stop \n\
3,5,left,300,go \n\
3,6,left,300,go \n\
3,7,right,300,go \n\
3,8,left,300,go \n\
3,9,left,300,go \n\
3,10,left,300,go \n\
3,11,left,300,stop \n\
3,12,right,250,go \n\
3,13,right,250,go \n\
3,14,left,250,go \n\
3,15,right,250,go \n\
3,16,right,250,stop \n\
3,17,right,200,stop \n\
3,18,left,250,go \n\
3,19,right,250,go \n\
3,20,left,250,stop \n\
3,21,left,300,go \n\
3,22,left,300,go \n\
3,23,right,300,go \n\
3,24,right,300,go \n\
3,25,left,300,go \n\
3,26,left,300,stop \n\
3,27,left,250,go \n\
3,28,right,250,go \n\
3,29,right,250,go \n\
3,30,right,250,go \n\
3,31,left,250,go \n\
3,32,right,250,stop \n\
3,33,left,200,go \n\
3,34,left,200,stop \n\
3,35,right,250,go \n\
3,36,right,250,go \n\
3,37,right,250,go \n\
3,38,left,250,go \n\
3,39,right,250,stop \n\
3,40,left,300,go \n\
3,41,left,300,go \n\
3,42,right,300,go \n\
3,43,right,300,go \n\
3,44,left,300,go \n\
3,45,left,300,stop \n\
3,46,left,250,go \n\
3,47,right,250,stop \n\
3,48,right,300,go \n\
3,49,left,300,go \n\
3,50,left,300,stop \n\
3,51,left,250,go \n\
3,52,right,250,go \n\
3,53,right,250,stop \n\
3,54,right,300,go \n\
3,55,right,300,go \n\
3,56,left,300,go \n\
3,57,right,300,go \n\
3,58,left,300,go \n\
3,59,left,300,stop \n\
3,60,left,250,go \n\
3,61,right,250,go \n\
3,62,right,250,stop \n\
3,63,right,300,go \n\
3,64,left,300,go \n\
4,1,left,300,go \n\
4,2,left,300,stop \n\
4,3,right,350,go \n\
4,4,left,350,go \n\
4,5,right,350,go \n\
4,6,left,350,go \n\
4,7,right,350,stop \n\
4,8,right,300,go \n\
4,9,right,300,go \n\
4,10,right,300,go \n\
4,11,left,300,go \n\
4,12,left,300,go \n\
4,13,left,300,go \n\
4,14,right,300,go \n\
4,15,left,300,stop \n\
4,16,right,250,stop \n\
4,17,left,200,go \n\
4,18,right,200,go \n\
4,19,left,200,go \n\
4,20,left,200,go \n\
4,21,right,200,stop \n\
4,22,left,250,stop \n\
4,23,right,200,go \n\
4,24,right,200,go \n\
4,25,right,200,go \n\
4,26,left,200,go \n\
4,27,left,200,go \n\
4,28,right,200,stop \n\
4,29,left,150,stop \n\
4,30,right,200,go \n\
4,31,left,200,go \n\
4,32,right,200,go \n\
4,33,left,200,go \n\
4,34,right,200,stop \n\
4,35,right,250,go \n\
4,36,right,250,go \n\
4,37,left,250,go \n\
4,38,right,250,go \n\
4,39,left,250,go \n\
4,40,left,250,stop \n\
4,41,left,300,go \n\
4,42,left,300,go \n\
4,43,right,300,go \n\
4,44,left,300,stop \n\
4,45,left,350,go \n\
4,46,right,350,stop \n\
4,47,right,300,go \n\
4,48,right,300,go \n\
4,49,left,300,go \n\
4,50,left,300,go \n\
4,51,right,300,go \n\
4,52,left,300,stop \n\
4,53,right,350,go \n\
4,54,right,350,stop \n\
4,55,left,300,go \n\
4,56,right,300,go \n\
4,57,right,300,go \n\
4,58,left,300,go \n\
4,59,left,300,stop \n\
4,60,right,350,go \n\
4,61,right,350,go \n\
4,62,left,350,go \n\
4,63,right,350,stop \n\
4,64,left,300,go \n\
5,1,left,300,go \n\
5,2,right,300,go \n\
5,3,right,300,go \n\
5,4,right,300,go \n\
5,5,left,300,stop \n\
5,6,left,250,go \n\
5,7,left,250,go \n\
5,8,right,250,stop \n\
5,9,right,200,stop \n\
5,10,right,250,go \n\
5,11,right,250,go \n\
5,12,left,250,go \n\
5,13,right,250,go \n\
5,14,left,250,stop \n\
5,15,left,300,go \n\
5,16,left,300,go \n\
5,17,left,300,stop \n\
5,18,right,250,go \n\
5,19,right,250,stop \n\
5,20,left,200,go \n\
5,21,right,200,go \n\
5,22,left,200,go \n\
5,23,left,200,go \n\
5,24,right,200,go \n\
5,25,right,200,go \n\
5,26,left,200,go \n\
5,27,left,200,go \n\
5,28,right,200,go \n\
5,29,left,200,go \n\
5,30,right,200,go \n\
5,31,right,200,stop \n\
5,32,left,250,stop \n\
5,33,left,200,go \n\
5,34,right,200,go \n\
5,35,left,200,go \n\
5,36,right,200,go \n\
5,37,right,200,stop \n\
5,38,left,150,stop \n\
5,39,right,200,go \n\
5,40,left,200,go \n\
5,41,left,200,go \n\
5,42,left,200,stop \n\
5,43,right,250,go \n\
5,44,right,250,stop \n\
5,45,left,200,go \n\
5,46,left,200,go \n\
5,47,right,200,go \n\
5,48,right,200,go \n\
5,49,right,200,go \n\
5,50,right,200,stop \n\
5,51,left,250,go \n\
5,52,left,250,go \n\
5,53,right,250,go \n\
5,54,left,250,stop \n\
5,55,left,200,go \n\
5,56,right,200,go \n\
5,57,right,200,go \n\
5,58,right,200,go \n\
5,59,left,200,stop \n\
5,60,right,250,stop \n\
5,61,right,300,go \n\
5,62,left,300,go \n\
5,63,left,300,go \n\
5,64,left,300,go';

sequence_ext=jsFunc.csvJSON(sequence_ext)
sequence_ext=sequence_ext.slice(0, 5);