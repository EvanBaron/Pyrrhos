import { Command } from "@sapphire/framework";
import { useMainPlayer, useQueue } from "discord-player";
import { Colors, EmbedBuilder, MessageFlags } from "discord.js";

export class LyricsCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "lyrics",
      description: "🎶 | Displays lyrics of the given track.",
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) => {
            return option
              .setName("track")
              .setDescription("The track of the lyrics to search.")
              .setRequired(false);
          }),
      process.env.NODE_ENV == "dev" ? { guildIds: [process.env.TEST_GUILD!] } : undefined,
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = useQueue(interaction.guild!.id)!;
    if (!queue?.currentTrack && !interaction.options.getString("track"))
      return interaction.reply({
        content: `❌ | There's currently no track playing.`,
        flags: MessageFlags.Ephemeral,
      });

    const player = useMainPlayer();

    const track = interaction.options.getString("track") || (queue.currentTrack?.title as string);
    const lyrics = await player.lyrics.search({ q: track }).catch(() => null);

    if (!lyrics)
      return interaction.reply({
        content: `⚠️ | Sorry, found no lyrics related to your track.`,
        flags: MessageFlags.Ephemeral,
      });

    const trimmedLyrics = lyrics[0].plainLyrics.substring(0, 1997);

    const embed = new EmbedBuilder()
      .setTitle(lyrics[0].name)
      .setAuthor({
        name: lyrics[0].artistName,
      })
      .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
      .setColor(Colors.Yellow);

    return interaction.reply({ embeds: [embed] });
  }
}
