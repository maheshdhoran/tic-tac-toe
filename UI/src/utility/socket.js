import io from 'socket.io-client';
import { serverURL } from './constants';

export const Socket = io(`http://${serverURL}`);

