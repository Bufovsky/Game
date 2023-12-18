import { io } from "socket.io-client";

class Socket
{
    constructor(config)
    {
        this.url = config.queue;
        this.conn = null;
    }

    connector()
    {
        this.conn = io(this.url, {
            transports: ["websocket"],
            withCredentials: true,
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });
    }

    queue(key, value)
    {
        // console.log(key);
        // console.log(value);
        this.conn.emit(key, value);
    }
}

export { Socket }