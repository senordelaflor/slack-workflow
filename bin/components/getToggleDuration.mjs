import dotenv from "dotenv"
import TogglClient from "toggl-api"

dotenv.config()
const apiToken = process.env.TOGGL_API_TOKEN
const toggl = new TogglClient({ apiToken })

const getTogglDurationInSeconds = togglData => {
  let duration = 0
  togglData.forEach(data => {
    if (
      !data.duration ||
      !data.pid ||
      data.pid !== parseInt(process.env.TOGGL_PROJECT_ID)
    ) { return }
    if (data.duration > 0) {
      duration += data.duration
    } else if (data.duration < 0) {
      global.isWorking = true
      const currentTimeInSecondsSinceEpoch = new Date() / 1000
      const durationInSec = currentTimeInSecondsSinceEpoch + data.duration
      duration += durationInSec
    }
  })
  return duration
}

const getTogglDurationForPeriodInSeconds = (startDate, endDate) =>
  new Promise(resolve => {
    toggl.getTimeEntries(startDate, endDate, (error, data) => {
      if (error) console.log(error)
      resolve(getTogglDurationInSeconds(data))
    })
  })

export default getTogglDurationForPeriodInSeconds
