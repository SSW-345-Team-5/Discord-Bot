module.exports = {
    name: "say", 
    aliases: ["bc", "broadcast"], 
    category: "moderation",
    description: "Says your input via the bot",
    usage: "<input>", 
    run: async (client, message, args) =>{
        if(message.deleteable) message.delete();

        if(args.length < 1){
            return message.reply("Nothing to say?").then(n => n.delete(5000));
        }
        
        const roleColor = message.guild.me.displayHexColor === "#000000" ? "ffffff" : message.guild.me.displayHexColor;

        if(args[0].toLowerCase() === "embed"){
            const embed = new RichEmbed()
                .setColor(rolecolor)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setImage(client.user.displayAvatarURL)
                .setAuthor(message.author.name, message.author.displayAvatarURL)
                .setFooter(client.user.username, client.user.displayAvatarURL)

            message.channe.send(embed);
        }else{
            message.channel.send(args.join(" "));
        }
    }
}