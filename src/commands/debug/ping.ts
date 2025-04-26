import { Command } from "@sapphire/framework";

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "ping",
      description: "❗ | Ping the bot to verify the latency.",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      process.env.NODE_ENV == "dev" ? { guildIds: [process.env.TEST_GUILD!] } : undefined,
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const interactionReply = await interaction.deferReply({
      fetchReply: true,
    });

    return interaction.editReply({
      content: `API Latency: ${this.container.client.ws.ping}\nPing: ${
        interactionReply.createdTimestamp - interaction.createdTimestamp
      }`,
    });
  }
}
