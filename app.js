// 
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://172.30.1.50") // 모스키토 서버와 커넥트를 하겠다.
// 모스키토 서버는 나의 OS의 서비스에서 실행중이다.

// 노드 -> 모스키토 서버
client.on("connect", ()=>{ // 접속되면 connect이벤트가 생긴다.
    console.log("mqtt connected");
    client.subscribe("dht11") // dht11라는 토픽으로 구독
}); 

client.on("message", (dht11, message)=>{ // 서버가 pub할(sub 받을) 때마다 message이벤트 발생.
    
    var date = new Date(); // 날짜
    // 아래. 한국 일시로 설정하기 위함
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var obj = JSON.parse(message); // json형태로 파싱

    obj.created_at=new Date(Date.UTC(year, month, today, hours, minutes, seconds)); // 오브젝트에 날짜를 추가해준다.

    console.log(obj);
});
