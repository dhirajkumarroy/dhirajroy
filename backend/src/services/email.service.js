const { getTransporter } = require('../config/mail');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'dheerajkumar.ara1111@gmail.com';
    this.fromEmail = process.env.SMTP_USER || 'no-reply@dhirajroy.com';
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const transporter = getTransporter();
      
      // If SMTP_USER is empty, skip sending and just log to console (useful for dev/test)
      if (!process.env.SMTP_USER) {
        logger.warn('--------------------------------------------------');
        logger.warn(`SMTP unconfigured. Skipping send email.`);
        logger.warn(`TO: ${to}`);
        logger.warn(`SUBJECT: ${subject}`);
        logger.warn(`BODY: ${text || 'HTML Content'}`);
        logger.warn('--------------------------------------------------');
        return true;
      }

      const info = await transporter.sendMail({
        from: `"${process.env.SMTP_SENDER_NAME || 'Dhiraj Roy Portfolio'}" <${this.fromEmail}>`,
        to,
        subject,
        text,
        html
      });

      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email: ${error.message}`);
      // Do not crash the application if email sending fails
      return false;
    }
  }

  async sendAdminNotification(contact) {
    const subject = `📬 New Portfolio Message: ${contact.subject}`;
    const text = `
      New Message from ${contact.full_name} (${contact.email})
      Subject: ${contact.subject}
      Message: ${contact.message}
      Phone: ${contact.phone || 'N/A'}
      IP Address: ${contact.ip_address}
    `;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #dd6b20; border-bottom: 2px solid #ed8936; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 30%; color: #4a5568;">Name:</td>
            <td style="padding: 8px 0; color: #2d3748;">${contact.full_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Email:</td>
            <td style="padding: 8px 0; color: #2d3748;"><a href="mailto:${contact.email}" style="color: #dd6b20; text-decoration: none;">${contact.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Phone:</td>
            <td style="padding: 8px 0; color: #2d3748;">${contact.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Subject:</td>
            <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">${contact.subject}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #ed8936; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #4a5568; margin-bottom: 8px;">Message:</p>
          <p style="margin: 0; color: #2d3748; line-height: 1.6; white-space: pre-wrap;">${contact.message}</p>
        </div>
        
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #a0aec0; text-align: center;">
          <p style="margin: 0 0 5px 0;">Submitted on: ${new Date().toLocaleString()}</p>
          <p style="margin: 0;">IP: ${contact.ip_address} | OS: ${contact.user_agent}</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: this.adminEmail,
      subject,
      html,
      text
    });
  }

  async sendVisitorReply(visitorEmail, visitorName, originalSubject, replyMessage, originalMessage) {
    const subject = `Re: ${originalSubject}`;
    const text = `
      Hello ${visitorName},

      Dhiraj Roy has replied to your message:
      "${replyMessage}"

      --- Original Message ---
      Subject: ${originalSubject}
      "${originalMessage}"
    `;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <p style="font-size: 1.1rem; color: #2d3748; margin-top: 0;">Hello <strong>${visitorName}</strong>,</p>
        
        <p style="color: #4a5568; line-height: 1.6;">Thank you for getting in touch. I have reviewed your inquiry, and here is my response:</p>
        
        <div style="margin-top: 20px; margin-bottom: 25px; padding: 20px; background-color: #fffaf0; border: 1px solid #fbd38d; border-radius: 6px; color: #2d3748; line-height: 1.6; white-space: pre-wrap;">${replyMessage}</div>
        
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 0;">Best regards,<br><strong style="color: #dd6b20;">Dhiraj Roy</strong><br><span style="font-size: 0.85rem; color: #718096;">Backend Engineer & Full-Stack Developer</span></p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <details style="cursor: pointer;">
            <summary style="font-weight: 500; font-size: 0.9rem; color: #718096; outline: none; margin-bottom: 10px;">View Original Conversation</summary>
            <div style="padding: 15px; background-color: #f7fafc; border-left: 3px solid #cbd5e0; border-radius: 4px; font-size: 0.9rem; color: #4a5568;">
              <p style="margin: 0 0 8px 0; font-weight: bold;">Subject: ${originalSubject}</p>
              <p style="margin: 0; line-height: 1.5; white-space: pre-wrap;">${originalMessage}</p>
            </div>
          </details>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: visitorEmail,
      subject,
      html,
      text
    });
  }
}

module.exports = new EmailService();
