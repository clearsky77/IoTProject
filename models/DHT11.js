// 스키마 만들기

const mongoose=require("mongoose");
const DHT11Schema=mongoose.Schema({
tmp : {
type : String,
required : true
},
hum : {
type : String,
required : true
},
created_at : {
type : Date,
default : Date.now }
});
module.exports = mongoose.model('DHT11', DHT11Schema); // 테이블명: DHT11