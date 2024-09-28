const fs = require("fs");
const fetchAndUpdateCookie = require("./fetchAndUpdateCookie");

const updateFirebaseCookies = async () => {
  // Read the accounts from the file
  const accounts = JSON.parse(fs.readFileSync(process.env.accountsFilePath, "utf-8"));

  async function processAccounts() {
    for (const account of accounts) {
      const { name, username, password } = account;
      console.log(`Processing login for ${name}`);

      // call the fetchAndUpdateCookie function to start the login process for each account
      try{
        await fetchAndUpdateCookie(name, username, password);
      }catch(e){
        console.error(`Error in processing login for ${name}: ${e.message}`);
      }
    }
  }

  // Call the processAccounts function to start the login process for each account
  processAccounts();
};

module.exports = updateFirebaseCookies;