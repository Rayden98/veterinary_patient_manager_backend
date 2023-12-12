import nodemailer from 'nodemailer'

const emailForgetPassword = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      const { email, name, token } = data;

      // Send the email

      const info = await transport.sendMail({
        from: "APV - Veterinary Patient Manager",
        to: email,
        subject: 'Restore your password',
        text: 'Restore your password',
        html: `<p> Hello: ${name}, you has asked for restore your password.</p>
            <p> Follow the next link for generate a new password: 
            <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Restore Password</a></p>

            <p> If you didnt create this account ignore this message</p>
        `
      });

      console.log("Message sent: %s", info.messageId)
};

export default emailForgetPassword;