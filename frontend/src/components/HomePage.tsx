import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus,
  MapPin,
  Clock,
  Calendar,
  LogOut,
  User,
  Search,
} from "lucide-react";

type RouteDoc = {
  _id: string;
  name?: string;
  from_city?: string;
  to_city?: string;
  total_distance_km?: number;
  estimated_duration_min?: number;
  active?: boolean;
};

const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any)?.env?.VITE_BACKEND_URL) || "";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [routes, setRoutes] = useState<RouteDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  // ✅ Lấy user từ localStorage (key đúng)
  useEffect(() => {
    const stored =
      localStorage.getItem("bv_current_user") || localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bv_current_user");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleBookingClick = (routeId: string) => {
    navigate(`/booking/${routeId}`);
  };

  // ✅ Load dữ liệu tuyến đường
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE}/api/routes`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: RouteDoc[] = await res.json();
        if (!mounted) return;

        const popular = (Array.isArray(data) ? data : [])
          .filter((r) => r?.active !== false)
          .slice(0, 6);
        setRoutes(popular);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Lỗi tải dữ liệu");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fmtDuration = (mins?: number) => {
    if (typeof mins !== "number" || Number.isNaN(mins)) return "-";
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Bus className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">VeXe7TV</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Trang chủ
              </button>
              <button
                onClick={() => navigate("/routes")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Tuyến đường
              </button>
              <button
                onClick={() => navigate("/my-tickets")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Vé của tôi
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Liên hệ
              </button>
            </nav>

            {/* User info / Login buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-700 font-medium">
                      {user.name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-1" /> Đăng xuất
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Đặt vé xe khách{" "}
            <span className="text-blue-600">dễ dàng & tiện lợi</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tìm kiếm và đặt vé nhanh chóng, an toàn, tiết kiệm thời gian cho bạn.
          </p>

          {/* Search box */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Điểm đi"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Điểm đến"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium">
                  <Search className="h-5 w-5 mr-2" /> Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tuyến đường phổ biến
            </h3>
            <p className="text-xl text-gray-600">
              Khám phá các tuyến đường được yêu thích nhất
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Đang tải tuyến đường…</div>
          ) : err ? (
            <div className="text-center text-red-600">Lỗi: {err}</div>
          ) : routes.length === 0 ? (
            <div className="text-center text-gray-500">Chưa có dữ liệu tuyến đường.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <div
                  key={route._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">
                        {route.from_city || "-"}
                      </span>
                    </div>
                    <div className="flex-1 mx-4 border-t border-dashed border-gray-300"></div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-gray-900">
                        {route.to_city || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {fmtDuration(route.estimated_duration_min)}
                    </div>
                    <div className="font-medium">
                      {typeof route.total_distance_km === "number"
                        ? `${route.total_distance_km} km`
                        : "-"}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookingClick(route._id)}
                    className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đặt vé ngay
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2025 VeXe7TV. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
