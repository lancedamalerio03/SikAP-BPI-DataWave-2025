// client/src/services/connectedAccountsService.js
import { supabase } from '../lib/supabase'

export const connectedAccountsService = {
  // Connect new account
  async connectAccount(userId, accountData) {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .insert({
          user_id: userId,
          account_type: accountData.type,
          account_identifier: accountData.identifier,
          account_name: accountData.name,
          connection_status: 'connected',
          data_access_granted: accountData.dataAccessGranted || false,
          permissions_granted: accountData.permissions || []
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },

  // Get connected accounts
  async getConnectedAccounts(userId) {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },

  // Disconnect account
  async disconnectAccount(accountId) {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .update({
          connection_status: 'disconnected',
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  },

  // Update sync status
  async updateSyncStatus(accountId, status) {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .update({
          sync_status: status,
          last_sync_at: new Date().toISOString()
        })
        .eq('id', accountId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }
}