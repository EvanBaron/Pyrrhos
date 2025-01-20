import { Listener } from '@sapphire/framework';
import { useMainPlayer } from 'discord-player';
import { Client, Events } from 'discord.js';

export class ReadyListener extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: Events.ClientReady,
        });
    }

    public async run(client: Client) {
        const { username, id } = client.user!;

        const player = useMainPlayer()!;
        await player.extractors.loadDefault();

        this.container.logger.info(`Successfully Logged in as ${username} (${id})`);
    }
}
