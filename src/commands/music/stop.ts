import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";
export class StopCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "stop",
      description: "⏹️ | Destroy the queue and disconnect the bot.",
      preconditions: ["Voice", "Queue"],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      process.env.NODE_ENV == "dev" ? { guildIds: [process.env.TEST_GUILD!] } : undefined,
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = useQueue(interaction.guild!.id)!;
    queue.delete();

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setDescription(`⏹️ | destroyed the queue and disconnected the bot.`);

    return interaction.reply({ embeds: [embed] });
  }
}
