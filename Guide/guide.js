module.exports = {
  Help: `
NCOV Chatbot2020

DESCRIPTION:
    This is a chatbot that would 
    report current information
    regarding the COVID19 virus

EXAMPLES:
    'ncov' => #shows COVID19 cases summary
    'ncov philippines' => #shows COVID19 cases in the 'PH'

AUTHOR:
    keyrwinfelisilda@gmail.com

GITHUB:
    https://github.com/keyrwinz/ncov-chatbot-webhook

COMMANDS:
    help
    ncov
    ncov <country>
  `,
  Greetings: `Hi there! this is a chatbot for COVID19 virus. Try inputting 'help' for more info.`,
  ErrorCountry: `Country not found. Try to check the spelling and try again`,
  ErrorCountryWithoutDash: `Error country name. Try using '-' ex. south korea => 'south-korea'`,
}