import { Precondition } from '@sapphire/framework';
import { GuildQueue, useQueue } from 'discord-player';
import { CommandInteraction } from 'discord.js';

export class QueuePrecondition extends Precondition {
    public override async chatInputRun(interaction: CommandInteraction) {
        const queue = useQueue(interaction.guild!.id);

        const condition = this.queue(queue) || this.queuehasTracks(queue);

        if (condition !== undefined) return this.error({ message: condition });

        return this.ok();
    }

    private queue(queue: GuildQueue | null) {
        if (!queue) return `❌ | There's currently no queue.`;
    }

    private queuehasTracks(queue: GuildQueue | null) {
        if (!queue?.currentTrack) return `❌ | There's currently no track playing.`;
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        Queue: never;
    }
}

export default undefined;
