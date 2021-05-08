import Discord from "discord.js"
const client = new Discord.Client();
require('dotenv').config()

import { NodeVM } from "vm2"
const vm = new NodeVM({
    console: "redirect"
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let last_message: Discord.Message = undefined;

vm.on("console.log", (data) => {
    last_message.reply(data)
})

process.on('uncaughtException', (err) => {
	try {
        last_message.reply(err.message)
    } catch {}
})

client.on('message', msg => {
  if (msg.content.startsWith("!exeggute")) {
    const first_pos = msg.content.indexOf("```") + 3
    const second_pos = msg.content.indexOf("```", first_pos)
    const code = msg.content.substring(first_pos, second_pos)
    last_message = msg
    try {
        vm.run(code)
    } catch (err) {
        msg.reply((err as Error).message)
    }
  }
});

process.env["secret"]
client.login(process.env.secret);
