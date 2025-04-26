import { ChatInputCommandDeniedPayload, Events, Listener, UserError } from "@sapphire/framework";
import { MessageFlags } from "discord.js";

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
  public run({ message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({
        content,
      });
    }

    return interaction.reply({
      content,
      flags: MessageFlags.Ephemeral,
    });
  }
}
