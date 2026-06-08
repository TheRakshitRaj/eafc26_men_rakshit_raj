import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Player from '../models/Player.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = [
  {
    username: 'admin',
    email: 'admin@analytics.com',
    password: 'adminpassword',
    role: 'admin'
  },
  {
    username: 'rakshit',
    email: 'rakshit@analytics.com',
    password: 'userpassword',
    role: 'user'
  }
];

const seedData = async () => {
  try {
    // 1. Establish DB Connection
    await connectDB();

    console.log('Seeder: Connected to database. Cleaning up existing collections...');

    // 2. Clear Existing Collections
    await User.deleteMany();
    console.log('Seeder: Cleared all user profiles.');

    await Player.deleteMany();
    console.log('Seeder: Cleared all player profiles.');

    // 3. Seed Users
    console.log('Seeder: Seeding demo users...');
    for (const u of users) {
      await User.create(u);
    }
    console.log(`Seeder: Successfully seeded ${users.length} user profiles.`);

    // 4. Load players.json
    const playersPath = path.join(__dirname, 'players.json');
    if (!fs.existsSync(playersPath)) {
      throw new Error(`Dataset file players.json not found at: ${playersPath}`);
    }

    console.log('Seeder: Loading and parsing players.json...');
    const rawData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
    console.log(`Seeder: Loaded ${rawData.length} records. Transforming and deduplicating data...`);

    const nameSet = new Set();
    const transformed = [];

    for (const item of rawData) {
      if (!item.Name || !item.OVR) continue;

      // Deduplicate using combination of Name, Age, and Team
      const uniqKey = `${item.Name}_${item.Age || '0'}_${item.Team || 'Unknown'}`;
      if (nameSet.has(uniqKey)) continue;
      nameSet.add(uniqKey);

      // Robustly parse play styles (from string representation of array if needed)
      let playstyles = [];
      if (item['play style']) {
        try {
          const formatted = item['play style'].replace(/'/g, '"');
          playstyles = JSON.parse(formatted);
        } catch (e) {
          playstyles = item['play style']
            .replace(/[\[\]']/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        }
      }

      transformed.push({
        name: item.Name,
        overall: parseInt(item.OVR, 10) || 50,
        pace: parseInt(item.PAC, 10) || 50,
        shooting: parseInt(item.SHO, 10) || 50,
        passing: parseInt(item.PAS, 10) || 50,
        dribbling: parseInt(item.DRI, 10) || 50,
        defending: parseInt(item.DEF, 10) || 50,
        physical: parseInt(item.PHY, 10) || 50,
        team: item.Team || 'Unknown',
        league: item.League || 'Unknown',
        nation: item.Nation || 'Unknown',
        position: item.Position || 'CM',
        age: parseInt(item.Age, 10) || 25,
        playstyles,
        weakFoot: parseInt(item['Weak foot'], 10) || 3,
        skillMoves: parseInt(item['Skill moves'], 10) || 3,
        preferredFoot: item['Preferred foot'] === 'Left' ? 'Left' : 'Right',
        gender: item.GENDER === 'F' ? 'Female' : 'Male',
        rank: parseInt(item.Rank, 10) || null,
        card: item.card || null
      });
    }

    console.log(`Seeder: Deduplicated into ${transformed.length} unique player profiles. Committing bulk insertion...`);

    // 5. Bulk insert in batches of 2000
    const batchSize = 2000;
    for (let i = 0; i < transformed.length; i += batchSize) {
      const batch = transformed.slice(i, i + batchSize);
      await Player.insertMany(batch);
      console.log(`Seeder: Inserted players batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformed.length / batchSize)}`);
    }

    console.log('Seeder: Data seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Seeder: Fatal seeding error occurred:', error);
    process.exit(1);
  }
};

seedData();
