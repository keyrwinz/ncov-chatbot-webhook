const express = require('express')
const request = require('request')
const bodyparser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
const covmssg = require('./Guide/covid-message')

const { 
  WelcomeMessage, 
  Help, 
  AppInfo, 
  ErrorCountry, 
  MessageForAttachments, 
  DefaultMessage,
  ErrorYesterdayQuery,
  Contributors } = require('./Guide/guide')

const app = express()
const FB_PAGE_ID = process.env.FB_PAGE_ID
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
const HUB_VERIFY_TOKEN = process.env.HUB_VERIFY_TOKEN
const MESSENGER_API = 'https://graph.facebook.com/v6.0/me/messages'
const NOVELCOVID_API = 'https://corona.lmao.ninja/v2'

const PORT = process.env.PORT || 8080

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

app.get('/', (req, res) => res.send('THIS IS NCOV CHATBOT'))

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] == HUB_VERIFY_TOKEN) {
    console.log('hub verify success')
    SetupGetStartedButton(res)
    res.status(200).send(req.query['hub.challenge'])
  } else {
    console.log(req.query['hub.verify_token'])
    res.status(400)
  }
})

app.post("/webhook", (req,res) => {
  let message_events = req.body.entry[0].messaging
	message_events.forEach( (entry) => {
    if (entry.message && entry.message.text) {
        ProcessText(entry.sender.id, entry.message.text)
        res.sendStatus(200);
    } else {
      if ( entry.postback && entry.postback.payload === 'get_started' ){
        GreetUser(entry.sender.id)
        res.sendStatus(200)
      } else if (entry.message.attachments) {
        SendText(entry.sender.id, MessageForAttachments)
        res.sendStatus(200)
      } else {
        res.sendStatus(400)
      }
    }
  });
});

let data = {}

const ProcessText = (id, message) => {
  let str = message.toLowerCase().trim().split(" ").filter(Boolean)

  switch (str[0]) {
    case 'ncov':
      if (str.length === 1) {
        // get 'all' covid19 cases in the world if user sends 'ncov' only
        data = {
          query: 'all',
          type: 'query',
          url: '/'
        }
      } else {
        // removing 'ncov' word in string to get the next word/s
        str.shift()

        if (str[0] === 'yesterday') {
          // removing 'yesterday' word in string to get the next word/s => (country)
          str.shift()
          if (!str[0] || str[0] === '') {
            data = {
              text: ErrorYesterdayQuery,
              type: 'text'
            }
          } else {
            // get yesterday's cases
            country = str.join(" ")
            data = {
              query: country,
              type: 'query',
              url: '/countries/',
              text: 'Yesterday'
            }
          }
        } else {
          // get today's cases
          country = str.join(" ")
          data = {
            query: country,
            type: 'query',
            url: '/countries/',
            text: 'Today'
          }
        }
      }
      break;
    
    case 'help': 
      data = {
        text: Help,
        type: 'text'
      }
      break;
    
    case 'info': 
      data = {
        text: AppInfo,
        type: 'text'
      }
      break;

    case 'contributors':
      data = {
        text: Contributors,
        type: 'text'
      }
      break

    default:
      data = {
        text: DefaultMessage,
        type: 'text'
      }
      break;
  }
  
  // console.log('STR: ', str)
  // console.log('DATA: ', data)
  ProcessRequest(id, data)
}

const ProcessRequest = (id, data) => {
  switch (data.type) {
    case 'query':
      GetCovidInfo(id, data)
      break;
    case 'text':
      SendText(id, data.text)
    default:
      break;
  }

  data = {}
}

const SendText = (id, text) => {
  request({
    url: MESSENGER_API,
    qs: { access_token: FB_PAGE_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: id },
      message: { text: text }
    }
  })
}

const GetCovidInfo = (id, param) => {
  let url
  if (param) {
    url = `${NOVELCOVID_API}/all`
    if (param.text && param.text === 'Yesterday') {
      url = `${NOVELCOVID_API}${param.url}${param.query}?yesterday=true&strict=false`
    }
    if (param.text && param.text === 'Today') {
      url = `${NOVELCOVID_API}${param.url}${param.query}?yesterday=false&strict=false`
    }
  }
  request({
    url: url,
    json: true
  }, (err, res, data) => {
    let message
    if(!err && res.statusCode === 200){
      message = covmssg.generateMessage(data, param.text)
    }else{
      console.log('Error: ', data.message)
      message = `${data.message}. ${ErrorCountry}`
    }

    SendText(id, message)
  })
}

const GreetUser = (id) => {
  let url = `https://graph.facebook.com/v2.6/${id}?fields=first_name&access_token=${FB_PAGE_TOKEN}`
  request({
    url: url,
    json: true
  }, (err, res, data) => {
    let username
    if(!err && res.statusCode === 200){
      username = data.first_name
    }else{
      console.log('Error: ', data.message)
    }

    SendText(id, WelcomeMessage(username))
  })
}

const SetupGetStartedButton = (res) => {
  request({
    url: `https://graph.facebook.com/v2.6/${FB_PAGE_ID}/thread_settings?access_token=${FB_PAGE_TOKEN}`,
    method: 'POST',
    json:{
      "setting_type": "call_to_actions",
      "thread_state":"new_thread",
      "call_to_actions": [{ "payload":"get_started" }]
    }
  }, function(error, response, body) {
      if (error) {
        console.log('Error sending messages: ', error)
      }
  })
}