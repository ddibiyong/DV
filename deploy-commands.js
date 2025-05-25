const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[경고] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`${commands.length}개의 슬래시 커맨드를 새로고침 합니다.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`성공적으로 ${data.length}개의 슬래시 커맨드를 새로고침 하였습니다.`);
  } catch (error) {
    console.error(error);
  }
})();
