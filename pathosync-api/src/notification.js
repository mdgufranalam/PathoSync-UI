const { supabase } = require('./supabaseClient');

/**
 * Creates a new notification.
 * @param {string} userId - The ID of the user who should receive the notification.
 * @param {string} type - The type of notification.
 * @param {object} data - The notification data.
 */
const createNotification = async (userId, type, data) => {
  try {
    const { error } = await supabase.from('notifications').insert([
      {
        user_id: userId,
        type: type,
        data: data,
      },
    ]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

/**
 * Subscribes to new notifications for a user.
 * @param {string} userId - The ID of the user.
 * @param {function} callback - The callback function to be called when a new notification is received.
 * @returns {object} The Supabase subscription object.
 */
const subscribeToNotifications = (userId, callback) => {
  const subscription = supabase
    .channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, payload => {
      callback(payload.new);
    })
    .subscribe();

  return subscription;
};

module.exports = { createNotification, subscribeToNotifications };
