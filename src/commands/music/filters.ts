import { Command } from '@sapphire/framework';
import { FiltersName, useQueue } from 'discord-player';

export class FiltersCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'filters',
            description: '🎚️ | The FFmpeg filters that can be applied to tracks',
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
                            .setName('filter')
                            .setDescription('The FFmpeg filter to use')
                            .addChoices(
                                { name: 'Off', value: 'Off' },
                                ...([
                                    { name: 'lofi', value: 'lofi' },
                                    { name: '8D', value: '8D' },
                                    { name: 'bassboost', value: 'bassboost' },
                                    { name: 'compressor', value: 'compressor' },
                                    { name: 'karaoke', value: 'karaoke' },
                                    { name: 'vibrato', value: 'vibrato' },
                                    { name: 'vaporwave', value: 'vaporwave' },
                                    { name: 'nightcore', value: 'nightcore' },
                                    { name: 'tremolo', value: 'tremolo' },
                                ] as { name: FiltersName; value: FiltersName }[])
                            )
                            .setRequired(true)
                    ),
            process.env.NODE_ENV == 'dev' ? { guildIds: [process.env.TEST_GUILD!] } : undefined
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const queue = useQueue(interaction.guild!.id)!;
        const filter = interaction.options.getString('filter') as FiltersName | 'Off';

        if (!queue.filters.ffmpeg)
            return interaction.reply({
                content: `❌ | The FFmpeg filters are not available to be used in this queue`,
                ephemeral: true,
            });

        if (filter === 'Off') {
            await queue.filters.ffmpeg.setFilters(false);
            return interaction.reply({
                content: `🎚️ | Audio filter has been disabled`,
            });
        }

        await queue.filters.ffmpeg.toggle(
            filter.includes('bassboost') ? ['bassboost', 'normalizer'] : filter
        );

        return interaction.reply({
            content: `🎚️ | **${filter}** filter has been **${
                queue.filters.ffmpeg.isEnabled(filter) ? 'enabled' : 'disabled'
            }**`,
        });
    }
}
