/* AUTHOR: Kevin Rothenbühler-Alarcon */

const dayJs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")
//require("dayjs/locale/fr-ch")

dayJs.extend(relativeTime)
//dayJs.locale("fr-ch")

module.exports = dayJs