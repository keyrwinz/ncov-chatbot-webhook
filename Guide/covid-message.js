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

  const updatedDate = moment(updated).tz(timezone).format('llll Z')
  const countryName = country ? country === 'World' ? `the ${country}` : country : 'the World'
  const flag = country ? countryInfo.iso2 ? emojiFlags.countryCode(countryInfo.iso2).emoji : '🌎' : '🌎' 
  const relativeTime = moment(updated).tz(timezone).fromNow()

  const testsVal = tests ? numeral(tests).format('0,0') : 'No data'
  const casesVal = numeral(cases).format('0,0')
  const todayCasesVal = numeral(todayCases).format('0,0')
  const deathsVal = numeral(deaths).format('0,0')
  const todayDeathsVal = numeral(todayDeaths).format('0,0')
  const recoveredVal = numeral(recovered).format('0,0')
  const activeVal = numeral(active).format('0,0')
  const criticalVal = numeral(critical).format(0, 0)
  const affectedCountriesVal = affectedCountries ? `Affected countries: ${affectedCountries}` : ''

  const caseRatio = cases/tests
  const deathRatio = deaths/tests
  const recovRatio = recovered/tests

  const casePercentage = isFinite(caseRatio) ? `(${numeral(caseRatio).format('0.00%')})` : ''
  const deathPercentage = isFinite(deathRatio) ? `(${numeral(deathRatio).format('0.00%')})` : ''
  const recovPercentage = isFinite(recovRatio) ? `(${numeral(recovRatio).format('0.00%')})` : ''

  const caseW = cases > 1 ? 'cases' : 'case'
  const tcaseW = todayCases > 1 ? 'cases' : 'case'
  const deathW = deaths > 1 ? 'deaths' : 'death'
  const tdeathW = todayDeaths > 1 ? 'deaths' : 'death'


  const message = `
${text === 'today' ? `
As of ${updatedDate}
in ${countryName} ${flag}
Updated ${relativeTime}
` : `
${text}
in ${countryName} ${flag}
`}
Total tests ${text}: ${testsVal}

Total ${caseW} ${text}: ${casesVal} ${casePercentage}
New ${tcaseW}: ${todayCasesVal}

Total ${deathW}: ${deathsVal} ${deathPercentage}
New ${tdeathW}: ${todayDeathsVal}

Total recovered: ${recoveredVal} ${recovPercentage}

Active ${text}: ${activeVal}
Critical: ${criticalVal}

${affectedCountriesVal}
`
  return message
}

exports.generateMessage = generateMessage