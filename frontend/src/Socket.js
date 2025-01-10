import {io} from "socket.io-client";
const URL=process.env.NODE_ENV==='production' ? 'ttps://chat-app-bxnf.vercel.app' : "http://localhost:5000";
export const socket=io(URL)