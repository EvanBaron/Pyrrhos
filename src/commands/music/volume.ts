import { Command } from "@sapphire/framework";
import { useTimeline } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";

export class VolumeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "volume",
      description: "🔊 | Changes the volume of the track and entire queue.",
      preconditions: ["Voice", "Queue"],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount of volume you want to change to.")
              .setMinValue(0)
              .setMaxValue(100)
              .setRequired(false),
          ),
      process.env.NODE_ENV == "dev" ? { guildIds: [process.env.TEST_GUILD!] } : undefined,
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const timeline = useTimeline()!;
    const volume = interaction.options.getInteger("amount");

    const embed = new EmbedBuilder().setColor(Colors.NotQuiteBlack);

    if (!volume) {
      embed.setDescription(`🔊 | Current volume is \`${timeline.volume}%\``);
    } else {
      timeline.setVolume(volume);
      embed.setDescription(`🔊 | Changed the volume to \`${timeline.volume}%\``);
    }

    return interaction.reply({ embeds: [embed] });
  }
}
