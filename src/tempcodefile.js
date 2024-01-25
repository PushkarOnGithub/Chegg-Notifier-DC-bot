let on = 0;
let forceOn = 0;

let currHours = (new Date(Date.now())).getHours();
currHours = 1;
console.log(currHours>=8 && !on);
console.log(0 < currHours && currHours < 8 && !forceOn);