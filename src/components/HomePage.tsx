import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, MapPin, Clock, Users, Star, Search, Calendar } from 'lucide-react';
import { apiService } from '../services/api';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [popularRoutes, setPopularRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularRoutes();
  }, []);

  const loadPopularRoutes = async () => {
    try {
      setLoading(true);
      const routesData = await apiService.getRoutes();
      // Lấy 6 tuyến đầu tiên làm tuyến phổ biến
      const formattedRoutes = routesData.slice(0, 6).map((route: any) => ({
        id: route._id,
        from: route.from_city,
        to: route.to_city,
        price: "200,000", // Giá mặc định
        duration: `${Math.round(route.estimated_duration_min / 60)}h` // Chuyển phút thành giờ
      }));
      setPopularRoutes(formattedRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
      // Fallback to mock data
      setPopularRoutes([
        { id: "hn-hcm", from: "Hà Nội", to: "Hồ Chí Minh", price: "450,000", duration: "24h" },
        { id: "hn-dn", from: "Hà Nội", to: "Đà Nẵng", price: "320,000", duration: "16h" },
        { id: "hcm-nt", from: "Hồ Chí Minh", to: "Nha Trang", price: "180,000", duration: "8h" },
        { id: "hn-hp", from: "Hà Nội", to: "Hải Phòng", price: "80,000", duration: "2h" },
        { id: "hcm-ct", from: "Hồ Chí Minh", to: "Cần Thơ", price: "120,000", duration: "4h" },
        { id: "dn-hue", from: "Đà Nẵng", to: "Huế", price: "60,000", duration: "2h" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (routeId: string) => {
    navigate(`/booking/${routeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">VeXe7TV</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Trang chủ</a>
              <button 
                onClick={() => navigate('/routes')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Tuyến đường
              </button>
              <button 
                onClick={() => navigate('/my-tickets')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Vé của tôi
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Liên hệ
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Đăng nhập</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Đăng ký</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Đặt vé xe khách 
              <span className="text-blue-600"> dễ dàng</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Tìm kiếm và đặt vé xe khách nhanh chóng với giá cả hợp lý. 
              Hành trình thuận tiện, an toàn và tiết kiệm.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Điểm đi"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Điểm đến"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium">
                  <Search className="h-5 w-5 mr-2" />
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn VeXe7TV?</h3>
            <p className="text-xl text-gray-600">Dịch vụ đặt vé xe khách hàng đầu với nhiều ưu điểm vượt trội</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Đặt vé nhanh chóng</h4>
              <p className="text-gray-600">Chỉ với vài cú click, bạn có thể đặt vé xe một cách dễ dàng và nhanh chóng.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h4>
              <p className="text-gray-600">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Chất lượng cao</h4>
              <p className="text-gray-600">Cam kết mang đến dịch vụ chất lượng cao với giá cả hợp lý nhất.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tuyến đường phổ biến</h3>
            <p className="text-xl text-gray-600">Khám phá các tuyến đường được yêu thích nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
              </div>
            ) : (
              popularRoutes.map((route, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">{route.from}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t border-dashed border-gray-300"></div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">{route.to}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {route.duration}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {route.price}đ
                  </div>
                </div>
                <button 
                  onClick={() => handleBookingClick(route.id)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đặt vé ngay
                </button>
              </div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Bus className="h-8 w-8 text-blue-400" />
                <h4 className="ml-2 text-xl font-bold">VeXe7TV</h4>
              </div>
              <p className="text-gray-400">
                Dịch vụ đặt vé xe khách trực tuyến hàng đầu Việt Nam. 
                Nhanh chóng, tiện lợi và đáng tin cậy.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Dịch vụ</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Đặt vé xe khách</a></li>
                <li><a href="#" className="hover:text-white">Tra cứu tuyến đường</a></li>
                <li><a href="#" className="hover:text-white">Hỗ trợ khách hàng</a></li>
                <li><a href="#" className="hover:text-white">Chính sách hoàn vé</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Hỗ trợ</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-white">Hướng dẫn đặt vé</a></li>
                <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white">Báo cáo sự cố</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Liên hệ</h5>
              <div className="space-y-2 text-gray-400">
                <p>📞 Hotline: 1900 1234</p>
                <p>📧 Email: support@vexe7tv.com</p>
                <p>📍 Địa chỉ: 123 Đường Trịnh Văn Bô, Quận Nam Từ Liêm, TP.HN</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VeXe7TV. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
