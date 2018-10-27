# Slack Workflow Tasks ☕️

This is node.js script that was created to let my coworkers know when I will be online working, how many hours I have left, and how many hours I have already worked the current day. Moreover, it also updates my do not disturb setting to on when I am not working and turn it off when I am online. All the logic is based around Toggl time entries for a timesheet period of 2 weeks and based on a split schedule. This script is set up to run every 10 minutes in Heroku Scheduler.

This script performs the following tasks accordingly:

- Reads timer entries from Toggl and generates status messages.
- Updates Slack Status.
- Sends reminder texts using Twilio.
- Updates DND Slack Setting.

## Status Messages

The status messages will take into consideration if I am working or not (if there is an active timer in Toggl). If I am not working, it will print out when I will be back in LA time (my employer's timezone), how many hours I have left for that day and how much I have already worked. If I am working it just displays the hours I have left and how much I have already worked.

Active Toggl entry status message example:

`Aprox 3:07 hrs left · 2:53/6 hrs worked today`

No active Toggl entries status message example:

`Back at 4:00AM PDT on Monday · Aprox -0:07 hrs left · 5:46/5:39 hrs worked today`

The status message function will calculate how many hours I will need to work the current day and it will take into account any carry over time from the timesheet period (2 weeks).

Furthermore, the status message function will update my status with the time I will be back.
If it is before my morning shift, it will say when I will come on that morning. If it is after my morning shift (during my split shift break), the come back time will be 5pm EST minus the remaining work time for the day. If it's after my work time hours, it will say when I will come on the next morning 🎉.

## Update Slack Status

Using the Slack Api, it will update my status every 10 minutes using Heroku Scheduler.

## Send Reminder Texts

The app will send a reminder text using Twilio around the time I should be off during my morning shift. Moreover, it will also send a reminder within 20-10 minutes before I need to come back for the econd part of my shift.

## Update Slack DND setting

If there is an active Toggl entry it will end DND, so that I can be contacted and receive Slack notifications. If there is not an active Toggl entry, it will set my Slack DND setting "on" for 11 minutes, and it will be updated every 10 minutes by the Heroku Scheduler.
