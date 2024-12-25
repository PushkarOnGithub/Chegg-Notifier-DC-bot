const puppeteer = require("puppeteer");
const { uploadData } = require("./firebase");
const fs = require("fs");
const readOTP = require("./readOTP");

const updateFirebaseCookies = async () => {
  // Read the accounts from the file
  try {
    const accounts = JSON.parse(
      fs.readFileSync("./accounts.json", "utf-8")
    );
    console.log("Accounts read from file");
    console.log(accounts);

    for (const account of accounts) {
      const { name, username, password } = account;
      console.log(`Processing login for ${name}`);

      // call the fetchAndUpdateCookie function to start the login process for each account
      await fetchAndUpdateCookie(name, username, password);
    }
  } catch (e) {
    console.error("Error in processing login", e.message);
  }
};

async function fetchAndUpdateCookie(name, username, password) {
  let browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  const page = await browser.newPage();
  try {
    // Navigate to the login page
    await page.goto("https://expert.chegg.com/qna/authoring/answer", {
      waitUntil: "networkidle0",
    });

    // Type the username and press Enter
    await page.type("#username", username);

    // Type the password and press Enter
    await page.type("#password", password);
    await page.keyboard.press("Enter");
    
    // Wait for the new page to load after login
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Wait for OTP to arrive
    await new Promise(resolve => setTimeout(resolve, 15*1000));

    let otp = await readOTP();
    console.log(otp);

    await page.type("#code", otp);
    await page.keyboard.press("Enter");
    
    await page.waitForNavigation({ waitUntil: "networkidle2" });


    // Get cookies
    const cookies = await page.cookies();
    const joinedCookies = prepareCookies(cookies);
    //   console.log(joinedCookies);

    if (joinedCookies) {
      const dataToUpload = {
        name: name,
        cookie: joinedCookies,
      };

      // Call the Firebase upload function
      await uploadData(dataToUpload);
      console.log("Cookie uploaded successfully");
    } else {
      console.log("Auth cookie not found!");
    }

    await browser.close();
  } catch (error) {
    console.error(`Error in fetching cookie for ${name}: ${error.message}`);
    await browser.close();
  }
}

function prepareCookies(cookies) {
  const parts = [];
  for (let cookie of cookies) {
    let part = `${cookie.name}=${cookie.value};`;
    parts.push(part);
  }
  return parts.join(" ");
}
updateFirebaseCookies();

console.log("this is working");

module.exports = { updateFirebaseCookies };
