module.exports = {
  Help: `
NAME: 
    NCOV Chatbot2020

DESCRIPTION:
    This is a simple chatbot that 
    would report updated information
    regarding the COVID19 virus cases

API SOURCES:
    https://corona.lmao.ninja/
    https://covid-19-apis.postman.com/

OTHER SOURCES:
    https://www.worldometers.info/coronavirus/

EXAMPLES:
    'ncov' => #shows COVID19 cases summary
    'ncov philippines' => #shows COVID19 cases in the 'PH'

AUTHOR:
    keyrwinfelisilda@gmail.com

REPO:
    https://github.com/keyrwinz/ncov-chatbot-webhook
    'Feel free to contribute 😊'

COMMANDS:
    help
    ncov
    ncov <country>
    ncov yesterday <country>
  `,
  ErrorCountry: `Please check your spelling and avoid using dash`,
}