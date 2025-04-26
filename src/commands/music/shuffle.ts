import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";
import { Colors, EmbedBuilder, MessageFlags } from "discord.js";

export class ShuffleCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "shuffle",
      description: "🔀 | Shuffles the tracks in the queue.",
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

    if (queue.tracks.size! < 2)
      return interaction.reply({
        content: `❌ | There are not enough tracks in the queue to shuffle.`,
        flags: MessageFlags.Ephemeral,
      });

    queue.tracks.shuffle();

    const embed = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setDescription(`🔀 | The queue has been shuffled`);

    return interaction.reply({ embeds: [embed] });
  }
}
