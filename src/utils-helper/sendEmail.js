const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f9fc; padding:30px;">
                <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                
                    <h2 style="color:#2b6cb0; margin-bottom:10px;">New Request Received 🚀</h2>
                    
                    <p style="font-size:16px; color:#333;">
                    Hello,
                    </p>

                    <p style="font-size:16px; color:#333;">
                    You have received a new request on <strong>Coduo</strong>.
                    </p>

                    <div style="background:#f1f5f9; padding:15px; border-radius:8px; margin:20px 0;">
                    <h3 style="margin:0; color:#111;">${body}</h3>
                    </div>

                    <p style="font-size:15px; color:#555;">
                    Log in to your account to review and respond to this request.
                    </p>

                    <a href="https://coduo.online"
                    style="display:inline-block; margin-top:20px; padding:12px 20px; background:#2b6cb0; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
                    View Request
                    </a>

                    <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

                    <p style="font-size:12px; color:#888;">
                    This is an automated notification from Coduo.
                    </p>

                </div>
            </div>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "You have a new connection request from  on Coduo. Please log in to your account to review the request.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};


const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "aman01122raj@gmail.com",
    "aman@coduo.online",
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };