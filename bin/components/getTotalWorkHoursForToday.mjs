import moment from "moment"
import "moment-timezone"
import "moment-duration-format"
import getTogglDurationForPeriodInSeconds from "./getToggleDuration"
import dotenv from "dotenv"

const timeAdjustmentInHours = process.env.TIME_ADJUSTMENT_IN_HOURS
const timeAdjustmentPayPeriodStartDate =
  process.env.TIME_ADJUSTMENT_PAY_PERIOD_START_DATE

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
  const timeWorkedInPayPeriodInHrUntilYesterday = parseFloat(
    moment.duration(timeWorkedInPayPeriodInSeconds, "seconds").asHours()
  )
  const workDaysSinceBeginningOfPayPeriod = isLastWeekOfPayPeriod
    ? workDaysInAWeek + todayStart.weekday()
    : todayStart.weekday()
  const applyTimeAdjustment = moment
    .tz(timeAdjustmentPayPeriodStartDate, "America/New_York")
    .isSame(beginningOfPayPeriod)
  console.log("Apply time adjustment: " + applyTimeAdjustment)
  const workHoursSinceBeginningOfPayPeriod =
    parseFloat(workDaysSinceBeginningOfPayPeriod * workHoursInDay) +
    (applyTimeAdjustment ? parseFloat(timeAdjustmentInHours) : 0)
  const remainingWorkHoursForToday = moment.duration(
    workHoursSinceBeginningOfPayPeriod -
      timeWorkedInPayPeriodInHrUntilYesterday,
    "hours"
  )

  return remainingWorkHoursForToday
}

export default getTotalWorkHoursForToday
