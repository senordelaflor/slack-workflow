import dotenv from "dotenv"
import TogglClient from "toggl-api"

dotenv.config()
const apiToken = process.env.TOGGL_API_TOKEN
const toggl = new TogglClient({ apiToken })
const btvTogglProjectId = 140861364
const wuTogglProjectId = 140861464

const getTogglDurationInSeconds = togglData => {
  let duration = 0
  let wuDuration = 0
  let btvDuration = 0
  togglData.forEach(data => {
    if (!data.duration) return
    let entryDuration = 0
    if (data.duration > 0) {
      duration += data.duration
      entryDuration = data.duration
    } else if (data.duration < 0) {
      global.isWorking = true
      const currentTimeInSecondsSinceEpoch = new Date() / 1000
      const durationInSec = currentTimeInSecondsSinceEpoch + data.duration
      duration += durationInSec
      entryDuration = durationInSec
    }

    const projectId = data.pid
    if (projectId === btvTogglProjectId) {
      btvDuration += entryDuration
    }
    if (projectId === wuTogglProjectId) {
      wuDuration += entryDuration
    }
  })
  return { duration, btvDuration, wuDuration }
}

const getTogglDurationForPeriodInSeconds = (startDate, endDate) =>
  new Promise(resolve => {
    toggl.getTimeEntries(startDate, endDate, (error, data) => {
      if (error) console.log(error)
      resolve(getTogglDurationInSeconds(data))
    })
  })

export default getTogglDurationForPeriodInSeconds
