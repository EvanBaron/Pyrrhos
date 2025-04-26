import { Command } from "@sapphire/framework";
import { Player, QueryType, useMainPlayer } from "discord-player";
import { Colors, EmbedBuilder, GuildMember, MessageFlags } from "discord.js";

export class PlayCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "play",
      description: "🎵 | Plays/Enqueues the track(s) provided in the query.",
      preconditions: ["Voice"],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName("query")
              .setDescription("Provide a name/url for the song/playlist")
              .setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName("platform")
              .setDescription("(Optional) Select in which platform the search will be made")
              .setRequired(false)
              .addChoices(
                { name: "Youtube", value: "Youtube" },
                { name: "Spotify", value: "Spotify" },
                { name: "Soundcloud", value: "Soundcloud" },
              ),
          ),
      process.env.NODE_ENV == "dev" ? { guildIds: [process.env.TEST_GUILD!] } : undefined,
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;

    const platform = interaction.options.getString("platform");

    let searchEngine;
    switch (platform) {
      case "Youtube": {
        searchEngine = QueryType.YOUTUBE_SEARCH;
        break;
      }
      case "Spotify": {
        searchEngine = QueryType.SPOTIFY_SEARCH;
        break;
      }
      case "Soundcloud": {
        searchEngine = QueryType.SOUNDCLOUD_SEARCH;
        break;
      }
      default: {
        searchEngine = QueryType.YOUTUBE_SEARCH;
      }
    }

    const player = useMainPlayer() as Player;
    const query = interaction.options.getString("query");

    const searchResults = await player.search(query!, { requestedBy: interaction.user, searchEngine });

    if (!searchResults.hasTracks())
      return interaction.reply({
        content: `⚠️ | Sorry, found no tracks related to your query.`,
        flags: MessageFlags.Ephemeral,
      });

    await interaction.deferReply();

    try {
      const result = await player.play(member.voice.channel?.id!, searchResults, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            client: interaction.guild?.members.me,
            requestedBy: interaction.user.username,
          },
          selfDeaf: true,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 300000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 300000,
        },
      });

      const embed = new EmbedBuilder()
        .setColor(Colors.Blurple)
        .setDescription(
          result.track.playlist
            ? `✅ | Added track(s) from : \`${result.track.playlist.title}\` - ${result.track.playlist.estimatedDuration} to the queue`
            : `✅ | Added \`${result.track.title}\` - \`${result.track.duration}\` to the queue.`,
        );

      return interaction.followUp({ embeds: [embed] });
    } catch (error: any) {
      this.container.logger.error(`Unexpected error in command [${this.name}]`, error);

      return interaction.followUp({
        content: `⚠️ | Sorry, there was an error with the command, please try again.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
