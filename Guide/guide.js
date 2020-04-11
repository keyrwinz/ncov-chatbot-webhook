module.exports = {
  Help: `
EXAMPLES:
    'ncov' => shows World cases

    'ncov ph' => shows Philippines cases

    'ncov yesterday sg' => shows yesterday's cases in singapore'

COMMANDS:
    help
    info
    ncov
    ncov [country name]
    ncov yesterday [country name]
  `,
  WelcomeMessage: (name) => `
Hello ${name || 'There'}!

I’m SCOVIDo, short for StopCOVID. I am a simple chatbot made for you to report regarding the current cases and more stuff about COVID-19! 
To begin with, type 'help' to show available commands 🙂
`,
  AppInfo: `
NAME: 
    SCOVIDo Chatbot

DESCRIPTION:
    This is a simple chatbot that would report updated information regarding the COVID-19 virus cases.
    This app relies on 'NovelCOVID API' to access real-time critical data.

SOURCES:
    https://www.worldometers.info/coronavirus/
  `,
  ErrorCountry: `Please check your spelling and avoid using dash`,
  ErrorYesterdayQuery: `Please input country. Type 'help' for more info 🙂`,
  MessageForAttachments: `Hi there 👋.. just to let you know you don't need to send attachments to use this bot 😊`,
  Contributors: `
Contributors:
    Keyrwin Felisilda
    Kevin Felisilda
    Hanny Peñarubia
  `,
  DefaultMessage: `Hi there 👋! try typing 'help' to show documentation 😊`,
}