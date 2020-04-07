module.exports = {
  Help: `
NAME: 
    NCOV Chatbot2020

DESCRIPTION:
    This is a chatbot that would 
    report current information
    regarding the COVID19 virus

API SOURCES:
    https://corona.lmao.ninja/
    https://covid-19-apis.postman.com/

EXAMPLES:
    'ncov' => #shows COVID19 cases summary
    'ncov philippines' => #shows COVID19 cases in the 'PH'

AUTHOR:
    keyrwinfelisilda@gmail.com

REPO:
    https://github.com/keyrwinz/ncov-chatbot-webhook

COMMANDS:
    help
    ncov
    ncov <country>
    ncov yesterday <country>
  `,
  ErrorCountry: `Please check your spelling and avoid using dash`,
}