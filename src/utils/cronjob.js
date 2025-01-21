const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns")
const sendEmail = require("./sendEmail");
const connectionRequestModel = require("../models/connectionRequest")

//this job will run 8am in morning everyday
cron.schedule("00 08 * * *", async () => {
    //send mails to all people who got requests the previous day
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequests = await connectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];
        // console.log(listOfEmails);
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run("New Friend Requests pending for " + email, "there are so many friend request are pending , please login to the developersconnect.com");
            }
            catch (err) {
                console.log(err);
            }

        }
    }
    catch (err) {

    }
})