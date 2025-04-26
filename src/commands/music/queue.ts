import { Command } from "@sapphire/framework";
import { useQueue } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";

export class QueueCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "queue",
      description: "🟦 | Displays the queue in an embed.",
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

    const currentTrack = queue.currentTrack;
    const upcomingTracks = queue.tracks.toArray().slice(0, 5);

    const embed = new EmbedBuilder().setColor(Colors.NotQuiteBlack).setDescription(`
              Now playing: ${currentTrack?.title} - ${currentTrack?.author} \n
              Upcoming tracks: ${upcomingTracks.map((track, index) => `${index + 1}. ${track.title} - ${track.author}`).join("\n")}
            `);

    return interaction.reply({ embeds: [embed] });
  }
}
