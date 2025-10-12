const { supabase } = require('./supabaseClient');

/**
 * Logs an audit event.
 * @param {string} userId - The ID of the user who performed the action.
 * @param {string} action - The type of action performed.
 * @param {object} details - The details of the action.
 */
const logAuditEvent = async (userId, action, details) => {
  try {
    const { error } = await supabase.from('audit_logs').insert([
      {
        user_id: userId,
        action: action,
        details: details,
      },
    ]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error logging audit event:', error.message);
    // In a production environment, you might want to handle this error more gracefully
    // (e.g., by sending an alert to an error tracking service).
  }
};

module.exports = { logAuditEvent };
