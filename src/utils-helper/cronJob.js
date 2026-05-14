const cron = require('node-cron')
const connectionRequestModel = require('../models/connectionRequest')
const {subDays, startOfDay, endOfDay} = require('date-fns')
const sendEmail = require('./sendEmail')

cron.schedule('00 8 * * *', async () => {
    console.log('Running a task every day at 8 AM')
    // send email to users every day at 8 AM about their connection requests

    const yesterday = subDays(new Date(), 1)
    const yesterdayStart = startOfDay(yesterday)
    const yesterdayEnd = endOfDay(yesterday)

    try {
        const pendingConnectionRequests = await connectionRequestModel.find({ 
            status: 'interested',
            createdAt : {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            },
         }).populate("fromUserId toUserId")

        // send email to users about their pending connection requests
        const listofUsersToNotify = [...new Set(pendingConnectionRequests.map(req => req.toUserId.emailId))]
        console.log(listofUsersToNotify)
        for(const email of listofUsersToNotify) {
            try {
                const res = await sendEmail.run("Pending Connection Requests for " + email, "You have pending connection requests. Please check your account to respond to them.")
            } catch (error) {
                console.error('Error occurred while sending email:', error)
            }
        }
    } catch (error) {
        console.error('Error occurred while running cron job:', error)
    }
})