// client/src/components/dashboard/AgentsPage.jsx
import React, { useState } from 'react';
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
  MessageCircle
} from 'lucide-react';

const AgentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);

  // BanKo branches and agents data
  const locations = [
    {
      id: 1,
      name: 'BPI BanKo Pasig Branch',
      type: 'branch',
      address: 'Ground Floor, Robinsons Metro East, Marcos Highway, Pasig City, Metro Manila',
      distance: 2.1,
      status: 'Open',
      rating: 4.8,
      hours: {
        weekday: 'Mon-Fri: 8:30 AM - 5:00 PM',
        saturday: 'Sat: 8:30 AM - 3:00 PM',
        sunday: 'Closed'
      },
      phone: '(02) 8631-8000',
      services: ['Full Banking', 'Loan Processing', 'Account Opening', 'ATM'],
      coordinates: { lat: 14.5764, lng: 121.0851 },
      busyHours: 'Typically busy 12-2 PM',
      parking: 'Available'
    },
    {
      id: 2,
      name: 'BPI BanKo Ortigas Branch',
      type: 'branch',
      address: 'Ground Floor, Robinsons Galleria, EDSA corner Ortigas Avenue, Quezon City',
      distance: 3.5,
      status: 'Open',
      rating: 4.6,
      hours: {
        weekday: 'Mon-Fri: 8:30 AM - 5:00 PM',
        saturday: 'Sat: 8:30 AM - 3:00 PM',
        sunday: 'Closed'
      },
      phone: '(02) 8634-8888',
      services: ['Full Banking', 'Loan Processing', 'Account Opening', 'ATM'],
      coordinates: { lat: 14.6091, lng: 121.0570 },
      busyHours: 'Typically busy 11 AM-1 PM',
      parking: 'Mall parking available'
    },
    {
      id: 3,
      name: 'Partner Agent - SM Megamall',
      type: 'agent',
      address: '2nd Level, SM Megamall, EDSA corner Julia Vargas Avenue, Mandaluyong City',
      distance: 4.2,
      status: 'Open',
      rating: 4.3,
      hours: {
        weekday: 'Mon-Fri: 10:00 AM - 9:00 PM',
        saturday: 'Sat: 10:00 AM - 9:00 PM',
        sunday: 'Sun: 10:00 AM - 8:00 PM'
      },
      phone: 'Agent counter',
      services: ['Account Opening', 'Loan Applications', 'Bill Payments'],
      coordinates: { lat: 14.5853, lng: 121.0565 },
      busyHours: 'Weekends typically busy',
      parking: 'Mall parking available'
    },
    {
      id: 4,
      name: 'BPI BanKo Marikina Branch',
      type: 'branch',
      address: '88 J.P. Rizal Street, Marikina City, Metro Manila',
      distance: 5.8,
      status: 'Open',
      rating: 4.7,
      hours: {
        weekday: 'Mon-Fri: 8:30 AM - 5:00 PM',
        saturday: 'Sat: 8:30 AM - 3:00 PM',
        sunday: 'Closed'
      },
      phone: '(02) 8942-7000',
      services: ['Full Banking', 'Loan Processing', 'Account Opening', 'ATM', 'Safe Deposit'],
      coordinates: { lat: 14.6507, lng: 121.1029 },
      busyHours: 'Typically busy 12-2 PM',
      parking: 'Street parking'
    },
    {
      id: 5,
      name: 'Partner Agent - Ayala Malls FTI',
      type: 'agent',
      address: 'Ground Floor, Ayala Malls FTI, Western Bicutan, Taguig City',
      distance: 7.3,
      status: 'Open',
      rating: 4.1,
      hours: {
        weekday: 'Mon-Fri: 10:00 AM - 9:00 PM',
        saturday: 'Sat: 10:00 AM - 9:00 PM',
        sunday: 'Sun: 10:00 AM - 8:00 PM'
      },
      phone: 'Agent counter',
      services: ['Account Opening', 'Loan Applications', 'Remittances'],
      coordinates: { lat: 14.5176, lng: 121.0509 },
      busyHours: 'Lunch hours typically busy',
      parking: 'Mall parking available'
    }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || location.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          alert('Location detected! Showing nearby branches...');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please search manually or check location permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const getDirections = (location) => {
    const query = encodeURIComponent(location.address);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const callLocation = (phone) => {
    if (phone !== 'Agent counter') {
      window.open(`tel:${phone}`, '_self');
    } else {
      alert('Please visit the agent counter for assistance.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'Busy': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">BanKo Branch & Agent Locator</h1>
        <p className="text-slate-600">Find nearby branches and partner agents for in-person assistance</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, address, or branch name..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <Button 
              onClick={useCurrentLocation}
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className={selectedFilter === 'all' ? 'bg-gradient-to-r from-red-600 to-amber-500' : ''}
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
              className={selectedFilter === 'agent' ? 'bg-gradient-to-r from-red-600 to-amber-500' : ''}
            >
              Partner Agents
            </Button>
          </div>
        </div>
      </Card>

      {/* Map Placeholder */}
      <Card className="h-80 flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500">
          <Map className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Interactive Map</h3>
          <p className="mb-2">Google Maps integration would be displayed here</p>
          <p className="text-sm">Showing {filteredLocations.length} locations near you</p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.open('https://www.google.com/maps/search/BPI+BanKo+branches', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View in Google Maps
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">
          {filteredLocations.length} locations found
        </h2>
        <div className="text-sm text-slate-600">
          Sorted by distance
        </div>
      </div>

      {/* Location List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              {/* Location Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{location.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className={getStatusColor(location.status)}>
                      {location.status}
                    </Badge>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-600">{location.distance} km away</span>
                    {location.rating && (
                      <>
                        <span className="text-slate-600">•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-slate-600">{location.rating}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={location.type === 'branch' ? 'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'}
                >
                  {location.type === 'branch' ? 'Full Branch' : 'Partner Agent'}
                </Badge>
              </div>

              {/* Address */}
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{location.address}</p>

              {/* Services */}
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

              {/* Hours and Contact */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{location.hours.weekday}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{location.phone}</span>
                </div>
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
                <Button 
                  variant="outline"
                  onClick={() => callLocation(location.phone)}
                  className="px-3"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => alert(`More info about ${location.name}`)}
                  className="px-3"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Additional Info Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Updated: 2 hours ago</span>
                <span>ID: {location.type.toUpperCase()}-{location.id.toString().padStart(3, '0')}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredLocations.length === 0 && (
        <Card className="p-8 text-center">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No locations found</h3>
          <p className="text-slate-600 mb-4">
            Try adjusting your search terms or filters, or use your current location to find nearby branches.
          </p>
          <Button onClick={() => setSearchQuery('')} variant="outline">
            Clear Search
          </Button>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Need Personal Assistance?</h3>
              <p className="text-sm text-slate-600">
                Our customer service team can help you find the best location for your needs or assist with any banking questions.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Support
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
        </div>
      </Card>

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