import { supabase } from '../supabase';

/**
 * Subscribes to new notifications for a user.
 * @param {string} userId - The ID of the user.
 * @param {function} callback - The callback function to be called when a new notification is received.
 * @returns {object} The Supabase subscription object.
 */
export const subscribeToNotifications = (userId, callback) => {
  const subscription = supabase
    .channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, payload => {
      callback(payload.new);
    })
    .subscribe();

  return subscription;
};
