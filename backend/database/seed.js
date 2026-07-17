const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('==================================================');
  console.log('      Dhiraj Portfolio Admin Seeding Script       ');
  console.log('==================================================\n');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
  };

  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${dbConfig.database}\``);

    console.log(`Connected to MySQL database: ${dbConfig.database}\n`);
  } catch (error) {
    console.error('Error connecting to MySQL database:', error.message);
    console.log('\nPlease check your .env configuration and make sure MySQL is running.');
    process.exit(1);
  }

  try {
    // Collect Admin details
    const name = await askQuestion('Enter Admin Name: ');
    if (!name.trim()) {
      console.error('Admin Name is required.');
      process.exit(1);
    }

    const email = await askQuestion('Enter Admin Email: ');
    if (!email.trim() || !email.includes('@')) {
      console.error('Valid email is required.');
      process.exit(1);
    }

    const password = await askQuestion('Enter Admin Password: ');
    if (!password || password.length < 6) {
      console.error('Password must be at least 6 characters long.');
      process.exit(1);
    }

    console.log('\nCreating Admin user...');

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert Admin
    const [existing] = await connection.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.error(`An admin with email ${email} already exists! Seed failed.`);
      process.exit(1);
    }

    await connection.query(
      'INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'superadmin']
    );
    console.log(`✔ Admin user '${name}' successfully created!`);

    // Seed default settings
    console.log('\nSeeding default settings...');
    const defaultSettings = [
      { key: 'site_name', value: 'Dhiraj Roy Portfolio' },
      { key: 'admin_notification_email', value: email },
      { key: 'maintenance_mode', value: 'false' }
    ];

    for (const setting of defaultSettings) {
      await connection.query(
        'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
        [setting.key, setting.value]
      );
    }
    console.log('✔ Default settings successfully seeded!');
    console.log('\n==================================================');
    console.log('                Seeding Completed!                ');
    console.log('==================================================');

  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    if (connection) await connection.end();
    rl.close();
  }
}

main();
