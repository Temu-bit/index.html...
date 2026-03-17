require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Commands laden
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Bot online
client.once('ready', () => {
    console.log('Bot ist online!');

    // Pflanzenwachstum: jede Pflanze +10% alle 5 Minuten
    setInterval(() => {
        const path = './players.json';
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));

        for (const userId in data) {
            data[userId].plants.forEach(plant => {
                if (plant.growth < 100) {
                    plant.growth += 10;
                    if (plant.growth > 100) plant.growth = 100;
                }
            });
        }

        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        console.log('🌿 Pflanzen für alle Spieler gewachsen!');
    }, 5 * 60 * 1000);
});

// Interaktionen
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Ein Fehler ist aufgetreten.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);