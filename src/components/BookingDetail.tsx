import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bus, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { apiService } from '../services/api';

interface RouteInfo {
  from: string;
  to: string;
  price: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  busType: string;
  availableSeats: number;
}

const BookingDetail: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRouteData();
    if (routeId) {
      localStorage.setItem('current_route_id', routeId);
    }
  }, [routeId]);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      if (routeId) {
        const routes = await apiService.getRoutes();
        const route = routes.find((r: any) => r._id === routeId);
        if (route) {
          setRouteData({
            from: route.from_city,
            to: route.to_city,
            price: "200,000", // Giá mặc định
            duration: `${Math.round(route.estimated_duration_min / 60)}h`,
            departureTime: "08:00", // Có thể lấy từ trips
            arrivalTime: "12:00",
            busType: "Xe khách",
            availableSeats: 20
          });
        }
      }
    } catch (error) {
      console.error('Error loading route:', error);
      // Fallback to mock data
      const mockRoutes: { [key: string]: RouteInfo } = {
    "hn-hcm": {
      from: "Hà Nội",
      to: "Hồ Chí Minh", 
      price: "450,000",
      duration: "24h",
      departureTime: "08:00",
      arrivalTime: "08:00+1",
      busType: "Xe giường nằm VIP",
      availableSeats: 12
    },
    "hn-dn": {
      from: "Hà Nội",
      to: "Đà Nẵng", 
      price: "320,000",
      duration: "16h",
      departureTime: "20:00",
      arrivalTime: "12:00+1",
      busType: "Xe giường nằm",
      availableSeats: 8
    },
    "hcm-nt": {
      from: "Hồ Chí Minh",
      to: "Nha Trang", 
      price: "180,000",
      duration: "8h",
      departureTime: "22:00",
      arrivalTime: "06:00+1",
      busType: "Xe giường nằm",
      availableSeats: 15
    },
    "hn-hp": {
      from: "Hà Nội",
      to: "Hải Phòng", 
      price: "80,000",
      duration: "2h",
      departureTime: "06:00",
      arrivalTime: "08:00",
      busType: "Xe ngồi",
      availableSeats: 25
    },
    "hcm-ct": {
      from: "Hồ Chí Minh",
      to: "Cần Thơ", 
      price: "120,000",
      duration: "4h",
      departureTime: "14:00",
      arrivalTime: "18:00",
      busType: "Xe ngồi",
      availableSeats: 20
    },
    "dn-hue": {
      from: "Đà Nẵng",
      to: "Huế", 
      price: "60,000",
      duration: "2h",
      departureTime: "07:00",
      arrivalTime: "09:00",
      busType: "Xe ngồi",
      availableSeats: 30
    },
    "hcm-dalat": {
      from: "Hồ Chí Minh",
      to: "Đà Lạt", 
      price: "200,000",
      duration: "6h",
      departureTime: "23:00",
      arrivalTime: "05:00+1",
      busType: "Xe giường nằm VIP",
      availableSeats: 10
    },
    "hn-qn": {
      from: "Hà Nội",
      to: "Quảng Ninh", 
      price: "150,000",
      duration: "3h",
      departureTime: "09:00",
      arrivalTime: "12:00",
      busType: "Xe ngồi",
      availableSeats: 18
    }
  };
      setRouteData(mockRoutes[routeId || 'hn-hcm'] || mockRoutes['hn-hcm']);
    } finally {
      setLoading(false);
    }
  };

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerInfo, setPassengerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    note: ''
  });

  const handleSeatSelect = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế');
      return;
    }
    if (!passengerInfo.name || !passengerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin hành khách');
      return;
    }
    
    // Chuyển đến trang thanh toán
    navigate('/payment', { 
      state: { 
        route: routeData, 
        seats: selectedSeats, 
        passenger: passengerInfo 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg">Không tìm thấy tuyến đường</div>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </button>
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">VeXe7TV</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin tuyến đường */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết tuyến đường</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{routeData.from}</p>
                    <p className="text-sm text-gray-600">Điểm đi</p>
                  </div>
                </div>
                
                <div className="flex-1 mx-6">
                  <div className="border-t-2 border-dashed border-gray-300"></div>
                  <div className="text-center mt-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    <span className="text-sm text-gray-600">{routeData.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{routeData.to}</p>
                    <p className="text-sm text-gray-600">Điểm đến</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Giờ khởi hành</p>
                  <p className="text-gray-600">{routeData.departureTime}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Giờ đến</p>
                  <p className="text-gray-600">{routeData.arrivalTime}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bus className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Loại xe</p>
                  <p className="text-gray-600">{routeData.busType}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Ghế trống</p>
                  <p className="text-gray-600">{routeData.availableSeats} ghế</p>
                </div>
              </div>
            </div>

            {/* Chọn ghế */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn ghế</h3>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 32 }, (_, i) => i + 1).map(seatNumber => (
                  <button
                    key={seatNumber}
                    onClick={() => handleSeatSelect(seatNumber)}
                    className={`p-3 rounded-lg border-2 text-center font-medium transition-colors ${
                      selectedSeats.includes(seatNumber)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {seatNumber}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Ghế trống</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Ghế đã chọn</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Ghế đã bán</span>
                </div>
              </div>
            </div>

            {/* Thông tin hành khách */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin hành khách</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={passengerInfo.name}
                    onChange={(e) => setPassengerInfo({...passengerInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={passengerInfo.phone}
                    onChange={(e) => setPassengerInfo({...passengerInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={passengerInfo.email}
                    onChange={(e) => setPassengerInfo({...passengerInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    value={passengerInfo.note}
                    onChange={(e) => setPassengerInfo({...passengerInfo, note: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ghi chú thêm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tóm tắt đặt vé */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đặt vé</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuyến đường:</span>
                  <span className="font-medium">{routeData.from} - {routeData.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số ghế:</span>
                  <span className="font-medium">{selectedSeats.length} ghế</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ghế đã chọn:</span>
                  <span className="font-medium">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá vé/ghế:</span>
                  <span className="font-medium">{routeData.price}₫</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {(parseInt(routeData.price.replace(',', '')) * selectedSeats.length).toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
