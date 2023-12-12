import nodemailer from 'nodemailer'

const emailRegistration = async (data) => {
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
        subject: 'Confirm your account in APV',
        text: 'Confirm your account in APV',
        html: `<p> Hello: ${name}, confirm your account in APV.</p>
            <p> Your account is ready, only you must to confirm in the following link: 
            <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a></p>

            <p> If you didnt create this account ignore this message</p>
        `
      });

      console.log("Message sent: %s", info.messageId)
};

export default emailRegistration