import moment from "moment"
import "moment-timezone"
import "moment-duration-format"

const getComeBackTime = remainingWorkTimeForToday => {
  const {
    isWorking,
    isCurrentTimeBeforeWorkTimeToday,
    startOfWorkTimeToday,
    endOfWorkTimeToday,
    isCurrentTimeAfterWorkTimeToday,
  } = global
  let comeBackTime
  if (!isWorking) {
    if (
      isCurrentTimeAfterWorkTimeToday ||
      remainingWorkTimeForToday < moment.duration(600, "seconds")
    ) {
      comeBackTime = startOfWorkTimeToday
        .add(1, "day")
        .tz("America/Los_Angeles")
    } else if (isCurrentTimeBeforeWorkTimeToday) {
      comeBackTime = startOfWorkTimeToday.tz("America/Los_Angeles")
    } else {
      // between work time
      comeBackTime = endOfWorkTimeToday
        .subtract(remainingWorkTimeForToday, "s")
        .tz("America/Los_Angeles")
    }
  }
  return comeBackTime
}

export default getComeBackTime
