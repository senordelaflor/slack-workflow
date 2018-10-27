import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

const updateSlackStatus = (statusMessage, statusEmoji) => {
  const slackToken = process.env.SLACK_TOKEN
  axios
    .post(
      encodeURI(
        `https://slack.com/api/users.profile.set?profile={'status_text': '${statusMessage}','status_emoji': '${statusEmoji}'}&token=${slackToken}`
      )
    )
    .then(function(response) {
      // console.log("response");
    })
    .catch(function(error) {
      if (error) console.log(error)
    })
}

export default updateSlackStatus
