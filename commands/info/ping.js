module.exports = {
    name: "ping",
    category: "info", 
    description: "Returns latency and API ping", 
    run: async (client, message, args) => {
        const msg = await message.channel.send("Pinging...");
        msg.edit(`Ping! \nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(cient.ping)}ms`);
    }
}