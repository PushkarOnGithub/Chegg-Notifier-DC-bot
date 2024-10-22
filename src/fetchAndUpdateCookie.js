const puppeteer = require("puppeteer");
const { uploadData } = require("./firebase");

async function fetchAndUpdateCookie(name, username, password) {
  const browser = await puppeteer.launch({ headless: false }); // Launch without GUI
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

    console.log("Login successful, new page loaded!");

    // // Wait for the page to load after login

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
      const res = await uploadData(dataToUpload);
      console.log("Cookie uploaded successfully");
    } else {
      console.log("Auth cookie not found!");
    }

    await browser.close();
  } catch (error) {
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

module.exports = fetchAndUpdateCookie;
