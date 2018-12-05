import moment from "moment"
import "moment-timezone"
import "moment-duration-format"
import getTogglDurationForPeriodInSeconds from "./getToggleDuration"

const todayStartFormat = moment()
  .tz("America/New_York")
  .hours(0)
  .format()
const nowFormat = moment()
  .tz("America/New_York")
  .format()

const getStatusMessages = async () => {
  const timeWorkedTodayInSeconds = await getTogglDurationForPeriodInSeconds(
    todayStartFormat,
    nowFormat
  )
  const startOfTheMonthFormat = moment()
    .tz("America/New_York")
    .date(1)
    .startOf("day")
    .format()

  const timeWorkedInMonthInSeconds = await getTogglDurationForPeriodInSeconds(
    startOfTheMonthFormat,
    nowFormat
  )
  const timeWorkedInMonthInHrAndMin = moment
    .duration(timeWorkedInMonthInSeconds, "seconds")
    .format("h:mm", { trim: false })
  const timeWorkedTodayInHrAndMin = moment
    .duration(timeWorkedTodayInSeconds, "seconds")
    .format("h:mm", { trim: false })

  const statusMessage = `${timeWorkedTodayInHrAndMin} hrs worked today · ${timeWorkedInMonthInHrAndMin}/100 hrs worked this month`
  const statusEmoji = global.isWorking ? "☕" : ":spiral_calendar_pad:"
  return { statusMessage, statusEmoji }
}

export default getStatusMessages
