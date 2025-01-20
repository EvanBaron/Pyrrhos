import { Command } from '@sapphire/framework';
import { QueueRepeatMode, useQueue } from 'discord-player';
import { Colors, EmbedBuilder } from 'discord.js';

export class RepeatCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'repeat',
            description: '🔁 | Repeat the current playling track or the entire queue.',
            preconditions: ['Voice', 'Queue'],
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
                            .setName('mode')
                            .setDescription('Select the repeat mode.')
                            .addChoices(
                                { name: 'OFF', value: 'OFF' },
                                { name: 'QUEUE', value: 'QUEUE' },
                                { name: 'AUTOPLAY', value: 'AUTOPLAY' },
                                { name: 'TRACK', value: 'TRACK' }
                            )
                            .setRequired(true)
                    ),
            process.env.NODE_ENV == 'dev' ? { guildIds: [process.env.TEST_GUILD!] } : undefined
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const queue = useQueue(interaction.guild!.id)!;

        const mode = interaction.options.getString('mode');

        switch (mode) {
            case 'OFF': {
                queue.setRepeatMode(QueueRepeatMode.OFF);
            }
            case 'QUEUE': {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
            }
            case 'AUTOPLAY': {
                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            }
            case 'TRACK': {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Orange)
            .setDescription(`:repeat: | Changed the repeat mode to: ${mode}`);

        return interaction.reply({ embeds: [embed] });
    }
}
