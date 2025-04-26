import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";

export class ClearCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "clear",
      description: "🆑 | Clears the current queue and removes all enqueued tracks.",
      preconditions: ["Voice", "Queue"],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addBooleanOption((option) =>
            option.setName("history").setDescription("Also clear the queue history").setRequired(false),
          ),
      process.env.NODE_ENV == "dev" ? { guildIds: [process.env.TEST_GUILD!] } : undefined,
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = useQueue(interaction.guild!.id)!;
    const history = interaction.options.getBoolean("history");

    queue.tracks.clear();
    if (history) queue.history.clear();

    const embed = new EmbedBuilder()
      .setColor(Colors.White)
      .setDescription(`🆑 | The queue has been cleared.`);

    return interaction.reply({ embeds: [embed] });
  }
}
