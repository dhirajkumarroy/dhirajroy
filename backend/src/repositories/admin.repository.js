const { getPool } = require('../config/database');
const logger = require('../utils/logger');

class AdminRepository {
  async findByEmail(email) {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`AdminRepository.findByEmail error: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT id, name, email, role, created_at, updated_at FROM admins WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`AdminRepository.findById error: ${error.message}`);
      throw error;
    }
  }

  async logActivity(adminId, action, details, ipAddress, userAgent) {
    try {
      const pool = getPool();
      await pool.query(
        'INSERT INTO activity_logs (admin_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
        [adminId, action, details, ipAddress, userAgent]
      );
      return true;
    } catch (error) {
      // Don't throw for log failures to avoid disrupting main execution, just log it.
      logger.error(`Failed to log activity: ${error.message}`);
      return false;
    }
  }

  async getSettings() {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT `key`, `value` FROM settings');
      return rows;
    } catch (error) {
      logger.error(`AdminRepository.getSettings error: ${error.message}`);
      throw error;
    }
  }

  async getSettingByKey(key) {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT `value` FROM settings WHERE `key` = ?', [key]);
      return rows[0] ? rows[0].value : null;
    } catch (error) {
      logger.error(`AdminRepository.getSettingByKey error: ${error.message}`);
      throw error;
    }
  }

  async updateSetting(key, value) {
    try {
      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = CURRENT_TIMESTAMP',
        [key, value]
      );
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`AdminRepository.updateSetting error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AdminRepository();
