import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";

export class SkipCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "skip",
      description: "⏭️ | Skips the current track and plays the next one in the queue.",
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
    console.log(queue);
    queue.node.skip();

    const embed = new EmbedBuilder()
      .setColor(Colors.Fuchsia)
      .setDescription(`:track_next: | Skipped to the next track`);

    return interaction.reply({ embeds: [embed] });
  }
}
