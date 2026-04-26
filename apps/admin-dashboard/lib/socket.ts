import { io } from "socket.io-client";

export const socket = typeof window !== "undefined" ? io("http://localhost:4000") : null;
