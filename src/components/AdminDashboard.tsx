import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Users, Bus, Ticket, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data tables
  const [users, setUsers] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Form states
  const [showBusForm, setShowBusForm] = useState(false);
  const [editingBus, setEditingBus] = useState<any>(null);
  const [busForm, setBusForm] = useState({
    license_plate: '',
    bus_type: '',
    seat_count: '',
    active: true
  });

  // Route form states
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [routeForm, setRouteForm] = useState({
    name: '',
    from_city: '',
    to_city: '',
    total_distance_km: '',
    estimated_duration_min: '',
    active: true
  });

  // Trip form states
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [tripForm, setTripForm] = useState({
    route: '',
    bus: '',
    start_time: '',
    end_time: '',
    base_price: '',
    direction: 'go',
    status: 'scheduled'
  });

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'dashboard') {
        console.log('Loading dashboard data...');
        const dashboardData = await apiService.getDashboardStats();
        console.log('Dashboard data received:', dashboardData);
        setStats(dashboardData.stats);
        setRecentBookings(dashboardData.recentBookings || []);
      } else if (activeTab === 'users') {
        console.log('Loading users...');
        const data = await apiService.getUsers();
        console.log('Users data:', data);
        setUsers(data);
      } else if (activeTab === 'buses') {
        console.log('Loading buses...');
        const data = await apiService.getAdminBuses();
        console.log('Buses data:', data);
        setBuses(data);
      } else if (activeTab === 'routes') {
        console.log('Loading routes...');
        const data = await apiService.getAdminRoutes();
        console.log('Routes data:', data);
        setRoutes(data);
      } else if (activeTab === 'trips') {
        console.log('Loading trips...');
        const data = await apiService.getAdminTrips();
        console.log('Trips data:', data);
        setTrips(data);
      } else if (activeTab === 'bookings') {
        console.log('Loading bookings...');
        const data = await apiService.getAdminBookings();
        console.log('Bookings data:', data);
        if (data && data.length > 0) {
          console.log('First booking full object:', JSON.stringify(data[0], null, 2));
          console.log('First booking user:', data[0].user);
          console.log('First booking trip:', data[0].trip);
        }
        setBookings(data);
      } else if (activeTab === 'payments') {
        console.log('Loading payments...');
        const data = await apiService.getAdminPayments();
        console.log('Payments data:', data);
        setPayments(data);
      } else if (activeTab === 'reviews') {
        console.log('Loading reviews...');
        const data = await apiService.getAdminReviews();
        console.log('Reviews data:', data);
        setReviews(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Bus CRUD functions
  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createBus({
        ...busForm,
        seat_count: parseInt(busForm.seat_count)
      });
      setShowBusForm(false);
      setBusForm({ license_plate: '', bus_type: '', seat_count: '', active: true });
      loadDashboardData(); // Reload data
      alert('Tạo xe thành công!');
    } catch (error) {
      alert('Lỗi khi tạo xe: ' + (error as Error).message);
    }
  };

  const handleEditBus = (bus: any) => {
    setEditingBus(bus);
    setBusForm({
      license_plate: bus.license_plate,
      bus_type: bus.bus_type,
      seat_count: bus.seat_count.toString(),
      active: bus.active
    });
    setShowBusForm(true);
  };

  const handleUpdateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateBus(editingBus._id, {
        ...busForm,
        seat_count: parseInt(busForm.seat_count)
      });
      setShowBusForm(false);
      setEditingBus(null);
      setBusForm({ license_plate: '', bus_type: '', seat_count: '', active: true });
      loadDashboardData();
      alert('Cập nhật xe thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật xe: ' + (error as Error).message);
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (confirm('Bạn có chắc muốn xóa xe này?')) {
      try {
        await apiService.deleteBus(busId);
        loadDashboardData();
        alert('Xóa xe thành công!');
      } catch (error) {
        alert('Lỗi khi xóa xe: ' + (error as Error).message);
      }
    }
  };

  // Route CRUD functions
  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createRoute({
        ...routeForm,
        total_distance_km: parseInt(routeForm.total_distance_km),
        estimated_duration_min: parseInt(routeForm.estimated_duration_min)
      });
      setShowRouteForm(false);
      setRouteForm({ name: '', from_city: '', to_city: '', total_distance_km: '', estimated_duration_min: '', active: true });
      loadDashboardData();
      alert('Tạo tuyến thành công!');
    } catch (error) {
      alert('Lỗi khi tạo tuyến: ' + (error as Error).message);
    }
  };

  const handleEditRoute = (route: any) => {
    setEditingRoute(route);
    setRouteForm({
      name: route.name,
      from_city: route.from_city,
      to_city: route.to_city,
      total_distance_km: route.total_distance_km.toString(),
      estimated_duration_min: route.estimated_duration_min.toString(),
      active: route.active
    });
    setShowRouteForm(true);
  };

  const handleUpdateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateRoute(editingRoute._id, {
        ...routeForm,
        total_distance_km: parseInt(routeForm.total_distance_km),
        estimated_duration_min: parseInt(routeForm.estimated_duration_min)
      });
      setShowRouteForm(false);
      setEditingRoute(null);
      setRouteForm({ name: '', from_city: '', to_city: '', total_distance_km: '', estimated_duration_min: '', active: true });
      loadDashboardData();
      alert('Cập nhật tuyến thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật tuyến: ' + (error as Error).message);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (confirm('Bạn có chắc muốn xóa tuyến này?')) {
      try {
        await apiService.deleteRoute(routeId);
        loadDashboardData();
        alert('Xóa tuyến thành công!');
      } catch (error) {
        alert('Lỗi khi xóa tuyến: ' + (error as Error).message);
      }
    }
  };


  if (loading && activeTab === 'dashboard') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Quản lý hệ thống đặt vé xe</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {['dashboard', 'users', 'buses', 'routes', 'trips', 'bookings', 'payments', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chuyến xe</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTrips}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Bus className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đặt vé</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Ticket className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Đặt vé gần đây</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chuyến xe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ghế
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking: any) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof booking.user === 'object' ? booking.user?.full_name : booking.user || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof booking.trip === 'object' ? booking.trip?.route?.name : booking.trip || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.seat_numbers?.join(', ') || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(booking.total_price || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'paid' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Data Tables for other tabs */}
        {activeTab !== 'dashboard' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">{activeTab}</h2>
            </div>
            <div className="p-6">
              {loading && <div>Loading...</div>}
              {!loading && (
                <div>
                  {/* Users */}
                  {activeTab === 'users' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user: any) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.full_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Buses */}
                  {activeTab === 'buses' && (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Quản lý xe</h3>
                        <button
                          onClick={() => {
                            setEditingBus(null);
                            setBusForm({ license_plate: '', bus_type: '', seat_count: '', active: true });
                            setShowBusForm(true);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Thêm xe mới
                        </button>
                      </div>

                      {/* Bus Form Modal */}
                      {showBusForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded-lg w-96">
                            <h3 className="text-lg font-semibold mb-4">
                              {editingBus ? 'Sửa xe' : 'Thêm xe mới'}
                            </h3>
                            <form onSubmit={editingBus ? handleUpdateBus : handleCreateBus}>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Biển số xe
                                </label>
                                <input
                                  type="text"
                                  value={busForm.license_plate}
                                  onChange={(e) => setBusForm({ ...busForm, license_plate: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Loại xe
                                </label>
                                <input
                                  type="text"
                                  value={busForm.bus_type}
                                  onChange={(e) => setBusForm({ ...busForm, bus_type: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Số ghế
                                </label>
                                <input
                                  type="number"
                                  value={busForm.seat_count}
                                  onChange={(e) => setBusForm({ ...busForm, seat_count: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={busForm.active}
                                    onChange={(e) => setBusForm({ ...busForm, active: e.target.checked })}
                                    className="mr-2"
                                  />
                                  <span className="text-sm font-medium text-gray-700">Hoạt động</span>
                                </label>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setShowBusForm(false)}
                                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  Hủy
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  {editingBus ? 'Cập nhật' : 'Tạo'}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biển số</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại xe</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số ghế</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {buses.map((bus: any) => (
                              <tr key={bus._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.license_plate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.bus_type || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bus.seat_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    bus.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {bus.active ? 'Hoạt động' : 'Ngưng'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleEditBus(bus)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBus(bus._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Routes */}
                  {activeTab === 'routes' && (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Quản lý tuyến đường</h3>
                        <button
                          onClick={() => {
                            setEditingRoute(null);
                            setRouteForm({ name: '', from_city: '', to_city: '', total_distance_km: '', estimated_duration_min: '', active: true });
                            setShowRouteForm(true);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Thêm tuyến mới
                        </button>
                      </div>

                      {/* Route Form Modal */}
                      {showRouteForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded-lg w-96">
                            <h3 className="text-lg font-semibold mb-4">
                              {editingRoute ? 'Sửa tuyến' : 'Thêm tuyến mới'}
                            </h3>
                            <form onSubmit={editingRoute ? handleUpdateRoute : handleCreateRoute}>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tên tuyến
                                </label>
                                <input
                                  type="text"
                                  value={routeForm.name}
                                  onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Điểm đi
                                </label>
                                <input
                                  type="text"
                                  value={routeForm.from_city}
                                  onChange={(e) => setRouteForm({ ...routeForm, from_city: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Điểm đến
                                </label>
                                <input
                                  type="text"
                                  value={routeForm.to_city}
                                  onChange={(e) => setRouteForm({ ...routeForm, to_city: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Khoảng cách (km)
                                </label>
                                <input
                                  type="number"
                                  value={routeForm.total_distance_km}
                                  onChange={(e) => setRouteForm({ ...routeForm, total_distance_km: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Thời gian (phút)
                                </label>
                                <input
                                  type="number"
                                  value={routeForm.estimated_duration_min}
                                  onChange={(e) => setRouteForm({ ...routeForm, estimated_duration_min: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="mb-4">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={routeForm.active}
                                    onChange={(e) => setRouteForm({ ...routeForm, active: e.target.checked })}
                                    className="mr-2"
                                  />
                                  <span className="text-sm font-medium text-gray-700">Hoạt động</span>
                                </label>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setShowRouteForm(false)}
                                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  Hủy
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  {editingRoute ? 'Cập nhật' : 'Tạo'}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tuyến</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm đi</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm đến</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khoảng cách</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {routes.map((route: any) => (
                              <tr key={route._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.from_city}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.to_city}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.total_distance_km} km</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.estimated_duration_min} phút</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleEditRoute(route)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRoute(route._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Trips */}
                  {activeTab === 'trips' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuyến</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ đi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {trips.map((trip: any) => {
                            // Debug log
                            if (trip.route === null || trip.bus === null) {
                              console.log('Trip with null data:', trip._id, 'route:', trip.route, 'bus:', trip.bus);
                            }
                            
                            // Hiển thị thông tin route - lấy từ_city và to_city
                            let routeName = '-';
                            if (trip.route && typeof trip.route === 'object') {
                              // Ưu tiên hiển thị name nếu có, nếu không thì dùng from_city - to_city
                              if (trip.route.name) {
                                routeName = trip.route.name;
                              } else {
                                routeName = `${trip.route.from_city || ''} - ${trip.route.to_city || ''}`;
                              }
                            } else if (trip.route_id) {
                              routeName = `Route ID: ${trip.route_id}`;
                            }
                            
                            // Hiển thị thông tin bus
                            let busPlate = '-';
                            if (trip.bus && typeof trip.bus === 'object') {
                              busPlate = trip.bus.license_plate || trip.bus.plate_number || trip.bus.bus_type || 'Unknown Bus';
                            } else if (trip.bus_id) {
                              busPlate = `Bus ID: ${trip.bus_id}`;
                            }
                            
                            return (
                              <tr key={trip._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{routeName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{busPlate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(trip.start_time).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(trip.base_price || 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    trip.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    trip.status === 'departed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {trip.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Bookings */}
                  {activeTab === 'bookings' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chuyến</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ghế</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bookings.map((booking: any) => {
                            // Hiển thị thông tin user - nếu null thì lấy từ raw ID
                            let userName = '-';
                            if (booking.user && typeof booking.user === 'object') {
                              userName = booking.user.full_name || booking.user.name || 'Unknown User';
                            } else if (booking.user) {
                              userName = String(booking.user);
                            } else {
                              // User null - hiển thị seat numbers hoặc booking ID
                              userName = `Booking #${booking._id?.slice(-6)}`;
                            }
                            
                            // Hiển thị thông tin trip
                            let tripName = '-';
                            if (booking.trip && typeof booking.trip === 'object') {
                              if (booking.trip.route && typeof booking.trip.route === 'object') {
                                tripName = booking.trip.route.name || `${booking.trip.route.from_city} - ${booking.trip.route.to_city}`;
                              } else {
                                tripName = `Trip #${booking.trip._id?.slice(-6)}`;
                              }
                            } else if (booking.trip) {
                              tripName = String(booking.trip);
                            } else {
                              tripName = `Trip #${booking.trip_id?.slice(-6) || 'Unknown'}`;
                            }
                            
                            return (
                              <tr key={booking._id || booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tripName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.seat_numbers?.join(', ') || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(booking.total_price || 0)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    booking.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Payments */}
                  {activeTab === 'payments' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phương thức</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {payments.map((payment: any) => (
                            <tr key={payment._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.booking?._id || payment.booking || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payment.amount || 0)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  payment.status === 'success' ? 'bg-green-100 text-green-800' :
                                  payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Reviews */}
                  {activeTab === 'reviews' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bình luận</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reviews.map((review: any) => (
                            <tr key={review._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {typeof review.user === 'object' ? review.user?.full_name : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {review.rating ? '⭐'.repeat(review.rating) : '-'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{review.comment || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

