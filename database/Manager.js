const Guilds = require('./models/Guilds');
const mongoose = require('mongoose');

module.exports = class Manager {
    constructor() {
        mongoose.connect(process.env.MongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
        
        this.guilds = new Map();
        
        setInterval(() => {
            const guild = await Guilds.find({});
            for (const g of guild) {
                this.guilds.set(g.id, g);
            }
        }, 60000);
    }
    
    async getGuild(guildId) {
        const cachedGuild = this.guilds.get(guildId);
        
        if (!cachedGuild) {
            const e = await Guilds.findOne({ id: guildId });
            if (!e) return;
            this.guilds.set(e.id, e);
            
            return e;
        }
        else return cachedGuild;
    }
}
