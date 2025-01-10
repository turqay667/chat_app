import {io} from "socket.io-client";
const URL=process.env.NODE_ENV==='production' ? 'https://chat-app-bxnf-17xxl1swm-turqay667s-projects.vercel.app/' : "http://localhost:5000";
export const socket=io(URL)