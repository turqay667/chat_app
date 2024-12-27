import {io} from "socket.io-client";
const URL=process.env.NODE.env==='production' ? undefined : "http://localhost:5137/";
export const socket=io(URL)