const express = require('express')
const request = require('request')
const bodyparser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
const covmssg = require('./Guide/covid-message')

//predefined messages
const { Help, ErrorCountry } = require('./Guide/guide')


const app = express()
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
const HUB_VERIFY_TOKEN = process.env.HUB_VERIFY_TOKEN
const MESSENGER_API = 'https://graph.facebook.com/v6.0/me/messages'
const NOVELCOVID_API = 'https://corona.lmao.ninja'

const PORT = process.env.PORT || 8080

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

app.get('/', (req, res) => res.send('THIS IS NCOV CHATBOT'))

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] == HUB_VERIFY_TOKEN) {
    console.log('hub verify success')
    res.status(200).send(req.query['hub.challenge'])
  } else {
    res.status(400).send(req)
  }
})

app.post("/webhook", (req,res) => {
  let message_events = req.body.entry[0].messaging
	message_events.forEach( (entry) => {
    if (entry.message && entry.message.text) {
      // console.log(`message recieved with id: ${entry.sender.id} and text: ${entry.message.text}`)
      ProcessText(entry.sender.id, entry.message.text)
      res.sendStatus(200);
    }
  });
});

let data = {}

const ProcessText = (id, message) => {
  let str = message.toLowerCase().trim().split(" ").filter(Boolean)

  if (str[0] === 'ncov') {
    if (str.length === 1) {
      // get 'all' covid19 cases in the world if user sends 'ncov' only
      data = {
        query: 'all',
        type: 'query',
        url: '/'
      }
    }else {
      // removing 'ncov' word in string to get the next word/s
      str.shift()
      if (str[0] === 'yesterday') {
        // removing 'yesterday' word in string to get the next word/s => (country)
        str.shift()
        if (!str[0]) {
          data = {
            text: `Please input country. Type 'help' for more info 🙂`,
            type: 'text'
          }
        } else {
          country = str.join(" ")
          data = {
            query: country,
            type: 'query',
            url: '/yesterday/',
            text: `yesterday`
          }
        }
      } else {
        country = str.join(" ")
        data = {
          query: country,
          type: 'query',
          url: '/countries/'
        }
      }
    }
  } else if (str[0] === 'help') {
    data = {
      text: Help,
      type: 'text'
    }
  } else {
    data = {
      text: `Hi there 👋! try typing 'help' to show documentation 😊`,
      type: 'text'
    }
  }
  
  console.log('STR: ', str)
  console.log('DATA: ', data)
  ProcessRequest(id, data)
}

const ProcessRequest = (id, data) => {
  console.log('PROCESSING REQUEST...')
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
  let url = data ? `${NOVELCOVID_API}${param.url}${param.query}` : NOVELCOVID_API
  console.log('URL: ', url)
  console.log('FETCHING DATA...')
  SendText(id, 'For a moment...')
  request({
    url: url,
    json: true
  }, (err, res, data) => {
    let message
    if(!err && res.statusCode === 200){
      message = covmssg.generateMessage(data, param.text)
    }else{
      console.log('Error: ', res.statusCode)
      message = `${data.message}. ${ErrorCountry}`
    }

    SendText(id, message)
  })
}



