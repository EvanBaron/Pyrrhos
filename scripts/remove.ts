import dotenv from "dotenv";

dotenv.config();

import { REST, Routes, APIUser } from "discord.js";

const rest = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN!);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  await rest.put(Routes.applicationGuildCommands(currentUser.id, process.env.TEST_GUILD!), {
    body: [],
  });

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;

    console.log(`Successfully deleted commands for development in ${process.env.TEST_GUILD!} as ${tag}`);
  })
  .catch(console.error);
