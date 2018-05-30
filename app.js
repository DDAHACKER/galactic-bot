const Discord = require('discord.js');
const eco = require('discord-eco');
const fs = require('fs');
const settings = require('./settings.json');
const colors = require('./jsons/colors.json');
const bot = new Discord.Client();
var prefix = "eco.";
let userData = JSON.parse(fs.readFileSync('./jsons/userData.json', 'utf8'));
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers`);
});
bot.on("guildMemberAdd", async member => {
  let wChanel = member.guild.channels.find("name", "join-leave");
  wChanel.send(`Welcome ${member.user}! Please go to ${member.guild.channels.find("name", "rules")} to review the rules!`)
  let role = member.guild.roles.find("name", "New");
  member.addRole(role);
});
bot.on("message", async message => {
  let sender = message.author;
  let msg = message.content.toLowerCase();
  let args = message.content.slice(prefix.length).trim().split(' ');
  if(!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
  if(!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 0;
  fs.writeFile('./jsons/userData.json', JSON.stringify(userData), (err) => {
    if(err)console.error(err);
  });
  if(msg === `${prefix}test`) {
    message.channel.send("This is a test!");
  }
  if(msg === `${prefix}bal` || msg === `${prefix}balance` || msg === `${prefix}money`) {
    let user = message.mentions.users.first() || message.author;
    if(user) {
      message.channel.send({embed: {
        title:`${message.guild.name}'s Bank`,
        color:0xffffff,
        fields: [{
          name:"Account Holder:",
          value:`${user.username}`,
          inline:true
        },
        {
          name:"Balance:",
          value:userData[user.id + message.guild.id].money,
          inline:true
        }]
      }})
      return;
    }
  }
});
bot.login(settings.token);
