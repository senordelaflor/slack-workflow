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
    .subtract(timeWorkedTodayInSeconds, "s")
  const timeWorkedTodayInHrAndMin = moment
    .duration(timeWorkedTodayInSeconds, "seconds")
    .format("h:mm", { trim: false })
  const comeBackTime = getComeBackTime(remainingWorkTimeForToday)
  const formattedComeBackTime = comeBackTime && comeBackTime.format("h:mmA z")
  const formattedRemainingWorkTimeForToday = remainingWorkTimeForToday.format(
    "h:mm",
    { trim: false }
  )
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
  )} hrs worked ${isWeekendDay ? "Friday" : "today"}`
  const awayStatusMessage = `Back at ${formattedComeBackTime}${dayMessage} · ${workingStatusMessage}`
  const statusMessage = global.isWorking
    ? workingStatusMessage
    : awayStatusMessage
  const statusEmoji = global.isWorking ? "☕" : ":spiral_calendar_pad:"
  return { statusMessage, statusEmoji, workingStatusMessage, comeBackTime }
}

export default getStatusMessages
