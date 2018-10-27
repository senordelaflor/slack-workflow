import moment from "moment"
import "moment-timezone"
import "moment-duration-format"
import getTogglDurationForPeriodInSeconds from "./getToggleDuration"

const getTotalWorkHoursForToday = async () => {
  const {
    todayStart,
    todayStartFormat,
    workDaysInAWeek,
    workHoursInDay,
  } = global
  const thisWeekInteger = moment()
    .tz("America/New_York")
    .week()
  const isLastWeekOfPayPeriod = thisWeekInteger % 2 === 0
  const mondayOfThisWeek = moment()
    .tz("America/New_York")
    .weekday(1)
    .startOf("day")
  const mondayOfLastWeek = moment()
    .tz("America/New_York")
    .weekday(1)
    .startOf("day")
    .subtract(1, "weeks")
  const beginningOfPayPeriod = isLastWeekOfPayPeriod
    ? mondayOfLastWeek
    : mondayOfThisWeek
  const beginningOfPayPeriodFormat = beginningOfPayPeriod.format()
  const timeWorkedInPayPeriodInSeconds = await getTogglDurationForPeriodInSeconds(
    beginningOfPayPeriodFormat,
    todayStartFormat
  )
  const timeWorkedInPayPeriodInHrUntilYesterday = moment
    .duration(timeWorkedInPayPeriodInSeconds, "seconds")
    .asHours()
  const workDaysSinceBeginningOfPayPeriod = isLastWeekOfPayPeriod
    ? workDaysInAWeek + todayStart.weekday()
    : todayStart.weekday()
  const workHoursSinceBeginningOfPayPeriod =
    workDaysSinceBeginningOfPayPeriod * workHoursInDay
  const remainingWorkHoursForToday = moment.duration(
    workHoursSinceBeginningOfPayPeriod -
      timeWorkedInPayPeriodInHrUntilYesterday,
    "hours"
  )
  return remainingWorkHoursForToday
}

export default getTotalWorkHoursForToday
