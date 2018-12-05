import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const updateSlackDnd = () => {
  if (process.env.STOP_DND) return

  if (!global.isWorking) {
    axios.get(
      encodeURI(
        `https://slack.com/api/dnd.setSnooze?token=${
          process.env.SLACK_TOKEN
        }&num_minutes=11`
      )
    )
  } else {
    axios.post(
      encodeURI(
        `https://slack.com/api/dnd.endSnooze?token=${process.env.SLACK_TOKEN}`
      )
    )
  }
}

export default updateSlackDnd
