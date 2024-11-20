const puppeteer = require("puppeteer");
const { uploadData } = require("./firebase");
const fs = require("fs");

const updateFirebaseCookies = async () => {
  // Read the accounts from the file
  try {
    const accounts = JSON.parse(
      fs.readFileSync(process.env.accountsFilePath, "utf-8")
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
  let browser;
  if (process.env.NODE_ENV === "development") {
    browser = await puppeteer.launch({ headless: false }); // Launch with GUI
  } else {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      headless: true,
    }); // Launch without GUI
  }
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
    await page.keyboard.press("Enter"); // Press Enter after password

    // Wait for the new page to load after login
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("Login successful, reading cookies...");

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


module.exports = {updateFirebaseCookies};
