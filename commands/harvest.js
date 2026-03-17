const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = './players.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('harvest')
        .setDescription('Ernte deine Plantage'),

    async execute(interaction) {
        const userId = interaction.user.id;
        let data = {};
        if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path, 'utf8'));

        if (!data[userId] || data[userId].plants.length === 0)
            return interaction.reply('❌ Du hast noch keine Pflanzen zu ernten.');

        let earnings = 0;
        data[userId].plants.forEach(p => {
            earnings += Math.floor(p.growth/100*50); // jede Pflanze max 50 $
        });

        data[userId].money += earnings;
        data[userId].plants = [];

        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        await interaction.reply(`🌿 Du hast deine Pflanzen geerntet und ${earnings} $ bekommen! Dein Kontostand: ${data[userId].money} $`);
    }
};