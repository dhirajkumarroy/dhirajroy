const { getPool } = require('../config/database');
const logger = require('../utils/logger');

class ReplyRepository {
  async create(replyData) {
    try {
      const { contactId, replyMessage, sentBy } = replyData;
      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO replies (contact_id, reply_message, sent_by) VALUES (?, ?, ?)',
        [contactId, replyMessage, sentBy]
      );
      return result.insertId;
    } catch (error) {
      logger.error(`ReplyRepository.create error: ${error.message}`);
      throw error;
    }
  }

  async findByContactId(contactId) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT r.*, a.name as admin_name 
         FROM replies r 
         JOIN admins a ON r.sent_by = a.id 
         WHERE r.contact_id = ? 
         ORDER BY r.sent_at ASC`,
        [contactId]
      );
      return rows;
    } catch (error) {
      logger.error(`ReplyRepository.findByContactId error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ReplyRepository();
