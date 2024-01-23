const accountss = require('./accounts');
const User = require('./user');

const accounts = [];

for(let i = 0;i<accountss.length;i++){
    const account = new User(accountss[i].name, accountss[i].options, {}, Math.floor(Date.now()/1000));
    accounts.push(account);
}

// accounts[0].fetchDataFromApi().then((data)=>{
//     console.log(data);
// })


setInterval(async () => {
  for(let i = 0;i<accounts.length;i++){
    const account = accountss[i];
  try {
    let data;
    account.fetchDataFromApi().then((fetchedData)=>{
      data = fetchedData;
  }).catch((error)=>{
    console.log(account.name,"Error while Fetching ",  error);
  })
  // Check data is fetched if not continue to next account;
  if(!data){
    continue;
  }

  // Check if newData and lastData are equal
  if(JSON.stringify(data) != JSON.stringify(account.lastData)){
    console.log("Either data are equal or there is no fetched Data");
    account.upDateLastData(data);
  }
  // If data don't have a question : continue
  if (data.errors) {
    console.log( account.name , "Waiting for 1 minute...");
    continue;
  }
  // If data have a question : send a message by the bot

  

  } catch (error) {
    console.error('Error fetching data:', error);
  }}
}, 60 * 1000); // Convert time to milliseconds