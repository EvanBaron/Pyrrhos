import { Command } from '@sapphire/framework';
import { useQueue } from 'discord-player';

export class HelpCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'help',
            description: '❓ | Get a list of all the commands for the bot.',
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
