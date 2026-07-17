const { getPool } = require('../config/database');
const logger = require('../utils/logger');

class ContactRepository {
  async create(contactData) {
    try {
      const { fullName, email, phone, subject, message, ipAddress, userAgent } = contactData;
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO contacts (full_name, email, phone, subject, message, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fullName, email, phone, subject, message, ipAddress, userAgent]
      );
      return result.insertId;
    } catch (error) {
      logger.error(`ContactRepository.create error: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT * FROM contacts WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      logger.error(`ContactRepository.findById error: ${error.message}`);
      throw error;
    }
  }

  async findAll(options = {}) {
    try {
      const pool = getPool();
      const {
        search = '',
        status = '',
        limit = 10,
        offset = 0,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = options;

      let query = 'SELECT * FROM contacts WHERE 1=1';
      const queryParams = [];

      // Filter by status
      if (status === 'DELETED') {
        query += ' AND (status = "DELETED" OR deleted_at IS NOT NULL)';
      } else {
        query += ' AND deleted_at IS NULL';
        if (status) {
          query += ' AND status = ?';
          queryParams.push(status);
        }
      }

      // Search term
      if (search) {
        query += ' AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      // Sorting (whitelisting keys to prevent SQL injection)
      const allowedSortFields = ['created_at', 'full_name', 'email', 'status', 'subject'];
      const field = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
      const direction = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${field} ${direction}`;

      // Pagination
      query += ' LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));

      const [rows] = await pool.query(query, queryParams);

      // Get total count matching criteria (without limit/offset) for pagination headers
      let countQuery = 'SELECT COUNT(*) as total FROM contacts WHERE 1=1';
      const countParams = [];

      if (status === 'DELETED') {
        countQuery += ' AND (status = "DELETED" OR deleted_at IS NOT NULL)';
      } else {
        countQuery += ' AND deleted_at IS NULL';
        if (status) {
          countQuery += ' AND status = ?';
          countParams.push(status);
        }
      }

      if (search) {
        countQuery += ' AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
        const searchPattern = `%${search}%`;
        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const [countRows] = await pool.query(countQuery, countParams);
      const totalCount = countRows[0].total;

      return {
        messages: rows,
        total: totalCount
      };
    } catch (error) {
      logger.error(`ContactRepository.findAll error: ${error.message}`);
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      const pool = getPool();
      const [result] = await pool.query(
        'UPDATE contacts SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`ContactRepository.updateStatus error: ${error.message}`);
      throw error;
    }
  }

  async softDelete(id) {
    try {
      const pool = getPool();
      const [result] = await pool.query(
        'UPDATE contacts SET status = "DELETED", deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`ContactRepository.softDelete error: ${error.message}`);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const pool = getPool();

      // Retrieve counts by status
      const [statusCounts] = await pool.query(`
        SELECT 
          SUM(CASE WHEN status = 'NEW' AND deleted_at IS NULL THEN 1 ELSE 0 END) as unread,
          SUM(CASE WHEN status = 'READ' AND deleted_at IS NULL THEN 1 ELSE 0 END) as \`read\`,
          SUM(CASE WHEN status = 'REPLIED' AND deleted_at IS NULL THEN 1 ELSE 0 END) as replied,
          SUM(CASE WHEN status = 'ARCHIVED' AND deleted_at IS NULL THEN 1 ELSE 0 END) as archived,
          SUM(CASE WHEN status = 'DELETED' OR deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted,
          COUNT(CASE WHEN deleted_at IS NULL THEN 1 END) as total_active
        FROM contacts
      `);

      const stats = {
        unread: parseInt(statusCounts[0].unread || 0),
        read: parseInt(statusCounts[0].read || 0),
        replied: parseInt(statusCounts[0].replied || 0),
        archived: parseInt(statusCounts[0].archived || 0),
        deleted: parseInt(statusCounts[0].deleted || 0),
        total: parseInt(statusCounts[0].total_active || 0)
      };

      // Retrieve periodic counts
      const [timeCounts] = await pool.query(`
        SELECT
          COUNT(CASE WHEN created_at >= CURDATE() AND deleted_at IS NULL THEN 1 END) as today,
          COUNT(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND deleted_at IS NULL THEN 1 END) as weekly,
          COUNT(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND deleted_at IS NULL THEN 1 END) as monthly
        FROM contacts
      `);

      stats.today = parseInt(timeCounts[0].today || 0);
      stats.weekly = parseInt(timeCounts[0].weekly || 0);
      stats.monthly = parseInt(timeCounts[0].monthly || 0);

      return stats;
    } catch (error) {
      logger.error(`ContactRepository.getDashboardStats error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ContactRepository();
