const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const {createServer} = require('http');
const md5 = require('md5');

const app = express();
const server = createServer(app);
const port = 3001;

app.use(bodyParser.raw({type:'application/octet-stream', limit:'50mb'}));
app.use('/uploads', express.static('uploads/data'));

let corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/chunk/upload/fileList' ,async(req, res) => {
  // console.log(req.query)
  const {name,chunkNumber,totalChunks} = req.query;

  //chunkNumber 는 현재의 청크 index
  //totalChunk filesize chunksize 나눈 총 수 
  //start와 end 같을떄 0 0 일때
  const startChunk = parseInt(chunkNumber) === 0;
  // const currentChunk = parseInt(chunkNumber) >= 0 &&  parseInt(chunkNumber)<=parseInt(totalChunks);
  const endChunk = parseInt(chunkNumber) === parseInt(totalChunks)-1;


  //확장자
  const ext = name.split('.').pop();
  // const data = req.body.toString().split(',')[1];
// console.log("start:"+startChunk+",end:"+endChunk)
// console.log(req.body)//req.body Blob을 Buffer 형태로 가져옴
  //new error 나면   from- buffer를 만드는 가장 뚜렷한 방법  alloc -데이터를 채울 필요가 없는 빈 버퍼를 생성하고 싶을 때 유용
  const buffer = Buffer.from(req.body, "base64");

  //md5(Message-Digest algorithm 5)라는 해시 알고리즘으로 체크섬(check sum) 값을 계산하는 명령어. 입력된 파일을 32자 문자열로 축약한 값을 출력함
  //대용량의 파일을 전송하다 보면 네트워크 장애 등의 원인으로 파일에 손상이 발생함  전송받은 파일이 중간에 손실 없이 잘 다운로드 되었는지 확인하고자 할 때 받은 파일의 md5 체크섬을 계산
  const tempFileName = 'part_' + md5(name + req.ip) + '.' + ext;
  const filePath = './uploads/data/'

  // 파일이 존재하면  파일제거
  if(startChunk && fs.existsSync(filePath+tempFileName)){
   await fs.unlinkSync(filePath+tempFileName);
  }
  await fs.appendFileSync(filePath+tempFileName,buffer);
  //완료되면
  if(endChunk){
    const finalFileName = md5(Date.now()).substr(0, 6) + '.' + ext;
    await fs.renameSync('./uploads/data/'+tempFileName, './uploads/data/'+finalFileName);
    await res.status(200).send();
  }
  // //진행중 206 코드 보내고
  await res.status(206).send();
})
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})