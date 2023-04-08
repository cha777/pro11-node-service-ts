import { EventEmitter } from 'events';
import WebSocket from 'ws';
import appConfig from '../app-config';
import Logger from '../libs/logger';
import { ClientType } from '../service/constants';

type SubscriptionCallback = (data: string) => void;

const logger = new Logger('launcher-socket-connection');

/**
 * This class provides an API to communicate with other processes using
 * IPC via WebSockets - Subscriber (Client) Version
 */

class IPCSocket extends EventEmitter {
  socket: WebSocket;
  subscriptions: Record<string, SubscriptionCallback[]>;

  constructor() {
    logger.info('Creating a new IPC socket');
    super();

    // Connecting to the websocket
    const ws = new WebSocket(`ws://localhost:${appConfig.port}`);
    this.socket = ws;
    this.subscriptions = {};

    ws.on('error', (error) => {
      this.emit('connect-error', error);
    });

    ws.on('open', () => {
      logger.info('Client Register as launcher connection');

      this.send('auth', { clientType: ClientType.Launcher });
      this.emit('auth-success');
    });

    ws.on('message', (data: string) => {
      const parsedData = JSON.parse(data) as string[];

      if (parsedData.length === 2) {
        const channel = parsedData[0];
        const data = parsedData[1];

        const subscriptions = this.subscriptions[channel];

        if (subscriptions) {
          subscriptions.forEach((callback) => {
            callback(data);
          });
        }
      }
    });

    ws.on('close', () => {
      this.emit('disconnect');
    });
  }

  /**
   * Send data to the subscribed process
   * @param channel channel name
   * @param data data to be send
   */

  send(channel: string, data?: string | object): void {
    const message = JSON.stringify([channel, data]);
    this.socket.send(message);
  }

  /**
   * Subscribing to a communication channel
   * @param channel channel name
   * @param callback subscription callback
   */
  subscribe(channel: string, callback: SubscriptionCallback): void {
    if (!this.subscriptions[channel]) {
      this.subscriptions[channel] = [];
    }

    this.subscriptions[channel].push(callback);
  }

  /**
   * Close the connection to subscribed process
   */
  close(): void {
    this.socket.close();
  }
}

export default IPCSocket;
