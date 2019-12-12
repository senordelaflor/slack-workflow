#!/usr/bin/env node

import dotenv from "dotenv"
import moment from "moment"
import "moment-timezone"
import "moment-duration-format"
import getStatusMessages from "./components/getStatusMessages"
import updateSlackStatus from "./components/updateSlackStatus"
import sendTextMessage from "./components/sendTextMessage"
import updateSlackDnd from "./components/updateSlackDnd"

dotenv.config()

global.todayStart = moment()
  .tz("America/New_York")
  .hours(0)
global.todayStartFormat = global.todayStart.format()
global.nowFormat = moment()
  .tz("America/New_York")
  .format()
global.endOfWorkTimeToday = moment()
  .tz("America/New_York")
  .hours(17)
  .minutes(0) // 5 PM
global.startOfWorkTimeToday = moment()
  .tz("America/New_York")
  .hours(7)
  .minutes(0) // 7 AM
global.isCurrentTimeAfterWorkTimeToday = moment()
  .tz("America/New_York")
  .isAfter(global.endOfWorkTimeToday)
global.isCurrentTimeBeforeWorkTimeToday = moment()
  .tz("America/New_York")
  .isBefore(global.startOfWorkTimeToday)
global.isCurrentTimeBetweenWorkTimeToday =
  !global.isCurrentTimeAfterWorkTimeToday &&
  !global.isCurrentTimeBeforeWorkTimeToday
global.dayOfTheWeek = moment()
  .tz("America/New_York")
  .day()
global.isWeekendDay = global.dayOfTheWeek === 0 || global.dayOfTheWeek === 6
global.isFriday = global.dayOfTheWeek === 5
global.isMonday = global.dayOfTheWeek === 1
global.workDaysInAWeek = 5
global.workHoursInDay = 7

const performTasks = async () => {
  if (global.isWeekendDay) return
  const { statusMessage, statusEmoji, comeBackTime } = await getStatusMessages()
  console.log(statusMessage)
  updateSlackStatus(statusMessage, statusEmoji)
  sendTextMessage(comeBackTime, statusMessage)
  updateSlackDnd()
}

performTasks()
