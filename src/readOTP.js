
require("dotenv").config();

api_url = "https://api.mail.tm";

token = process.env.MAILTM_TOKEN || "none";


async function getRecentMailId() {
    const response = await fetch(`${api_url}/messages`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let messages = await response.json();
    // console.log(messages);
    if (messages["hydra:totalItems"].length == 0) {
        return null;
    }
    return messages["hydra:member"][0]["id"];
}

// getRecentMailId();

async function getMailById(id) {
    // console.log(id);
    const response = await fetch(`${api_url}/messages/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let message = await response.json();
    // console.log(message);
    return message;
}

function extractOTP(message) {
    let otp = message["text"].match(/\d{6}/);
    return otp[0];
}

async function readOTP() {
    let id = await getRecentMailId();
    let message = await getMailById(id);

    // console.log(id);
    // console.log(message);
    let otp = extractOTP(message);
    console.log(otp);
    return otp;
}

// readOTP();

module.exports = readOTP;

