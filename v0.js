'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const ngrok = require('ngrok');
const axios = require('axios')
const fetch = require('node-fetch');


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
function getAIR(city, district, timestart, timeend) {


  const options = {
    headers: { 'content-type': 'application/json', 'charset': 'utf-8' },
  };

  let addname1 = encodeURIComponent(city)
  let addname2 = encodeURIComponent(district)

  return fetch('https://scenespace.co.th/line/getBoard?type=billboard&addname1=' + addname1 + '&addname2=' + addname2 + '&start=' + timestart + '&end=' + timeend, options).then(response => response.json())


}


async function handlePostbackEvent(event) {

  var eventPostback = event.postback.data.toLowerCase();
  let chooseCity = eventPostback.split(",")

  var msg = {
    type: 'text',
    text: "postback"
  };

  let array = []

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


  if (chooseCity[0] === 'timestart') {

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
              "data": "timeend," + chooseCity[1] + "," + chooseCity[2],
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
              "data": "end," + chooseCity[1] + "," + chooseCity[2] + "," + event.postback.params['date'],
              "mode": 'date'
            }

          }

        ]
      }
    }


  }


  // ---------------------------------------------------------------------------------- แก้ในนี้ ---------------------------------------------------------------------

  if (chooseCity[0] === 'end') {


    let databoard = await getBoard(chooseCity[2], chooseCity[1], chooseCity[3], event.postback.params['date'])
    console.log(databoard)
    /*let databoard2 = await getBoard(chooseCity[2],chooseCity[1],chooseCity[3],event.postback.params['availableCount'])*/
    let board = []
    let bookedCount = databoard.bookedCount
    let availableCount = databoard.availableCount
    let allCount = databoard.allCount
    // ---------------------------------------------------------------------------------- จะเอา template ไป loop ยังไงหวะ --------         
    // ของตัวแปร จังหวัด อำเภอ 

    let city = chooseCity[2] //จังหวัด
    let district = chooseCity[1] //อำเภอ
    let timestart = chooseCity[3] //เวลาเริ่มต้น
    let timeend = event.postback.params['date'] //เวลาสิ้นสุด

    if (availableCount > 10) {

      board = []
      for(let i=0;i<10;i++){
      board.push({

        "thumbnailImageUrl": "https://imgur.com/bN3DS7i.jpg",
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
                  "label": "ป้ายว่าง "+availableCount+" ป้าย",
                  "uri": "https://scenespace.co.th/billboardSearch?label_name=&prov="+city+"&dis="+district+"&status=avilable&start="+timestart+"&end="+timeend
                },
                {
                  "type": "uri",
                  "label": "-",
                  "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                }
              ]

      })
    }



    }else if(availableCount < 10){

      board = []
      for(let i=0;i<availableCount;i++){
        board.push({
  
          "thumbnailImageUrl": "https://imgur.com/bN3DS7i.jpg",
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
                    "label": "ป้ายว่าง "+availableCount+" ป้าย",
                    "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                  },
                  {
                    "type": "uri",
                    "label": "-",
                    "uri": "https://scenespace.co.th/billboard/"+JSON.parse(JSON.stringify(databoard.data[i].id))+"/avilable"
                  }
                ]
  
        })
      }

    }

          
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

    /*             for(let i=1;i<10;i++){
    
                     board.push(
    
    
                        { 
                            "type": "action", 
                             "action": {
                                 "type": "message",
                                 "label": databoard.data[i].id,
                                 "text": databoard.data[i].id
                             },
                     }
    
    
                    )
                 }
    
                 msg = {
              "type": "text", 
                   "text": "กรุณาเลือกป้าย\nขณะนี้มีป้ายว่าง" + availableCount + "ป้าย",
                      "quickReply": { 
                      "items": board,
    
                  }
        }*/





  }

  // ---------------------------------------------------------------------------------- แก้ในนี้ ---------------------------------------------------------------------


  return client.replyMessage(event.replyToken, msg);
}


function handleMessageEvent(event) {

  var eventText = event.message.text.toLowerCase();


  var msg = {
    type: 'text',
    text: "test"
  };


  if (eventText === 'image') {
    msg = {
      'type': 'image',
      'originalContentUrl': 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100',
      'previewImageUrl': 'https://images.performgroup.com/di/library/GOAL/a6/bb/fifa-18-ronaldo_lx3r88bpjpk91re36ukdgomrj.jpg?t=2027563652&w=620&h=430'
    }
  } else if (eventText === 'button') {
    msg = {
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100",
        "title": "Menu",
        "text": "Please select",
        "actions": [{
          "type": "postback",
          "label": "จองป้าย",
          "data": "action=buy&itemid=123"
        }, {
          "type": "postback",
          "label": "Add to cart",
          "data": "action=add&itemid=123"
        }, {
          "type": "uri",
          "label": "View detail",
          "uri": "http://example.com/page/123"
        }]
      }
    }
  } else if (eventText === 'template confirm') {
    msg = {
      "type": "template",
      "altText": "this is a confirm template",
      "template": {
        "type": "confirm",
        "text": "Are you sure?",
        "actions": [{
          "type": "message",
          "label": "Yes",
          "text": "yes"
        }, {
          "type": "message",
          "label": "No",
          "text": "no"
        }]
      }
    }


  } else if (eventText === 'datetime') {
    msg = {
      type: 'template',
      altText: 'Datetime pickers alt text',
      template: {
        type: 'buttons',
        text: 'เวลาที่ทำการจอง !',
        actions: [
          { type: 'datetimepicker', label: 'date', data: 'start', mode: 'date' }
        ]
      }
    }

  } else if (eventText === '#billboard') {
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
        ]
      }
    }
  } else if (eventText === '#guideline') {
    msg = {
      type: "image",
      originalContentUrl:
         'https://cdn.discordapp.com/attachments/694842829641613335/695206211728965673/Infographic_Scenespace.jpg', 
      previewImageUrl:
        "https://cdn.discordapp.com/attachments/694842829641613335/695206211728965673/Infographic_Scenespace.jpg",
      animated: false,
    };
  }

  return client.replyMessage(event.replyToken, msg);
}

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'));
})

