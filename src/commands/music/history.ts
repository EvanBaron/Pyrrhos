import { Command } from '@sapphire/framework';

export class HistoryCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'history',
            description: '🟦 | Displays the queue history in an embed.',
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
