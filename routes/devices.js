var express = require("express");
var router = express.Router();
const mqtt = require("mqtt");
const DHT11 = require("../models/DHT11");

// MQTT Server 접속
const client = mqtt.connect("mqtt://172.30.1.50");

// 주소 http://172.30.1.50:3000/devices/led 요청을 처리
// 넘어오는 데이터 { "flag": value }를 처리
router.post("/led", function(req, res, next){
    res.set("Content-Type", "text/json");
    if (req.body.flag == "on") { // 넘어온 데이터가 on이면
        client.publish("led","1");
        res.send(JSON.stringify({ led: "on" })); // html의 화면에 on이라는 str을 반환한다.
        console.log("html 화면에 On 반환");
    }else{
        client.publish("led", "2");
        res.send(JSON.stringify({ led: "off" }));
        console.log("html 화면에 Off 반환");
    }
});

// 안드로이드에서 요청 받기
router.post("/device", function(req, res, next){
    console.log(req.body.sensor);
    if(req.body.sensor=="dht11"){
        console.log("디비 조회 중 ------------------- ");
        DHT11.find({}).sort({created_at: -1}).limit(10).then(data=>{
            res.send(JSON.stringify(data));
        });
    }else{
        // 다른 센서 데이터
        console.log("엘스 진입 ------------------- ");
    }
});


module.exports = router;
// 외부에서 이 devices.js를 쓸 수 있도록