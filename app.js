const mqtt = require("mqtt"); // 모듈을 부르는 방법
const client = mqtt.connect("mqtt://172.30.1.50"); // 모스키토 서버와 커넥트를 하겠다.
// 모스키토 서버는 나의 OS의 서비스에서 실행중이다.

const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
require('dotenv/config'); // 몽고 디비에서 경로 지정할 때 사용한다.

const DHT11 = require("./models/DHT11");


// 클라이언트에게 서비스
app.use(express.static(__dirname+"/public")); // __dirname은 현재 디렉토리를 뜻함



// 노드 -> 모스키토 서버
client.on("connect", () => {
  // 접속되면 connect이벤트가 생긴다.
  console.log("mqtt connected");
  client.subscribe("dht11"); // dht11라는 토픽으로 구독
});

client.on("message", (topic, message) => {
  // 서버가 pub할(sub 받을) 때마다 message이벤트 발생.

  var date = new Date(); // 날짜
  // 아래. 한국 일시로 설정하기 위함
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var obj = JSON.parse(message); // json형태로 파싱

  obj.created_at = new Date(
    Date.UTC(year, month, today, hours, minutes, seconds)
  ); // 오브젝트에 날짜를 추가해준다.

  console.log(obj);

  const dht11 = new DHT11({
    // 객체 생성을 하고
    tmp: obj.tmp,
    hum: obj.hum,
    created_at: obj.created_at,
  });

  try {
    // 에러가 나는 경우가 있기 때문에 작업해준다.
    dht11.save(); // DB에 저장된다.
    console.log("insert OK");
  } catch (error) {
    console.log({ message: error });
  }
});

// Web Server 만들기. express 모듈 사용.
app.set("port", "3000");
var server = http.createServer(app); // express 모듈(app)을 사용하여 서버 제작
server.listen(3000, (err) => {
  // 3000번 포트를 여는데 에러가 생기면 처리
  if (err) {
    return console.log("err");
  } else {
    console.log("server read");
    //Connection To DB. 몽고 DB에 연결.
    mongoose.connect(
      process.env.MONGODB_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("connected to DB!")
    );
  }
});
