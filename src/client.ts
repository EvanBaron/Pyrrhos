import { LogLevel, SapphireClient } from '@sapphire/framework';
import { Player } from 'discord-player';
import { GatewayIntentBits } from 'discord.js';

export class PyrrhosClient extends SapphireClient {
    public player: Player;

    public constructor() {
        super({
            disableMentionPrefix: true,
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
            logger: {
                level: LogLevel.Debug,
            },
        });

        this.player = new Player(this, {
            ytdlOptions: {
                filter: 'audioonly',
                quality: 'highestaudio',
            },
        });
    }
}

declare module 'discord.js' {
    interface Client {
        readonly player: Player;
    }
}
