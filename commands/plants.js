const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = './players.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plant')
        .setDescription('Pflanze eine Koka Pflanze (max. 1 pro Tag)'),

    async execute(interaction) {
        const userId = interaction.user.id;
        let data = {};
        if (fs.existsSync(path)) {
            data = JSON.parse(fs.readFileSync(path, 'utf8'));
        }

        const now = new Date();

        if (!data[userId]) data[userId] = { money: 100, plants: [], lastPlant: null };

        if (data[userId].lastPlant) {
            const lastPlantDate = new Date(data[userId].lastPlant);
            if (now.toDateString() === lastPlantDate.toDateString()) {
                const tomorrow = new Date(now);
                tomorrow.setDate(now.getDate() + 1);
                tomorrow.setHours(0,0,0,0);

                const diff = tomorrow - now;
                const hours = Math.floor(diff/1000/60/60);
                const minutes = Math.floor((diff/1000/60)%60);
                const seconds = Math.floor((diff/1000)%60);

                return interaction.reply(`❌ Du hast heute schon gepflanzt! Du kannst wieder pflanzen in ${hours}h ${minutes}m ${seconds}s.`);
            }
        }

        data[userId].plants.push({ growth: 0, plantedAt: now.toISOString() });
        data[userId].lastPlant = now.toISOString();

        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        await interaction.reply(`🌿 Du hast eine neue Pflanze gepflanzt! Du hast jetzt ${data[userId].plants.length} Pflanze(n).`);
    }
};