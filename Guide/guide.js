module.exports = {
  Help: `
EXAMPLES:
    'ncov' => #shows COVID19 cases summary
    'ncov philippines' => #shows COVID19 cases in the PH
    'ncov yesterday ph' => #shows yesterday's COVID19
          cases in the Philippines'

COMMANDS:
    help // show commands
    info // show app info
    ncov // show world covid cases
    ncov <country>
    ncov yesterday <country>
  `,
  WelcomeMessage: (name) => `
Hello ${name}!

I’m SCOVIDo, short for StopCOVID. I am a simple chatbot 
made for you to report regarding the current cases and 
more stuff about COVID-19! To begin with, type 'help' 
to show available commands 🙂
`,
  AppInfo: `
NAME: 
    SCOVIDo bot

DESCRIPTION:
    This is a simple chatbot that 
    would report updated information
    regarding the COVID-19 virus cases.

    This app relies on 'NovelCOVID API' to access
    real-time critical data. We encourage you to
    seek more informations on other sources. 
    Type 'info' to show app information and other
    available sources.

API SOURCES:
    https://corona.lmao.ninja/
    https://covid-19-apis.postman.com/

OTHER SOURCES:
    https://www.worldometers.info/coronavirus/

REPO: Please go to 'about' section
  `,
  ErrorCountry: `Please check your spelling and avoid using dash`,
  MessageForAttachments: `Hi there 👋.. just to let you know you don't need to send attachments to use this app 😊`,
  DefaultMessage: `Hi there 👋! try typing 'help' to show documentation 😊`,
}