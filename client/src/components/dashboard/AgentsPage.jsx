// client/src/components/dashboard/AgentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  User,
  Map,
  Filter,
  Star,
  ExternalLink,
  MessageCircle,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { locationService } from '../../services/locationServices';


const AgentsPage = () => {
  console.log('🚀 AgentsPage component loaded');  // ← ADD THIS LINE HERE
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Load locations on component mount
  useEffect(() => {
    console.log('🔄 useEffect triggered, calling loadLocations');
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await locationService.getAllLocations();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setLocations(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load locations:', err);
        if (isMounted) {
          setError('Failed to load locations: ' + err.message);
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);
  // And this loadLocations function:
  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await locationService.getAllLocations(); // This should trigger the console.log
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations:', err);
      setError('Failed to load branch and agent locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      setGettingLocation(true);
      const position = await locationService.getCurrentLocation();
      setUserLocation(position);
      
      // Get nearby locations with distance
      const nearbyLocations = await locationService.getNearbyLocations(
        position.lat, 
        position.lng, 
        50 // 50km radius
      );
      setLocations(nearbyLocations);
    } catch (err) {
      console.error('Failed to get location:', err);
      alert('Unable to get your location. Showing all locations instead.');
    } finally {
      setGettingLocation(false);
    }
  };

  // Filter locations based on selected filter and search query
  const filteredLocations = locations.filter(location => {
    const matchesFilter = selectedFilter === 'all' || location.type === selectedFilter;
    const matchesSearch = !searchQuery || 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await locationService.searchLocations(query);
        setLocations(searchResults);
      } catch (err) {
        console.error('Search failed:', err);
      }
    } else {
      loadLocations();
    }
  };

  const getDirections = (location) => {
    if (location.coordinates?.lat && location.coordinates?.lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const encodedAddress = encodeURIComponent(location.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(url, '_blank');
    }
  };

  const callLocation = (phone) => {
    if (phone && phone !== 'Agent counter') {
      window.location.href = `tel:${phone}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDistance = (distance) => {
    if (distance === undefined) return '';
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance}km`;
  };

  const formatUpdatedTime = (minutesAgo) => {
    if (!minutesAgo || minutesAgo === 0) return 'Just updated';
    if (minutesAgo < 60) return `Updated ${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `Updated ${hoursAgo}h ago`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Loading branch and agent locations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={loadLocations} className="bg-gradient-to-r from-red-600 to-amber-500">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branch & Agent Locator</h1>
          <p className="text-slate-600">Find nearby BanKo branches and partner agents</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={getUserLocation}
            disabled={gettingLocation}
            className="flex items-center gap-2"
          >
            {gettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {gettingLocation ? 'Getting Location...' : 'Use My Location'}
          </Button>
          <Button 
            variant="outline"
            onClick={loadLocations}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? 
              'bg-gradient-to-r from-red-600 to-amber-500' : ''}
          >
            All Locations
          </Button>
          <Button
            variant={selectedFilter === 'branch' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('branch')}
            className={selectedFilter === 'branch' ? 'bg-gradient-to-r from-red-600 to-amber-500' : ''}
          >
            Full Branches
          </Button>
          <Button
            variant={selectedFilter === 'agent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('agent')}
            className={selectedFilter === 'agent' ?
              'bg-gradient-to-r from-red-600 to-amber-500' : ''}
          >
            Partner Agents
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
          {userLocation && ' (sorted by distance)'}
        </span>
        {userLocation && (
          <span className="text-blue-600">
            📍 Using your current location
          </span>
        )}
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                      {location.name}
                    </h3>
                    {location.distance !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        {formatDistance(location.distance)} away
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {location.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{location.rating}</span>
                      </div>
                    )}
                    <Badge 
                      className={`text-xs ${getStatusColor(location.status)}`}
                    >
                      {location.status}
                    </Badge>
                    {location.updatedMinutesAgo !== undefined && (
                      <span className="text-xs text-slate-500">
                        {formatUpdatedTime(location.updatedMinutesAgo)}
                      </span>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={location.type === 'branch' ? 'default' : 'outline'}
                  className={location.type === 'branch' ? 
                    'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'}
                >
                  {location.type === 'branch' ? 'Full Branch' : 'Partner Agent'}
                </Badge>
              </div>

              {/* Address */}
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{location.address}</p>

              {/* Services */}
              {location.services && location.services.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-slate-700 mb-2">AVAILABLE SERVICES</div>
                  <div className="flex flex-wrap gap-1">
                    {location.services.map((service, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hours and Contact */}
              <div className="space-y-2 mb-4 text-sm">
                {location.hours.weekday && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{location.hours.weekday}</span>
                  </div>
                )}
                {location.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{location.phone}</span>
                  </div>
                )}
                {location.busyHours && (
                  <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    💡 {location.busyHours}
                  </div>
                )}
                {location.parking && (
                  <div className="text-xs text-blue-600">
                    🅿️ {location.parking}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => getDirections(location)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>
                {location.phone && location.phone !== 'Agent counter' && (
                  <Button 
                    variant="outline"
                    onClick={() => callLocation(location.phone)}
                    className="px-3"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLocations.length === 0 && (
        <Card>
          <div className="p-8 text-center">
            <Map className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No locations found</h3>
            <p className="text-slate-600 mb-4">
              {searchQuery 
                ? `No branches or agents match "${searchQuery}". Try a different search term.`
                : 'No locations match your current filter. Try selecting "All Locations".'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
                loadLocations();
              }}>
                Clear Filters
              </Button>
              <Button 
                className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
                onClick={() => window.location.href = '/dashboard/chatbot'}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with AI
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Tips */}
      <Card>
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">💡 Quick Tips</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">For Loan Applications:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• Visit full branches for complex loan products</li>
                <li>• Bring 2 valid IDs and proof of income</li>
                <li>• Best times: 9-11 AM or 3-4 PM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">For Quick Services:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• Partner agents can handle account opening</li>
                <li>• No appointment needed for basic services</li>
                <li>• Check busy hours to avoid long waits</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AgentsPage;