import { Precondition } from "@sapphire/framework";
import { CommandInteraction, GuildMember, PermissionsBitField } from "discord.js";

export class VoicePrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    const condition =
      this.clientPermissions(interaction) ||
      this.memberPermissions(interaction, interaction.member! as GuildMember) ||
      this.clientToMemberPermissions(interaction, interaction.member! as GuildMember);

    if (condition !== undefined) return this.error({ message: condition });

    return this.ok();
  }

  private clientPermissions(interaction: CommandInteraction) {
    const resolved = new PermissionsBitField([
      PermissionsBitField.Flags.Connect,
      PermissionsBitField.Flags.Speak,
      PermissionsBitField.Flags.ViewChannel,
    ]);

    const missingPermissions = interaction.guild?.members.me?.voice.channel
      ?.permissionsFor(interaction.guild.members.me)
      .missing(resolved);

    if (missingPermissions?.length)
      return `⚠️ | I was unable to join your voice channel, missing permissions : \`${missingPermissions.join(
        ", ",
      )}\``;

    return;
  }

  private memberPermissions(interaction: CommandInteraction, target: GuildMember) {
    if (!target.voice.channel) {
      return interaction.member?.user.id == target.user.id
        ? `❌ | You need to be in a voice channel to use this command.`
        : `❌ | ${target.displayName} is not in a voice channel.`;
    }

    return;
  }

  private clientToMemberPermissions(interaction: CommandInteraction, target: GuildMember) {
    const me = interaction.guild?.members.me!;

    if (me.voice.channelId && me.voice.channelId !== target.voice.channelId)
      return `❌ | You need to be in my voice channel (${me.voice.channel}) to use this command.`;

    return;
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    Voice: never;
  }
}

export default undefined;
