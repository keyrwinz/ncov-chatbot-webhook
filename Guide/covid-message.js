const moment = require('moment-timezone')
const numeral = require('numeral')
const emojiFlags = require('emoji-flags')

const timezone = 'Asia/Manila'

const generateMessage = (data, text = 'today') => {
  let { 
    country,
    countryInfo,
    affectedCountries,
    cases,
    updated,
    todayCases,
    todayDeaths,
    recovered,
    deaths,
    active,
    tests,
    critical,
    testsPerOneMillion,
    deathsPerOneMillion,
    casesPerOneMillion
  } = data

  const flag = country ? countryInfo.iso2 ? emojiFlags.countryCode(countryInfo.iso2).emoji : '🌎' : '🌎' 
  const message = `
As of ${moment(updated).tz(timezone).format('llll Z')}
in ${country ? country === 'World' ? `the ${country}` : country : 'the World'} ${flag}
Updated ${moment(updated).tz(timezone).fromNow()}

Total cases ${text}: ${numeral(cases).format(0,0)}
with ${text}'s new cases: ${numeral(todayCases).format(0,0)}

Total Deaths: ${numeral(deaths).format(0,0)}
with ${text}'s new deaths: ${numeral(todayDeaths).format(0,0)}

Total Recovered: ${numeral(recovered).format(0,0)}

Active ${text}: ${numeral(active).format(0,0)}
Critical: ${numeral(critical).format(0, 0)}
Total tests ${text}: ${numeral(tests).format(0,0)}

${affectedCountries ? `Affected countries: ${affectedCountries}` : ''}
`
  return message
}

exports.generateMessage = generateMessage