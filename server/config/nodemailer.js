import nodemailer from "nodemailer"

const transpoter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.SENDER_MAIL,
        pass:process.env.SENDER_MAIL_PASS
    }
})

export default transpoter