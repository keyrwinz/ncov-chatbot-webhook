const express = require('express')
const request = require('request')
const bodyparser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();

//predefined messages
const { Help, Greetings, ErrorCountry, ErrorCountryWithoutDash } = require('./Guide/guide')

const app = express()
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
const HUB_VERIFY_TOKEN = process.env.HUB_VERIFY_TOKEN
const COVID_API = 'https://corona.lmao.ninja/countries/'

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
      console.log(`message recieved with id: ${entry.sender.id} and text: ${entry.message.text}`)
      ProcessText(entry.sender.id, entry.message.text)
      res.sendStatus(200);
    }
  });
});

const ProcessText = (id, message) => {
  let str = message.toLowerCase().trim().split(" ").filter(Boolean)
  let text;

  console.log('processing text...')
  if (str[0] === 'ncov') {
    text = 'NCOV command'
  } else if (str[0] === 'help') {
    text = Help
  } else {
    text = "Hi there! type 'help' to show documentation"
  }

  SendText(id, text)
}

const SendText = (id, text) => {
  console.log('replying...')
  request({
    url: 'https://graph.facebook.com/v6.0/me/messages',
    qs: { access_token: FB_PAGE_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: id },
      message: { text: text }
    }
  })
}

const GetCovidInfo = (country = null) => {
  
}



