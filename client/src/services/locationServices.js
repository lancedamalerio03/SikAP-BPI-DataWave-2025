// client/src/components/services/locationService.js
import { supabase } from '../lib/supabase'


export const locationService = {
  // Get all locations with their hours, services, and contacts
  async getAllLocations() {
    try {
      console.log('🔍 Fetching locations...');
      
      // Add timeout to the query
      const { data: locations, error } = await Promise.race([
        supabase.from('locations').select('*').limit(10),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 10000)
        )
      ]);
  
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
  
      console.log('✅ Raw data received:', locations);
      console.log('📊 Number of locations:', locations?.length || 0);
      
      // Simple transformation for now
      return (locations || []).map(location => ({
        id: location.id,
        code: location.code,
        name: location.name,
        type: location.type,
        status: location.status,
        rating: location.rating,
        address: location.address,
        coordinates: {
          lat: location.latitude,
          lng: location.longitude
        },
        phone: location.phone,
        busyHours: location.busy_notes,
        parking: location.parking_notes,
        updatedMinutesAgo: location.updated_minutes_ago,
        
        // Default values for now
        hours: { weekday: 'Mon-Fri: 8:30 AM - 5:00 PM' },
        services: ['Banking Services'],
        contacts: {}
      }));
      
    } catch (error) {
      console.error('❌ Service error:', error);
      throw error;
    }
  },

  // Get locations by type
  async getLocationsByType(type) {
    try {
      const allLocations = await this.getAllLocations()
      return allLocations.filter(location => location.type === type)
    } catch (error) {
      console.error('Error fetching locations by type:', error)
      throw error
    }
  },

  // Get locations within a certain distance
  async getNearbyLocations(userLat, userLng, radiusKm = 50) {
    try {
      const allLocations = await this.getAllLocations()
      
      return allLocations
        .map(location => ({
          ...location,
          distance: this.calculateDistance(
            userLat, 
            userLng, 
            location.coordinates.lat, 
            location.coordinates.lng
          )
        }))
        .filter(location => location.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
    } catch (error) {
      console.error('Error fetching nearby locations:', error)
      throw error
    }
  },

  // Search locations by name or address
  async searchLocations(query) {
    try {
      const { data: locations, error } = await supabase
        .from('locations')
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
        .limit(20);

      if (error) throw error

      return (locations || []).map(location => ({
        id: location.id,
        code: location.code,
        name: location.name,
        type: location.type,
        status: location.status,
        rating: location.rating,
        address: location.address,
        coordinates: {
          lat: location.latitude,
          lng: location.longitude
        },
        phone: location.phone,
        busyHours: location.busy_notes,
        parking: location.parking_notes,
        updatedMinutesAgo: location.updated_minutes_ago,
        hours: { weekday: 'Mon-Fri: 8:30 AM - 5:00 PM' },
        services: ['Banking Services'],
        contacts: {}
      }));
    } catch (error) {
      console.error('Error searching locations:', error)
      throw error
    }
  },

  // Update location status
  async updateLocationStatus(locationId, status) {
    try {
      const { data, error } = await supabase
        .from('locations')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', locationId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating location status:', error)
      throw error
    }
  },

  // Calculate distance between two coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return Math.round(distance * 10) / 10
  },

  deg2rad(deg) {
    return deg * (Math.PI/180)
  },

  // Get current user location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }
}