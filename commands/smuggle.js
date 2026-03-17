const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = './players.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('smuggle')
        .setDescription('Schmuggle deine Ware'),

    async execute(interaction) {
        const userId = interaction.user.id;
        let data = {};
        if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path, 'utf8'));

        if (!data[userId]) data[userId] = { money: 100, plants: [], lastPlant: null };

        const chance = Math.random() < 0.5;
        const amount = Math.floor(Math.random()*200) + 50;

        if (chance) {
            data[userId].money += amount;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return interaction.reply(`🚚 Schmuggel erfolgreich! Du hast ${amount} $ verdient. Kontostand: ${data[userId].money} $`);
        } else {
            const loss = Math.min(data[userId].money, amount);
            data[userId].money -= loss;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return interaction.reply(`💀 Schmuggel fehlgeschlagen! Du hast ${loss} $ verloren. Kontostand: ${data[userId].money} $`);
        }
    }
};