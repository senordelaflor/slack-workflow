import moment from "moment"
import "moment-timezone"
import "moment-duration-format"

const shouldSendTextMessage = comeBackTimeET => {
  const currentTimeET = moment().tz("America/New_York")
  const isMondayEndOfFirstShift =
    global.isMonday &&
    (currentTimeET.isAfter(
      moment()
        .tz("America/New_York")
        .hours(12)
        .minutes(30)
    ) &&
      currentTimeET.isBefore(
        moment()
          .tz("America/New_York")
          .hours(12)
          .minutes(32)
      ))
  const isRegularEndOfFirstShift =
    !global.isMonday &&
    currentTimeET.isAfter(
      moment()
        .tz("America/New_York")
        .hours(10)
        .minutes(30)
    ) &&
    currentTimeET.isBefore(
      moment()
        .tz("America/New_York")
        .hours(10)
        .minutes(32)
    )
  const isComeBackTimeReminderTime =
    currentTimeET.isAfter(
      comeBackTimeET && comeBackTimeET.clone().subtract(15, "minutes")
    ) &&
    currentTimeET.isBefore(
      comeBackTimeET && comeBackTimeET.clone().subtract(13, "minutes")
    ) &&
    global.isCurrentTimeBetweenWorkTimeToday
  return (
    isMondayEndOfFirstShift ||
    isRegularEndOfFirstShift ||
    isComeBackTimeReminderTime
  )
}

export default shouldSendTextMessage
