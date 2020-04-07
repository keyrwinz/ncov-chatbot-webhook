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

const ProcessText = (id, message) => {
  let str = message.toLowerCase().trim().split(" ").filter(Boolean)
  let data = {
    text: null,
    type: null
  }

  if (str[0] === 'ncov') {
    if (str.length === 1) {
      // get 'all' covid19 cases in the world if user sends 'ncov' only
      data = {
        text: 'all',
        type: 'query'
      }
    }else {
      // removing 'ncov' word in string to get the next word/s => (country)
      str.shift()
      country = str.join(" ")
      data = {
        text: country,
        type: 'query'
      }
    }
  } else if (str[0] === 'help') {
    data = {
      text: Help,
      type: 'text'
    }
  } else {
    data = {
      text: `Hi there! try typing 'help' to show documentation`,
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
      console.log('it is a query')
      GetCovidInfo(id, data.text)
      break;
    case 'text':
      console.log('it is just a text')
      SendText(id, data.text)
    default:
      break;
  }
}

const SendText = (id, text) => {
  console.log('SENDING TEXT... \n\n\n')
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

const GetCovidInfo = (id, query) => {
  SendText(id, 'For a moment...')
  let url = query === 'all' ? `${NOVELCOVID_API}/${query}` : `${NOVELCOVID_API}/countries/${query}`
  console.log('URL: ', url)
  request({
    url: url,
    json: true
  }, (err, res, data) => {
    let message
    if(!err && res.statusCode === 200){
      message = covmssg.generateMessage(data)
    }else{
      console.log('Error: ', res.statusCode)
      message = `${data.message}. ${ErrorCountry}`
    }

    SendText(id, message)
  })
}



