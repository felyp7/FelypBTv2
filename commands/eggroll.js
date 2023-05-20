const fs = require("fs");
const { client, checkCooldown} = require('/home/ubuntu/BOT/BOTv2.js');

const cooldowns = {};

const eggrollsFile = '/home/ubuntu/BOT/eggrolls.json';
let usersData = {};
try {
  const jsonData = fs.readFileSync(eggrollsFile, 'utf8');
  usersData = JSON.parse(jsonData);
} catch (err) {
  console.error('Error reading JSON file:', err);
}

module.exports = {
  name: 'eggroll',
  description: 'xD',
  cooldown: 5,
   execute(client, channel, user, args) {
    
        
    const userCooldown = cooldowns[user.username] || 0;
    const cooldownDuration = 2405000; 
    const remainingTimeMs = userCooldown + cooldownDuration - Date.now();
  
    if (remainingTimeMs > 0) {
      const remainingHours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
      const remainingSeconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);
      const cooldownMessage = `@${user.username}, you are on cooldown. Please wait ${remainingHours} hours, ${remainingMinutes} minutes, and ${remainingSeconds} seconds before using the command again.`;
      client.action(channel, cooldownMessage);
      return;
    }

    function getRandomNumber() {
      const probabilities = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      const totalProbability = probabilities.reduce((a, b) => a + b, 0);
    
      const randomNumber = Math.random() * totalProbability;
    
      let sum = 0;
      for (let i = 0; i < probabilities.length; i++) {
        sum += probabilities[i];
        if (randomNumber < sum) {
          return i + 1;
        }
      }
    
      return 10; // fallback to 10 if the loop fails for some reason
    }
    
    const numbersArray = [];
    for (let i = 0; i < 10; i++) {
      numbersArray.push(i + 1);
    }
    
    const randomIndex = getRandomNumber() - 1;
    const randomNumber = numbersArray[randomIndex];
    console.log(randomNumber);

    const username = user.username;
    let points = usersData[username] || 0;

    const pointsToAdd = randomNumber
    points += pointsToAdd
    usersData[username] = points;

    let totalPoints = 270;
    for (const username in usersData) {
    if (usersData.hasOwnProperty(username)) {
    const points = usersData[username];
    totalPoints += points;
  }
}

      client.action(channel, `@${user.username} HUHH Egg roll has been eaten (+${randomNumber}), egg rolls eaten: ${points}, total eggrolls: ${totalPoints} 🥚 🌯 `)
    // Convert the updated usersData object to JSON format
    const jsonData = JSON.stringify(usersData);

   
    fs.writeFile(eggrollsFile, jsonData, 'utf8', (err) => {
    if (err) {
    console.error('Error writing JSON file:', err);
    } else {
    console.log('Points have been updated and saved to', eggrollsFile);
    }
  });
  
  cooldowns[user.username] = Date.now() + cooldownDuration;
  },
};
