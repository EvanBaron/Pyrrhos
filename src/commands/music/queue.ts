import { Command } from '@sapphire/framework';
import { useQueue } from 'discord-player';

export class QueueCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'queue',
            description: '🟦 | Displays the queue in an embed.',
            preconditions: ['Voice', 'Queue'],
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) => builder.setName(this.name).setDescription(this.description),
            process.env.NODE_ENV == 'dev' ? { guildIds: [process.env.TEST_GUILD!] } : undefined
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        interaction.reply({ content: 'Not implemented', ephemeral: true });
    }
}
