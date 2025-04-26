import { Command } from "@sapphire/framework";
import { useTimeline } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";

export class PauseCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "pause",
      description: "⏸️ | Pauses or resumes the current track.",
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
    const timeline = useTimeline()!;

    const state = timeline.paused;
    state ? timeline.resume() : timeline.pause();

    const embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setDescription(`⏸️ | Playback has been \`${state ? "resumed" : "paused"}\``);

    return interaction.reply({ embeds: [embed] });
  }
}
