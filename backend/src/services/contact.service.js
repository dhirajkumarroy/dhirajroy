const contactRepository = require('../repositories/contact.repository');
const replyRepository = require('../repositories/reply.repository');
const emailService = require('./email.service');
const adminRepository = require('../repositories/admin.repository');
const logger = require('../utils/logger');

class ContactService {
  async createContact(contactData) {
    try {
      const id = await contactRepository.create(contactData);
      
      const createdContact = {
        id,
        full_name: contactData.fullName,
        email: contactData.email,
        phone: contactData.phone,
        subject: contactData.subject,
        message: contactData.message,
        ip_address: contactData.ipAddress,
        user_agent: contactData.userAgent
      };

      // Trigger email sending in background (don't block the HTTP response)
      emailService.sendAdminNotification(createdContact).catch(err => {
        logger.error(`Background email notification error: ${err.message}`);
      });

      return createdContact;
    } catch (error) {
      logger.error(`ContactService.createContact error: ${error.message}`);
      throw error;
    }
  }

  async getMessages(options) {
    try {
      return await contactRepository.findAll(options);
    } catch (error) {
      logger.error(`ContactService.getMessages error: ${error.message}`);
      throw error;
    }
  }

  async getMessageDetails(id) {
    try {
      const message = await contactRepository.findById(id);
      if (!message) {
        const error = new Error('Message not found.');
        error.statusCode = 404;
        throw error;
      }

      // If status is NEW, automatically mark as READ
      if (message.status === 'NEW') {
        await contactRepository.updateStatus(id, 'READ');
        message.status = 'READ';
      }

      // Get reply history
      const replies = await replyRepository.findByContactId(id);

      return {
        message,
        replies
      };
    } catch (error) {
      logger.error(`ContactService.getMessageDetails error: ${error.message}`);
      throw error;
    }
  }

  async updateMessageStatus(id, status, adminId, ipAddress, userAgent) {
    try {
      const message = await contactRepository.findById(id);
      if (!message) {
        const error = new Error('Message not found.');
        error.statusCode = 404;
        throw error;
      }

      const allowedStatuses = ['NEW', 'READ', 'REPLIED', 'ARCHIVED', 'DELETED'];
      if (!allowedStatuses.includes(status)) {
        const error = new Error('Invalid status value.');
        error.statusCode = 400;
        throw error;
      }

      const result = await contactRepository.updateStatus(id, status);
      
      // Log activity
      await adminRepository.logActivity(
        adminId, 
        'UPDATE_STATUS', 
        `Updated message ID ${id} status from ${message.status} to ${status}`, 
        ipAddress, 
        userAgent
      );

      return result;
    } catch (error) {
      logger.error(`ContactService.updateMessageStatus error: ${error.message}`);
      throw error;
    }
  }

  async softDeleteMessage(id, adminId, ipAddress, userAgent) {
    try {
      const message = await contactRepository.findById(id);
      if (!message) {
        const error = new Error('Message not found.');
        error.statusCode = 404;
        throw error;
      }

      const result = await contactRepository.softDelete(id);

      // Log activity
      await adminRepository.logActivity(
        adminId, 
        'SOFT_DELETE', 
        `Soft-deleted message ID ${id} (${message.full_name})`, 
        ipAddress, 
        userAgent
      );

      return result;
    } catch (error) {
      logger.error(`ContactService.softDeleteMessage error: ${error.message}`);
      throw error;
    }
  }

  async replyToMessage(id, replyMessage, adminId, ipAddress, userAgent) {
    try {
      const message = await contactRepository.findById(id);
      if (!message) {
        const error = new Error('Message not found.');
        error.statusCode = 404;
        throw error;
      }

      // 1. Create Reply in DB
      await replyRepository.create({
        contactId: id,
        replyMessage,
        sentBy: adminId
      });

      // 2. Mark contact status as REPLIED
      await contactRepository.updateStatus(id, 'REPLIED');

      // 3. Send email to visitor in the background
      emailService.sendVisitorReply(
        message.email,
        message.full_name,
        message.subject,
        replyMessage,
        message.message
      ).catch(err => {
        logger.error(`Background email reply error: ${err.message}`);
      });

      // 4. Log activity
      await adminRepository.logActivity(
        adminId, 
        'REPLY_MESSAGE', 
        `Replied to message ID ${id} (${message.email})`, 
        ipAddress, 
        userAgent
      );

      return true;
    } catch (error) {
      logger.error(`ContactService.replyToMessage error: ${error.message}`);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      return await contactRepository.getDashboardStats();
    } catch (error) {
      logger.error(`ContactService.getDashboardStats error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ContactService();
