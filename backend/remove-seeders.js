const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend', 'dev.db');
const db = new sqlite3.Database(dbPath);

const seedersToRemove = [
  '20240918205229-demo-user.js',
  '20240923165821-demo-spots.js',
  '20240923174940-demo-reviews.js',
  '20240923182700-demo-bookings.js',
  '20241017193233-demo-spot-images.js',
  '20231018120000-demo-spot-images.js',
  '20231018000001-demo-user.js',
  '20231018000002-demo-spots.js',
  '20231018000003-demo-spot-images.js'
];

db.serialize(() => {
  // Check if SequelizeData table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='SequelizeData'", (err, row) => {
    if (err) {
      console.error('Error checking for SequelizeData table:', err);
      db.close();
      return;
    }

    if (row) {
      // If SequelizeData table exists, remove seeders
      seedersToRemove.forEach(seeder => {
        db.run(`DELETE FROM SequelizeData WHERE name = ?`, seeder, function(err) {
          if (err) {
            console.error(`Error removing seeder ${seeder}:`, err);
          } else {
            console.log(`Removed seeder: ${seeder}`);
          }
        });
      });
    } else {
      console.log('SequelizeData table does not exist. No action taken.');
    }

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
});