import dotenv from "dotenv"
import shouldSendTextMessage from "./shouldSendTextMessage"
import Twilio from "twilio"

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new Twilio(accountSid, authToken)

const sendTextMessage = (comeBackTime, workingStatusMessage) => {
  const comeBackTimeET =
    comeBackTime && comeBackTime.clone().tz("America/New_York")
  if (shouldSendTextMessage(comeBackTimeET)) {
    const textMessageText = `Back at ${comeBackTimeET &&
      comeBackTimeET.format(
        "h:mmA z"
      )} · ${workingStatusMessage} · due://x-callback-url/add?title=Work&duedate=${comeBackTimeET &&
      comeBackTimeET.subtract(15, "minutes").format("X")}`
    client.messages
      .create({
        body: textMessageText,
        from: `+1${process.env.TWILIO_FROM_NUMBER}`,
        to: `+1${process.env.TWILIO_TO_NUMBER}`,
      })
      .then(message => console.log(textMessageText))
      .done()
  }
}

export default sendTextMessage
