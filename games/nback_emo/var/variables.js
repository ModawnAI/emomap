var welcome_msg = '%GUIDE%'+'%WELCOME_LOGO%'+
'<p>표정기억 게임을 시작합니다. <br>'+
'이 게임에서는 %NICKNAME%의 <strong>정서 기억력</strong>을 측정합니다.<br></p>';

var instruction_msg1 = `%GUIDE%
<p>
  한 번에 서로 다른 표정을 짓는 사람들이 순서대로 나옵니다.<br>
  제시되는 표정을 잘 보고 <br> 바로 전이 아니라 그 전전에 나온 표정과 일치하는지 판단합니다. <br>
  사람을 기억하는 것이 아니라, 표정이 전전의 것과 일치하는지 아닌지를 살펴보아야 합니다. <br>
  만일 일치하면 <img src="%IMAGEPATH%button/congruent.png" alt="일치" class="img-desc" /> 버튼을 누르고 <br>
  일치하지 않으면 <img src="%IMAGEPATH%button/incongruent.png" alt="불일치" class="img-desc" /> 버튼을 누르세요.<br>
  컴퓨터에서 이 게임을 하신다면 키보드를 사용하여 불일치는 <strong>J</strong>,  <br>
  일치는 <strong>K</strong>를 누르세요. <br>

</p>`;

var instruction_msg2 = `%GUIDE%
<p>
  <img src="../../games/nback_emo/img/A1.png" class="img-demo"/><img src="../../games/nback_emo/img/H2.png" class="img-demo"/>
  <img src="../../games/nback_emo/img/A3.png" class="img-demo"/><img src="../../games/nback_emo/img/S1.png" class="img-demo"/><br>
  1 번과 2 번 사진에서는 <img src="%IMAGEPATH%button/incongruent.png" alt="불일치" class="img-desc" /> 버튼을 눌러야 합니다.<br>
  이 두 사진은 전전에 제시된 표정이 없기 때문입니다.<br>
  3 번 사진은 전전에 나온 1 번 표정과 일치하므로 <img src="%IMAGEPATH%button/congruent.png" alt="일치" class="img-desc" /> 버튼을 누릅니다. <br>
  4 번 사진은 전전에 나온 2 번 표정과 다르므로 <img src="%IMAGEPATH%button/incongruent.png" alt="불일치" class="img-desc" /> 버튼을 누르세요.
</p>`;


var ready_msg = '%GUIDE%'+
'<p>준비되셨으면 시작 버튼을 누르세요.</p>';

var sequence_ext='stimulus,correct_response,stim_type \n\
H4 ,0,n \n\
A2 ,0,n \n\
H4 ,1,t \n\
G1 ,0,n \n\
A3 ,0,n \n\
G1 ,1,t \n\
S2 ,0,n \n\
H3 ,0,n \n\
S2 ,1,t \n\
G1 ,0,n \n\
H3 ,0,n \n\
G1 ,1,t \n\
H3 ,1,t \n\
S4 ,0,n \n\
G3 ,0,n \n\
S4 ,1,n \n\
A2 ,0,n \n\
H3 ,0,n \n\
A2 ,1,t \n\
A1 ,0,n \n\
G3 ,0,n \n\
A1 ,1,t \n\
G3 ,1,t \n\
H4 ,0,n \n\
S2 ,0,n \n\
H4 ,1,t \n\
A1 ,0,n \n\
S3 ,0,n \n\
A1 ,1,t \n\
S3, 1,t \n\
G4, 0,n \n\
H4, 0,n \n\
G1, 1,t \n\
A2, 0,n \n\
H1, 0,n \n\
A2, 1,t \n\
H2, 0,n \n\
G1, 0,n \n\
H1, 1,t \n\
G3, 1,t \n\
S3, 0,n \n\
A4, 0,n \n\
H2, 0,n \n\
A1, 1,t \n\
H4, 1,t \n\
G3, 0,n \n\
A3, 0,n \n\
G1, 1,t \n\
H3, 0,n \n\
G4, 1,t \n\
H2, 1,t \n\
A1, 0,n'; 


sequence_ext=jsFunc.csvJSON(sequence_ext)
sequence_ext=sequence_ext.slice(0, 5);
