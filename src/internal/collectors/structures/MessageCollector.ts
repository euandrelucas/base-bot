import Collector, { CollectorOptions } from './Collector.js';
import * as Oceanic from 'oceanic.js';

export type MessageCollectorEndReasons = 'guildDelete' | 'channelDelete' | 'threadDelete';

export class MessageCollector<T extends Oceanic.AnyTextableChannel> extends Collector<Oceanic.Message<T>, MessageCollectorEndReasons> {
	/**
	 * @param client The Oceanic client to apply the collector on.
	 * @param options The collector options.
	 */
	public constructor(private client: Oceanic.Client, private channel: T, public options: CollectorOptions<Oceanic.Message<T>> = {}) {
		super(options);

		const bulkDeleteListener = (messages: Oceanic.PossiblyUncachedMessage[]): void => {
			for (const message of messages.values()) this.handleDispose(message);
		};

		this.handleChannelDeletion = this.handleChannelDeletion.bind(this);
		this.handleThreadDeletion = this.handleThreadDeletion.bind(this);
		this.handleGuildDeletion = this.handleGuildDeletion.bind(this);

		this.client.on('messageCreate', this.handleCollect);
		this.client.on('messageDelete', this.handleDispose);
		this.client.on('messageDeleteBulk', bulkDeleteListener);
		this.client.on('channelDelete', this.handleChannelDeletion);
		this.client.on('threadDelete', this.handleThreadDeletion);
		this.client.on('guildDelete', this.handleGuildDeletion);

		this.once('end', () => {
			this.client.removeListener('messageCreate', this.handleCollect);
			this.client.removeListener('messageDelete', this.handleDispose);
			this.client.removeListener('messageDeleteBulk', bulkDeleteListener);
			this.client.removeListener('channelDelete', this.handleChannelDeletion);
			this.client.removeListener('threadDelete', this.handleThreadDeletion);
			this.client.removeListener('guildDelete', this.handleGuildDeletion);
		});
	}

	private handleChannelDeletion(channel: Oceanic.AnyGuildChannelWithoutThreads | Oceanic.PrivateChannel | Oceanic.DeletedPrivateChannel): void {
		if (channel.id === this.channel.id || (this.channel instanceof Oceanic.GuildChannel && channel.id === this.channel.parentID)) {
			this.stop('channelDelete');
		}
	}

	private handleGuildDeletion(guild: Oceanic.Guild | Oceanic.Uncached): void {
		if (this.channel instanceof Oceanic.GuildChannel) {
			if (guild.id === this.channel.guildID) {
				this.stop('guildDelete');
			}
		}
	}

	private handleThreadDeletion(thread: Oceanic.PossiblyUncachedThread): void {
		if (thread.id === this.channel.id) {
			this.stop('threadDelete');
		}
	}

	protected collect(message: Oceanic.Message<T>): Oceanic.Message<T> | null {
		if (message.channelID !== this.channel.id) return null;

		return message;
	}

	protected dispose(message: Oceanic.PossiblyUncachedMessage): Oceanic.PossiblyUncachedMessage | null {
		if (message.channel?.id !== this.channel.id) return null;

		return message;
	}
}

/**
 * Await messages.
 * @param client The Oceanic client to apply the collector on.
 * @param channel The channel to await messages from.
 * @param options The options to await the messages with.
 */
export function awaitMessages<T extends Oceanic.AnyTextableChannel>(client: Oceanic.Client, channel: T, options: CollectorOptions<Oceanic.Message<T>> = {}): Promise<Oceanic.Message<T>[]> {
	return new Promise<Oceanic.Message<T>[]>((resolve): void => {
		const collector = new MessageCollector(client, channel, options);

		collector.once('end', (collectedMessages) => {
			resolve(collectedMessages);
		});
	});
}
