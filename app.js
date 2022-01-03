// 
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://172.30.1.50") // 모스키토 서버와 커넥트를 하겠다.
// 모스키토 서버는 나의 OS의 서비스에서 실행중이다.

// 노드 -> 모스키토 서버
client.on("connect", ()=>{ // 접속되면 connect이벤트가 생긴다.
    console.log("mqtt connected");
}); 