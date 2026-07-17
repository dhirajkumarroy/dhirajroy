const contactService = require('../services/contact.service');
const response = require('../utils/response');

class ContactController {
  async submitContact(req, res, next) {
    try {
      const { full_name, email, phone, subject, message } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const contact = await contactService.createContact({
        fullName: full_name,
        email,
        phone,
        subject,
        message,
        ipAddress,
        userAgent
      });

      return response.success(res, 'Thank you! Your message has been submitted.', contact, 201);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        status = '', 
        sortBy = 'created_at', 
        sortOrder = 'DESC' 
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const result = await contactService.getMessages({
        search,
        status,
        limit: parseInt(limit),
        offset,
        sortBy,
        sortOrder
      });

      return response.success(res, 'Messages retrieved successfully.', {
        messages: result.messages,
        pagination: {
          total: result.total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(result.total / parseInt(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessageDetails(req, res, next) {
    try {
      const { id } = req.params;
      const result = await contactService.getMessageDetails(id);
      
      return response.success(res, 'Message details retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async updateMessageStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const adminId = req.admin.id;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      await contactService.updateMessageStatus(id, status, adminId, ipAddress, userAgent);

      return response.success(res, `Message status updated to ${status}.`);
    } catch (error) {
      next(error);
    }
  }

  async softDeleteMessage(req, res, next) {
    try {
      const { id } = req.params;
      const adminId = req.admin.id;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      await contactService.softDeleteMessage(id, adminId, ipAddress, userAgent);

      return response.success(res, 'Message deleted successfully.');
    } catch (error) {
      next(error);
    }
  }

  async replyToMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { reply_message } = req.body;
      const adminId = req.admin.id;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      if (!reply_message || !reply_message.trim()) {
        return response.error(res, 'Reply message content is required.', 400);
      }

      await contactService.replyToMessage(id, reply_message, adminId, ipAddress, userAgent);

      return response.success(res, 'Reply sent successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactController();
