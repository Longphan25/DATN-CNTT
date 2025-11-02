import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bus, MapPin, Clock, CreditCard, Shield, CheckCircle, Lock } from 'lucide-react';

interface PaymentData {
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
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state as PaymentData;

  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'banking' | 'cod'>('momo');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!paymentData) {
    navigate('/');
    return null;
  }

  const totalAmount = parseInt(paymentData.route.price.replace(',', '')) * paymentData.seats.length;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment-success', { 
        state: { 
          ...paymentData, 
          totalAmount,
          paymentMethod,
          bookingId: `BK${Date.now()}`
        } 
      });
    }, 2000);
  };

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h2>
          <p className="text-gray-600">Hoàn tất đặt vé của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Thông tin đặt vé */}
          <div className="space-y-6">
            {/* Thông tin tuyến đường */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin chuyến đi</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-semibold text-gray-900">{paymentData.route.from}</p>
                    <p className="text-sm text-gray-600">Điểm đi</p>
                  </div>
                </div>
                
                <div className="flex-1 mx-4">
                  <div className="border-t border-dashed border-gray-300"></div>
                  <div className="text-center mt-1">
                    <Clock className="h-4 w-4 inline mr-1" />
                    <span className="text-sm text-gray-600">{paymentData.route.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-semibold text-gray-900">{paymentData.route.to}</p>
                    <p className="text-sm text-gray-600">Điểm đến</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Giờ khởi hành:</span>
                  <span className="ml-2 font-medium">{paymentData.route.departureTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">Giờ đến:</span>
                  <span className="ml-2 font-medium">{paymentData.route.arrivalTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">Loại xe:</span>
                  <span className="ml-2 font-medium">{paymentData.route.busType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ghế đã chọn:</span>
                  <span className="ml-2 font-medium">{paymentData.seats.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Thông tin hành khách */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin hành khách</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Họ và tên:</span>
                  <span className="font-medium">{paymentData.passenger.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{paymentData.passenger.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{paymentData.passenger.email || 'Không có'}</span>
                </div>
                {paymentData.passenger.note && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ghi chú:</span>
                    <span className="font-medium">{paymentData.passenger.note}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="space-y-6">
            {/* Chọn phương thức thanh toán */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Phương thức thanh toán</h3>
              
              <div className="space-y-4">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'momo' 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('momo')}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center">
                      {paymentMethod === 'momo' && <div className="w-3 h-3 bg-pink-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-pink-500 rounded mr-3 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Ví MoMo</p>
                          <p className="text-sm text-gray-600">Thanh toán qua ví điện tử MoMo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'banking' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('banking')}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center">
                      {paymentMethod === 'banking' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">Chuyển khoản ngân hàng</p>
                          <p className="text-sm text-gray-600">Thanh toán qua Internet Banking</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'cod' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center">
                      {paymentMethod === 'cod' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Bus className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">Thanh toán tại xe</p>
                          <p className="text-sm text-gray-600">Trả tiền khi lên xe</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tóm tắt thanh toán */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt thanh toán</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số ghế:</span>
                  <span className="font-medium">{paymentData.seats.length} ghế</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá vé/ghế:</span>
                  <span className="font-medium">{paymentData.route.price}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí dịch vụ:</span>
                  <span className="font-medium">0₫</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{totalAmount.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    Giao dịch được bảo mật và mã hóa SSL
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center ${
                  isProcessing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Thanh toán {totalAmount.toLocaleString()}₫
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Bằng cách thanh toán, bạn đồng ý với 
                <a href="#" className="text-blue-600 hover:underline"> Điều khoản sử dụng</a> và 
                <a href="#" className="text-blue-600 hover:underline"> Chính sách bảo mật</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
