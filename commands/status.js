const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = './players.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Zeigt Geld, Pflanzen und Wachstum an'),

    async execute(interaction) {
        const userId = interaction.user.id;
        let data = {};
        if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path, 'utf8'));

        if (!data[userId] || data[userId].plants.length === 0)
            return interaction.reply('❌ Du hast noch keine Pflanzen.');

        const plantsStatus = data[userId].plants
            .map((p, i) => `Pflanze ${i+1}: ${p.growth}% gewachsen`)
            .join('\n');

        await interaction.reply(`💰 Geld: ${data[userId].money} $\n🌿 Pflanzen:\n${plantsStatus}`);
    }
};