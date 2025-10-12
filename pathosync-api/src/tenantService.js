const { supabase } = require('./supabaseClient'); // Assuming you have a Supabase client

/**
 * Retrieves the UPI ID for a given tenant.
 * @param {string} tenantId - The ID of the tenant.
 * @returns {Promise<string|null>} The tenant's UPI ID, or null if not found.
 */
const getTenantUpiId = async (tenantId) => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('upi_id')
      .eq('id', tenantId)
      .single();

    if (error) {
      throw error;
    }

    return data ? data.upi_id : null;
  } catch (error) {
    console.error('Error fetching tenant UPI ID:', error.message);
    throw new Error('Failed to fetch tenant UPI ID.');
  }
};

module.exports = { getTenantUpiId };
