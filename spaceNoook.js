//L179
const { Client, GatewayIntentBits, ActivityType, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const logChannelId = '1183764231481467030'; // je sais plus a quoi il sert 
const mutedRoleID = '1178641957682159699'; // Remplacez Id du role pour savoir quoi ajouté pour le mute
const prefix = '!'; 

client.on("ready", () => {
  client.user.setPresence({
    activities: [{ name: `Bot en dev`, type: ActivityType.Watching }],
    status: 'online',
  });
  console.log('Space Nook a décolé avec sucès');
});



client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  console.log(message);
   if (message.content === "!cmd") {
    if (message.member.roles.cache.has('752572160299630752')) {
      message.reply("Je vais noter ici toutes les commandes et ce qu'elles font quand j'aurai fini.");
    } else {
      message.reply("Vous ne pouvez pas utiliser cette commande.");
    }
  } else if (message.content === "!help") {
    message.reply("Certaines commandes ne sont pas encore disponibles.");
  }  else if (message.content === "!modo") {
    message.channel.send("<@&985315789290749993>");
  }

// marche !mute
{
  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}mute`)) {
    // Vérifiez les autorisations de l'utilisateur qui envoie la commande
    if (!message.member.permissions.has('MANAGE_ROLES')) {
      return message.reply("Vous n'avez pas la permission de mute des membres.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Veuillez mentionner un membre à mute.");
    }

    const mutedRole = message.guild.roles.cache.get(mutedRoleID);
    if (!mutedRole) {
      return message.reply("Le rôle de mute n'a pas été configuré correctement.");
    }

    // Ajoute le rôle de mute à l'utilisateur
    await member.roles.add(mutedRole);
    message.reply(`${member.user.tag} a été mute.`);
  }

  if (message.content.startsWith(`${prefix}unmute`)) {
    // Vérifiez les autorisations de l'utilisateur qui envoie la commande
    if (!message.member.permissions.has('MANAGE_ROLES')) {
      return message.reply("Vous n'avez pas la permission de unmute des membres.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Veuillez mentionner un membre à unmute.");
    }

    const mutedRole = message.guild.roles.cache.get(mutedRoleID);
    if (!mutedRole) {
      return message.reply("Le rôle de mute n'a pas été configuré correctement.");
    }

    // Retire le rôle de mute à l'utilisateur
    await member.roles.remove(mutedRole);
    message.reply(`${member.user.tag} a été unmute.`);
  }
};
// marche !ping delais 
{
  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}ping`)) {
    const startTime = Date.now();
    const sentMessage = await message.reply("Pinging...");

    const endTime = Date.now();
    const ping = endTime - startTime;

    sentMessage.edit(`Il y a ${ping}ms un con à parler`);
  }
};
//marche pas !block
{
  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}block`)) {
    // Vérifiez les autorisations de l'utilisateur qui envoie la commande
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.reply("Vous n'avez pas la permission de bloquer des canaux.");
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply("Veuillez mentionner un canal à bloquer.");
    }

    // Bloquer le canal en désactivant la permission 'SEND_MESSAGES'
    await channel.permissionOverwrites.edit(message.guild.id, {
      SEND_MESSAGES: false,
    });

    message.reply(`Le canal ${channel.name} a été bloqué.`);
  }

  if (message.content.startsWith(`${prefix}unblock`)) {
    // Vérifiez les autorisations de l'utilisateur qui envoie la commande
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.reply("Vous n'avez pas la permission de débloquer des canaux.");
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply("Veuillez mentionner un canal à débloquer.");
    }

    // Débloquer le canal en réactivant la permission 'SEND_MESSAGES'
    await channel.permissionOverwrites.edit(message.guild.id, {
      SEND_MESSAGES: null,
    });

    message.reply(`Le canal ${channel.name} a été débloqué.`);
  }
};

// marche  ping  role 
{
  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}sky`)) {
    // Vérifiez les autorisations de l'utilisateur qui envoie la commande
    if (!message.member.permissions.has('MENTION_EVERYONE')) {
      return message.reply("Vous n'avez pas la permission de ping le rôle.");
    }

    // Récupérez le texte après !sky
    const phrase = message.content.slice(`${prefix}sky`.length).trim();

    // Vérifiez si une phrase a été fournie
    if (!phrase) {
      return message.reply("Veuillez fournir une phrase à répéter.");
    }
// serv teste 
    // Récupérez le rôle à pinguer (remplacez 'ID_DU_ROLE' par l'ID de votre rôle)
    const role = message.guild.roles.cache.get('1169050542044106762');

    // Vérifiez si le rôle existe
    if (!role) {
      return message.reply("Le rôle à pinguer n'a pas été trouvé.");
    }

   // Ping le rôle et répète la phrase
message.channel.send(`${role.toString()} ${phrase}`);


    // Supprimez le message de l'auteur de la commande
    message.delete();

    // Ajoutez une confirmation dans le canal où la commande a été envoyée
    //message.channel.send(`Le rôle ${role.name} a été pingé avec le message : ${phrase}`);
  }
};
// le probleme est la
//!ban marche !ban + ping marche !ban + ping + argument marche pas 
  if (message.content.startsWith("!ban")) {
    // Séparez les arguments en utilisant des espaces
    const arguments = message.content.slice(5).trim().split(/ +/);

    // Vérifiez les autorisations du membre
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.channel.send("Vous n'avez pas cette autorisation.");
    }

    // Trouvez le membre à bannir
    const member = message.mentions.members.first() || message.guild.members.cache.get(arguments[0]);

    if (!member) {
      return message.channel.send("Utilisateur invalide.");
    }

    console.log("Commande !ban atteinte");

    if (message.member === member) {
      return message.channel.send("Vous ne pouvez pas vous bannir vous-même.");
    }

    if (!member.bannable) {
      return message.channel.send("Vous ne pouvez pas bannir cette personne !");
    }

    if (!arguments[1]) {
      return message.channel.send("Vous devez préciser une raison pour le bannissement.");
    }

    // Récupérez la raison du bannissement
    const reason = arguments.slice(1).join(" ");

    // Créez un message d'embed
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`:white_check_mark: ${member.user.tag} a été banni | ${reason}`);

    // Envoyez un message à l'utilisateur banni
    member.send({ embeds: [embed] }).catch((err) => {
      console.log(`${member.user.tag} a désactivé ses DMs et ne peut pas recevoir le message de bannissement.`);
    });

    // Bannissez le membre
    member.ban({ reason: reason }).then(() => {
      message.channel.send({ embeds: [embed] });
    }).catch((err) => {
      message.channel.send("Nous n'avons pas pu bannir ce membre.");
    });
  }
  
  client.on("guildMemberAdd", (member) => {
    // Récupérer le rôle "sky" (remplacez 'ID_DU_ROLE' par l'ID du rôle)
    const sRole = member.guild.roles.cache.get('1169050542044106762');
  
    // Vérifier si le rôle existe
    if (!srole) {
      console.error("Le rôle 'sky' n'a pas été trouvé.");
      return;
    }
  
    // Ajouter le rôle au nouveau membre
    member.roles.add(sRole)
      .then(() => {
        console.log(`Le rôle 'sky' a été ajouté à ${member.user.tag}`);
      })
      .catch((error) => {
        console.error(`Erreur lors de l'ajout du rôle 'sky' à ${member.user.tag}: ${error}`);
      });
  });
  
});
// j'ai le client login la 
