import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Bus, MapPin, Clock, Download, Home, Calendar, CreditCard } from 'lucide-react';
import { apiService } from '../services/api';

// Helper to get trips
const getTrips = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/trips');
    return await response.json();
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
};

interface SuccessData {
  route: {
    from: string;
    to: string;
    price: string;
    duration: string;
    departureTime: string;
    arrivalTime: string;
    busType: string;
  };
  seats: number[];
  passenger: {
    name: string;
    phone: string;
    email: string;
    note: string;
  };
  totalAmount: number;
  paymentMethod: string;
  bookingId: string;
}

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const successData = location.state as SuccessData;
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    const saveBookingToDatabase = async () => {
      if (successData) {
        try {
          // Gọi API để lưu booking và payment vào database
          // Lấy route_id từ URL hoặc state
          const routeId = localStorage.getItem('current_route_id') || '6735b3f40ac061422206dbf2'; // Fallback ID
          
          console.log('Getting trips for route:', routeId);
          const trips = await apiService.getTrips();
          console.log('All trips:', trips);
          
          // Tìm trip có route_id khớp
          let matchingTrip = null;
          if (trips && trips.length > 0) {
            matchingTrip = trips.find((t: any) => {
              console.log('Checking trip:', t._id, 'route:', t.route?._id || t.route);
              return t.route === routeId || 
                     t.route_id === routeId || 
                     t.route?._id === routeId ||
                     (typeof t.route === 'object' && t.route?._id === routeId);
            });
          }
          
          console.log('Matching trip:', matchingTrip);
          const tripId = matchingTrip?._id || '6735b3f40ac061422206dc11'; // Fallback Trip ID
          console.log('Using trip ID:', tripId);
          console.log('Route ID was:', routeId);
          
          console.log('=== STARTING PAYMENT PROCESS ===');
          console.log('Trip ID to use:', tripId);
          console.log('User ID:', '6735b3f50ac061422206dc24');
          console.log('Seats:', successData.seats);
          console.log('Total amount:', successData.totalAmount);
          
          console.log('Making API call to create booking...');
          const bookingResult = await apiService.createBookingFromPayment({
            user: '6735b3f50ac061422206dc24', // User ID mặc định
            trip: tripId, // Trip ID từ database
            seat_numbers: successData.seats,
            total_price: successData.totalAmount
          });
          
          console.log('✅ Booking created successfully:', bookingResult);
          
          // Tạo payment record
          if (bookingResult && bookingResult._id) {
            const paymentData = {
              booking: bookingResult._id,
              user: '6735b3f50ac061422206dc24',
              method: successData.paymentMethod,
              amount: successData.totalAmount,
              transaction_code: successData.bookingId,
              status: 'success',
              paid_at: new Date()
            };
            
            console.log('Creating payment:', paymentData);
            await apiService.createPayment(paymentData);
            console.log('Payment created successfully');
          }

          // Lưu vé vào localStorage
          const ticket = {
            id: `ticket_${Date.now()}`,
            bookingId: successData.bookingId,
            route: successData.route,
            seats: successData.seats,
            passenger: successData.passenger,
            totalAmount: successData.totalAmount,
            paymentMethod: successData.paymentMethod,
            bookingDate: new Date().toISOString(),
            status: 'confirmed' as const
          };

          const existingTickets = JSON.parse(localStorage.getItem('vexe7tv_tickets') || '[]');
          existingTickets.push(ticket);
          localStorage.setItem('vexe7tv_tickets', JSON.stringify(existingTickets));
        } catch (error) {
          console.error('❌ Error saving booking:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          // Log thêm thông tin lỗi
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
          alert('Có lỗi xảy ra khi lưu booking. Vui lòng thử lại!');
        } finally {
          console.log('=== PAYMENT PROCESS COMPLETED ===');
          setSaving(false);
        }
      }
    };

    saveBookingToDatabase();
  }, [successData]);

  if (!successData) {
    navigate('/');
    return null;
  }

  if (saving) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Đang lưu đặt chỗ...</div>
        </div>
      </div>
    );
  }

  const handleDownloadTicket = () => {
    // Simulate ticket download
    alert('Vé điện tử đã được tải xuống!');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'momo': return 'Ví MoMo';
      case 'banking': return 'Chuyển khoản ngân hàng';
      case 'cod': return 'Thanh toán tại xe';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">VeXe7TV</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt vé thành công!</h2>
          <p className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ của VeXe7TV</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Thông tin vé */}
          <div className="space-y-6">
            {/* Vé điện tử */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Vé điện tử</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Đã thanh toán
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">VeXe7TV</div>
                  <div className="text-sm text-gray-600">Mã đặt vé: {successData.bookingId}</div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="font-semibold text-gray-900">{successData.route.from}</div>
                    <div className="text-sm text-gray-600">{successData.route.departureTime}</div>
                  </div>
                  
                  <div className="flex-1 mx-4">
                    <div className="border-t border-dashed border-gray-300"></div>
                    <div className="text-center mt-1">
                      <Clock className="h-4 w-4 inline mr-1" />
                      <span className="text-sm text-gray-600">{successData.route.duration}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <MapPin className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="font-semibold text-gray-900">{successData.route.to}</div>
                    <div className="text-sm text-gray-600">{successData.route.arrivalTime}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ghế:</span>
                    <span className="ml-2 font-medium">{successData.seats.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Loại xe:</span>
                    <span className="ml-2 font-medium">{successData.route.busType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hành khách:</span>
                    <span className="ml-2 font-medium">{successData.passenger.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">SĐT:</span>
                    <span className="ml-2 font-medium">{successData.passenger.phone}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleDownloadTicket}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Tải vé điện tử
              </button>
            </div>

            {/* Thông tin chuyến đi */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin chuyến đi</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Ngày khởi hành</p>
                    <p className="text-gray-600">{new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Giờ khởi hành</p>
                    <p className="text-gray-600">{successData.route.departureTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Bus className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Loại xe</p>
                    <p className="text-gray-600">{successData.route.busType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="space-y-6">
            {/* Chi tiết thanh toán */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết thanh toán</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đặt vé:</span>
                  <span className="font-medium">{successData.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium">{getPaymentMethodText(successData.paymentMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số ghế:</span>
                  <span className="font-medium">{successData.seats.length} ghế</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá vé/ghế:</span>
                  <span className="font-medium">{successData.route.price}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí dịch vụ:</span>
                  <span className="font-medium">0₫</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng thanh toán:</span>
                    <span className="text-green-600">{successData.totalAmount.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">Lưu ý quan trọng</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• Vui lòng có mặt tại bến xe trước giờ khởi hành 30 phút</li>
                <li>• Mang theo CMND/CCCD để đối chiếu khi lên xe</li>
                <li>• Vé điện tử đã được gửi về email của bạn</li>
                <li>• Liên hệ hotline 1900 1234 nếu cần hỗ trợ</li>
              </ul>
            </div>

            {/* Hành động */}
            <div className="space-y-3">
              <button
                onClick={handleBackToHome}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              >
                <Home className="h-5 w-5 mr-2" />
                Về trang chủ
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center font-medium"
              >
                <Download className="h-5 w-5 mr-2" />
                In vé
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cần hỗ trợ?</h3>
            <p className="text-gray-600 mb-4">
              Nếu bạn có bất kỳ thắc mắc nào về chuyến đi, vui lòng liên hệ với chúng tôi
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="font-medium">Hotline:</span>
                <span className="ml-2 text-blue-600">1900 1234</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-blue-600">support@vexe7tv.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
