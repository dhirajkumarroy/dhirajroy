const contactService = require('../services/contact.service');
const response = require('../utils/response');

class DashboardController {
  async getDashboardData(req, res, next) {
    try {
      // 1. Get statistics counters
      const stats = await contactService.getDashboardStats();

      // 2. Get recent active messages (top 5)
      const recentResult = await contactService.getMessages({
        limit: 5,
        offset: 0,
        status: '',
        search: '',
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      return response.success(res, 'Dashboard statistics retrieved successfully.', {
        stats,
        recentMessages: recentResult.messages
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
