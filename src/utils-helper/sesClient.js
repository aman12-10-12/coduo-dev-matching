const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-1"; //e.g. "us-east-1"
// Credentials are automatically resolved using the AWS SDK credential provider chain.
// For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
// Create SES service object.
const sesClient = new SESClient({ region: REGION, credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY
}});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]