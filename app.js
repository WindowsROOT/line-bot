 'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
//const ngrok = require('ngrok');
const axios = require('axios')
const fetch = require('node-fetch');
require('dotenv').config();

// create LINE SDK config from env variables
const config = {
channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
channelSecret: process.env.CHANNEL_SECRET,
};

// base URL for webhook server
let baseURL = process.env.BASE_URL;

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();


app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {

  console.log(event);

  if (event.type == 'message' && event.message.type == 'text') {
    handleMessageEvent(event);

  } else if (event.type === 'postback') {
    handlePostbackEvent(event);
  } else {
    return Promise.resolve(null);
  }
}

//ป้าย
function getBoard(city, district, timestart, timeend) {


  const options = {
    headers: { 'content-type': 'application/json', 'charset': 'utf-8' },
  };

  let addname1 = encodeURIComponent(city)
  let addname2 = encodeURIComponent(district)

  return fetch('https://scenespace.co.th/line/getBoard?type=billboard&addname1=' + addname1 + '&addname2=' + addname2 + '&start=' + timestart + '&end=' + timeend, options).then(response => response.json())


}

// สนามบิน
function getAIR(city, timestart, timeend) {


  const options = {
    headers: { 'content-type': 'application/json', 'charset': 'utf-8' },
  };

  let addname1 = encodeURIComponent(city)

  return fetch('https://scenespace.co.th/line/getBoard?type=airport&addname1=' + addname1 + '&addname2=' + addname1 + '&start=' + timestart + '&end=' + timeend, options).then(response => response.json())


}


async function handlePostbackEvent(event) {

  var eventPostback = event.postback.data.toLowerCase();
  let chooseCity = eventPostback.split(",")

  var msg = {
    type: 'text',
    text: "postback"
  };


 

  if (chooseCity[0] === 'city') {
      
    if (chooseCity[1] === 'เชียงใหม่') {
      msg = {

        "type": "text",
        "text": "กรุณาเลือกอำเภอ",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "เมือง",
                "data": "timestart,เมือง,เชียงใหม่"
              }
            }, {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "สันกำแพง",
                "data": "timestart,สันกำแพง,เชียงใหม่"
              }
            }, {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "แม่คาว",
                "data": "timestart,แม่คาว,เชียงใหม่"
              }
            },


          ]
        }
      }

    }


    if (chooseCity[1] === 'เชียงราย') {
      msg = {

        "type": "text",
        "text": "กรุณาเลือกอำเภอ",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "เมือง",
                "data": "timestart,เมือง,เชียงราย"
              }
            }
          ]
        }
      }

    }

    if (chooseCity[1] === 'พะเยา') {
      msg = {

        "type": "text",
        "text": "กรุณาเลือกอำเภอ",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "เมือง",
                "data": "timestart,เมือง,พะเยา"
              }
            }
          ]
        }
      }

    }


    if (chooseCity[1] === 'สงขลา') {
      msg = {

        "type": "text",
        "text": "กรุณาเลือกอำเภอ",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "หาดใหญ๋",
                "data": "timestart,หาดใหญ๋,สงขลา"
              }
            }
          ]
        }
      }

    }


    if (chooseCity[1] === 'ภูเก็ต') {
      msg = {

        "type": "text",
        "text": "กรุณาเลือกอำเภอ",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "เมือง",
                "data": "timestart,เมือง,ภูเก็ต"
              }
              
            },{
              "type": "action",
              "action": {
                "type": "postback",
                "label": "ถลาง",
                "data": "timestart,ถลาง,ภูเก็ต"
              }
              
            }
          ]
        }
      }

    }


    if (chooseCity[1] === 'ชลบุรี') {
      msg = {

        "type": "text",
        "text": "กรุณาเลือกอำเภอ",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "บางละมุง",
                "data": "timestart,บางละมุง,ชลบุรี"
              }
            }
          ]
        }
      }

    }


    if (chooseCity[1] === 'ขอนแก่น') {
      msg = {

        "type": "text",
        "text": "กรุณาเลือกอำเภอ",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "เมืองขอนแก่น",
                "data": "timestart,เมืองขอนแก่น,ขอนแก่น"
              }
            }
          ]
        }
      }

    }



  }

  
  if (chooseCity[0] === 'timestart' || chooseCity[0] === 'cityair') {



    msg = {

      "type": "text",
      "text": "กรุณาเลือกเวลาเริ่มต้น",
      "quickReply": {
        "items": [

          {
            "type": "action",
            "action": {
              "type": "datetimepicker",
              "label": "เวลาเริ่มต้น",
              "data": "timeend," + chooseCity[1] + "," + chooseCity[2]+","+chooseCity[0],
              "mode": 'date'
            }

          }

        ]
      }
    }



  }


  if (chooseCity[0] === 'timeend') {


    msg = {

      "type": "text",
      "text": "กรุณาเลือกเวลาสิ้นสุด",
      "quickReply": {
        "items": [

          {
            "type": "action",
            "action": {
              "type": "datetimepicker",
              "label": "เวลาสิ้นสุด",
              "data": "end," + chooseCity[1] + "," + chooseCity[2] + "," + event.postback.params['date']+","+chooseCity[3],
              "mode": 'date'
            }

          }

        ]
      }
    }


  }


  // ---------------------------------------------------------------------------------- แก้ในนี้ ---------------------------------------------------------------------

  if (chooseCity[0] === 'end') {

    let databoard
    let board
    let availableCount 
    let city
    let district
    let timestart
    let timeend


    console.log(chooseCity[4])
    if(chooseCity[4] === "timestart"){

        databoard = await getBoard(chooseCity[2], chooseCity[1], chooseCity[3], event.postback.params['date'])
        city = chooseCity[2] //จังหวัด
        board = []
        availableCount = databoard.availableCount
        district = chooseCity[1] //อำเภอ
        timestart = chooseCity[3] //เวลาเริ่มต้น
        timeend = event.postback.params['date'] //เวลาสิ้นสุด
    
        if (availableCount > 10) {

          for(let i=0;i<10;i++){
          board.push({
    
            "thumbnailImageUrl":JSON.parse(JSON.stringify(databoard.data[i].boardPicture)),
             //"thumbnailImageUrl": "https://imgur.com/bN3DS7i.jpg",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": JSON.parse(JSON.stringify(databoard.data[i].name)),
                  "text": "จำนวนรถวิ่งผ่าน "+JSON.parse(JSON.stringify(databoard.data[i].traffic)),
                  "defaultAction": {
                    "type": "uri",
                    "label": "View detail",
                    "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                  },
                  "actions": [
                    {
                      "type": "uri",
                      "label": "จองป้าย",
                      "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                    },
                    {
                      "type": "uri",
                      "label": "สถานะ "+JSON.parse(JSON.stringify(databoard.data[i].boardStatus)),
                      //"uri": "https://scenespace.co.th/billboardSearch?label_name=&prov="+city+"&dis="+district+"&status=avilable&start="+timestart+"&end="+timeend
                      "uri": "https://scenespace.co.th/billboardSearch?prov="+city+"&dis="+district+"&status=avilable"

                    },
                    {
                      "type": "uri",
                      "label": "ราคา "+ JSON.parse(JSON.stringify(databoard.data[i].price)),
                      "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                    }
                  ]
    
          })
        
          console.log(databoard.data[i].boardPicture)
          //

        }
    
    
    
        }else if(availableCount < 10){
    
          board = []
          for(let i=0;i<availableCount;i++){
            board.push({
      
              //"thumbnailImageUrl": "https://imgur.com/bN3DS7i.jpg",
              "thumbnailImageUrl":JSON.parse(JSON.stringify(databoard.data[i].boardPicture)),
                    "imageBackgroundColor": "#FFFFFF",
                    "title": JSON.parse(JSON.stringify(databoard.data[i].name)),
                    "text": "จำนวนรถวิ่งผ่าน "+JSON.parse(JSON.stringify(databoard.data[i].traffic)),
                    "defaultAction": {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                    },
                    "actions": [
                      {
                        "type": "uri",
                        "label": "จองป้าย",
                        "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                      },
                      {
                        "type": "uri",
                        "label": "สถานะ "+JSON.parse(JSON.stringify(databoard.data[i].boardStatus)),
                        //"uri": "https://scenespace.co.th/billboardSearch?label_name=&prov="+city+"&dis="+district+"&status=avilable&start="+timestart+"&end="+timeend
                        "uri": "https://scenespace.co.th/billboardSearch?prov="+city+"&dis="+district+"&status=avilable"
                      },
                      {
                        "type": "uri",
                        "label": "ราคา "+ JSON.parse(JSON.stringify(databoard.data[i].price)),
                        "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                      }
                    ]
      
            })
          }
    
        }

      }else if(chooseCity[4] === "cityair"){

        databoard = await getAIR(JSON.parse(JSON.stringify(chooseCity[1])), chooseCity[3], event.postback.params['date'])
        board = []
        availableCount = databoard.availableCount
        district = chooseCity[1] //อำเภอ
        timestart = chooseCity[3] //เวลาเริ่มต้น
        timeend = event.postback.params['date'] //เวลาสิ้นสุด
        city = chooseCity[1] //จังหวัด

        if (availableCount > 10) {

          board = []
          for(let i=0;i<10;i++){
          board.push({
    
            "thumbnailImageUrl":JSON.parse(JSON.stringify(databoard.data[i].boardPicture)),
            //"thumbnailImageUrl": "https://imgur.com/bN3DS7i.jpg",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": JSON.parse(JSON.stringify(databoard.data[i].name)),
                  "text": " ",
                  "defaultAction": {
                    "type": "uri",
                    "label": "View detail",
                    "uri": "https://scenespace.co.th/airport/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                  },
                  "actions": [
                    {
                      "type": "uri",
                      "label": "จองป้าย",
                      "uri": "https://scenespace.co.th/airport/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                    },
                    {
                      "type": "uri",
                      "label": "สถานะ "+JSON.parse(JSON.stringify(databoard.data[i].boardStatus)),
                      //"uri":"https://scenespace.co.th/airportSearch?label_name=&prov="+city+"&airport="+city+"&status=avilable&start="+timestart+"&end="+timeend
                        "uri":"https://scenespace.co.th/airportSearch?label_name=&prov="+city+"&airport="+city+"&status="
                    },
                    {
                      "type": "uri",
                      "label": "ราคา "+ JSON.parse(JSON.stringify(databoard.data[i].price)),
                      "uri": "https://scenespace.co.th/airport/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                    }
                  ]
    
          })
        }
    
    
    
        }else if(availableCount < 10){
    
          board = []
          for(let i=0;i<availableCount;i++){
            board.push({
      
              "thumbnailImageUrl":JSON.parse(JSON.stringify(databoard.data[i].boardPicture)),
              //"thumbnailImageUrl": "https://imgur.com/bN3DS7i.jpg",
                    "imageBackgroundColor": "#FFFFFF",
                    "title": JSON.parse(JSON.stringify(databoard.data[i].name)),
                    "text": " ",
                    "defaultAction": {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                    },
                    "actions": [
                      {
                        "type": "uri",
                        "label": "จองป้าย",
                        "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                      },
                      {
                        "type": "uri",
                        "label": "สถานะ "+JSON.parse(JSON.stringify(databoard.data[i].boardStatus)),
                        //"uri":"https://scenespace.co.th/airportSearch?label_name=&prov="+city+"&airport="+city+"&status=avilable&start="+timestart+"&end="+timeend
                         "uri":"https://scenespace.co.th/airportSearch?label_name=&prov="+city+"&airport="+city+"&status="
                      },
                      {
                        "type": "uri",
                        "label": "ราคา "+ JSON.parse(JSON.stringify(databoard.data[i].price)),
                        "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                      }
                    ]
      
            })
          }
    
        }

      }



  

    console.log("test", board)
    if (availableCount !=0) {
    msg = {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
        "type": "carousel",
        "columns": board,
        "imageAspectRatio": "rectangle",
        "imageSize": "contain"
      }
    }
  }else if (availableCount ==0) {

    msg = {
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://i.ibb.co/SrkJGsr/scen2.jpg",
        //"title": "ขออภัยขณะนี้ ป้ายเต็มแล้ว",
        "title": "กรุณาระบุช่วงเวลาจองป้ายใหม่ ",
        "text": "Please select",
        "actions": [{
          "type": "uri",
          "label": "จองป้ายเพิ่มเติม",
          "uri": "https://scenespace.co.th/billboard"
        }, 
         {
          "type": "uri",
          "label": "View detail",
          "uri": "https://scenespace.co.th/billboardSearch?label_name=&prov=%E0%B8%9E%E0%B8%B0%E0%B9%80%E0%B8%A2%E0%B8%B2&dis=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87&status=all&start=&end="
        }
        ]
      }
    }


  }

  }

  // ---------------------------------------------------------------------------------- แก้ในนี้ ---------------------------------------------------------------------


  return client.replyMessage(event.replyToken, msg);
  
}


function handleMessageEvent(event) {

  var eventText = event.message.text.toLowerCase();


  var msg = {
      "type": "text", // ①
      "text": "ยินดีค่ะ\nกรุณาเลือกหัวข้อที่ต้องการสอบถาม",
      "quickReply": { // ②
        "items": [
          {
            "type": "action", // ③
            "action": {
              "type": "message",
              "label": "ป้ายโฆษณา",
              "text": "#billboard"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "message",
              "label": "สื่อสนามบิน",
              /*"text": "#เชียงราย",*/
              "text": "#airport"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "message",
              "label": "ขั้นตอนการจอง",
              /*"text": "#เชียงราย",*/
              "text": "#guideline"
            }
          },
          {
          "type": "action", // ③
            "action": {
              "type": "message",
              "label": "ติดต่อเรา",
              /*"text": "#เชียงราย",*/
              "text": "#contact"
            }
          },
        ]
      }
    };


if (eventText === '#billboard') {
    msg = {
      "type": "text", // ①
      "text": "กรุณาเลือกจังหวัด",
      "quickReply": { // ②
        "items": [
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "เชียงใหม่",
              "data": "city,เชียงใหม่"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "เชียงราย",
              /*"text": "#เชียงราย",*/
              "data": "city,เชียงราย"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "พะเยา",
              /*"text": "#พะเยา",*/
              "data": "city,พะเยา"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "สงขลา",
              /*"text": "#สงขลา",*/
              "data": "city,สงขลา"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "ภูเก็ต",
              "text": "#ภูเก็ต",
              "data": "city,ภูเก็ต"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "ชลบุรี",
              /*"text": "#ชลบุรี",*/
              "data": "city,ชลบุรี"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "ขอนแก่น",
              /*"text": "#ขอนแก่น",*/
              "data": "city,ขอนแก่น"
            }
          }
        ]
      }
    }
  }else if (eventText === '#airport') {
    msg = {
      "type": "text", // ①
      "text": "กรุณาเลือกจังหวัด",
      "quickReply": { // ②
        "items": [
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "เชียงใหม่",
              "data": "cityair,เชียงใหม่"
            }
          },
          {
            "type": "action", // ③
            "action": {
              "type": "postback",
              "label": "เชียงราย",
              /*"text": "#เชียงราย",*/
              "data": "cityair,เชียงราย"
            }
          },
        ]
      }
    }
  }else if (eventText === '#guideline') {
    msg = {
      'type': 'image',
      'originalContentUrl': 
      'https://cdn.discordapp.com/attachments/694842829641613335/695206211728965673/Infographic_Scenespace.jpg',
      'previewImageUrl': 
      'https://cdn.discordapp.com/attachments/694842829641613335/695206211728965673/Infographic_Scenespace.jpg',
      "animated": false
    }
  }

  else if (eventText === '#contact') {
    msg = {
  "type": "flex",
  "altText": "Flex Message",
  "contents": {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://cdn.discordapp.com/attachments/694842829641613335/696644654476689438/22894146_1474877425922919_2195592568320093906_n.jpg",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover",
      "action": {
        "type": "uri",
        "label": "Line",
        "uri": "https://linecorp.com/"
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "ซีนสเปซพลัส จำกัด",
          "size": "xl",
          "weight": "bold"
        },
        {
          "type": "box",
          "layout": "baseline",
          "margin": "md",
          "contents": [
            {
              "type": "icon",
              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              "size": "sm"
            },
            {
              "type": "icon",
              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              "size": "sm"
            },
            {
              "type": "icon",
              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              "size": "sm"
            },
            {
              "type": "icon",
              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              "size": "sm"
            },
            {
              "type": "icon",
              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              "size": "sm"
            },
            {
              "type": "text",
              "text": "5.0",
              "flex": 0,
              "margin": "md",
              "size": "sm",
              "color": "#999999"
            }
          ]
        },
        {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "margin": "lg",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Place",
                  "flex": 1,
                  "size": "sm",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": "87/9 อาคารสตาร์เวิร์ค ห้อง 301    ชั้น 3 ถนนทุ่งโฮเต็ล ตำบลวัดเกต อำเภอเมือง จังหวัดเชียงใหม่ 50000",
                  "flex": 5,
                  "size": "sm",
                  "color": "#666666",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Time",
                  "flex": 1,
                  "size": "sm",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": "09:00 - 18:00",
                  "flex": 5,
                  "size": "sm",
                  "color": "#666666",
                  "wrap": true
                }
              ]
            },
             {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Call",
                  "flex": 1,
                  "size": "sm",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": "090 995 4558",
                  "flex": 5,
                  "size": "sm",
                  "color": "#666666",
                  "wrap": true
                }
              ]
            }
          ]
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "flex": 0,
      "spacing": "sm",
      "contents": [
        {
          "type": "button",
          "action": {
            "type": "uri",
            "label": "WEBSITE",
            "uri": "https://scenespace.co.th"
          },
          "height": "sm",
          "style": "link"
        },
        {
          "type": "spacer",
          "size": "sm"
        }
      ]
    }
  }
}
  }

  return client.replyMessage(event.replyToken, msg);

    
}

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'));
})

