import moment from "moment"
import "moment-timezone"
import "moment-duration-format"
import getTogglDurationForPeriodInSeconds from "./getToggleDuration"
import getTotalWorkHoursForToday from "./getTotalWorkHoursForToday"
import getComeBackTime from "./getComeBackTime"

const todayStart = moment()
  .tz("America/New_York")
  .hours(0)
const todayStartFormat = todayStart.format()
const todayEnd = moment()
  .tz("America/New_York")
  .hours(23)
  .minutes(59)
const todayEndFormat = todayEnd.format()
const mondayOfThisWeek = moment()
  .tz("America/New_York")
  .weekday(1)
  .startOf("day")
const mondayOfThisWeekFormat = mondayOfThisWeek.format()
const nowFormat = moment()
  .tz("America/New_York")
  .format()

const getStatusMessages = async () => {
  const { isFriday, isCurrentTimeAfterWorkTimeToday, isWeekendDay } = global
  const timeWorkedTodayInSeconds = await getTogglDurationForPeriodInSeconds(
    todayStartFormat,
    nowFormat
  )
  const totalWorkHoursForToday = await getTotalWorkHoursForToday()
  const remainingWorkTimeForToday = totalWorkHoursForToday
    .clone()
    .subtract(timeWorkedTodayInSeconds.duration, "s")
  const timeWorkedTodayInHrAndMin = moment
    .duration(timeWorkedTodayInSeconds.duration, "seconds")
    .format("h:mm", { trim: false })
  const comeBackTime = getComeBackTime(remainingWorkTimeForToday)
  const formattedComeBackTime = comeBackTime && comeBackTime.format("h:mmA z")
  const formattedRemainingWorkTimeForToday = remainingWorkTimeForToday.format(
    "h:mm",
    { trim: false }
  )
  const fullTimeWorkedInPayPeriodInSeconds = await getTogglDurationForPeriodInSeconds(
    mondayOfThisWeekFormat,
    todayEndFormat
  )

  const formattedBtvHours = moment
    .duration(fullTimeWorkedInPayPeriodInSeconds.btvDuration, "seconds")
    .format("h:mm", { trim: false })
  const formattedWuHours = moment
    .duration(fullTimeWorkedInPayPeriodInSeconds.wuDuration, "seconds")
    .format("h:mm", { trim: false })
  const dayMessage =
    (isFriday && isCurrentTimeAfterWorkTimeToday) || isWeekendDay
      ? " on Monday"
      : isCurrentTimeAfterWorkTimeToday ||
        remainingWorkTimeForToday < moment.duration(600, "seconds")
        ? " Tomorrow"
        : ""
  const workingStatusMessage = `Aprox ${formattedRemainingWorkTimeForToday} hrs left · ${timeWorkedTodayInHrAndMin}/${totalWorkHoursForToday.format(
    "h:mm",
    { trim: false }
  )} hrs worked ${
    isWeekendDay ? "Friday" : "today"
  } ·  BTV ${formattedBtvHours}/15 hrs | WU: ${formattedWuHours}/15 hrs this week`
  const awayStatusMessage = `Back at ${formattedComeBackTime}${dayMessage} · ${workingStatusMessage}`
  const statusMessage = global.isWorking
    ? workingStatusMessage
    : awayStatusMessage
  const statusEmoji = global.isWorking ? "☕" : ":spiral_calendar_pad:"
  return { statusMessage, statusEmoji, workingStatusMessage, comeBackTime }
}

export default getStatusMessages
