import { container, Listener } from "@sapphire/framework";
import { type Track } from "discord-player";
import { Colors } from "discord.js";

export class PlayerEvent extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      emitter: container.client.player.events,
      event: "playerStart",
    });
  }

  public run(
    queue: {
      metadata: {
        channel: {
          send: (arg0: {
            embeds: {
              title: string;
              description: string;
              color: number;
              footer: { text: string };
              thumbnail: { url: string };
            }[];
          }) => any;
        };
      };
    },
    track: Track,
  ) {
    return queue.metadata.channel.send({
      embeds: [
        {
          title: "Now Playing",
          description: `🎵 | **${track.title || "Unknown Title"}**`,
          color: Colors.Green,
          footer: {
            text: `${track.url}`,
          },
          thumbnail: {
            url: track.thumbnail,
          },
        },
      ],
    });
  }
}
