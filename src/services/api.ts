// frontend/src/services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

export interface Trip {
  _id: string;
  route: {
    _id: string;
    name: string;
    from_city: string;
    to_city: string;
    total_distance_km: number;
    estimated_duration_min: number;
  };
  bus: {
    _id: string;
    plate_number: string;
    seat_count: number;
    bus_type: string;
  };
  start_time: string;
  end_time: string;
  base_price: number;
  direction: 'go' | 'return';
  status: 'scheduled' | 'departed' | 'completed' | 'cancelled';
}

export interface Booking {
  _id: string;
  user: string;
  trip: Trip;
  seat_numbers: string[];
  total_price: number;
  status: 'pending' | 'paid' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface User {
  _id: string;
  full_name: string;
  phone: string;
  email: string;
  role: 'customer' | 'driver' | 'assistant' | 'admin';
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Trips API
  async getTrips(): Promise<Trip[]> {
    return this.request<Trip[]>('/trips');
  }

  async getTripById(id: string): Promise<Trip> {
    return this.request<Trip>(`/trips/${id}`);
  }

  // Routes API
  async getRoutes(): Promise<any[]> {
    return this.request<any[]>('/routes');
  }

  // Bookings API
  async createBooking(bookingData: {
    user: string;
    trip: string;
    seat_numbers: string[];
    total_price: number;
  }): Promise<Booking> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.request<Booking[]>(`/bookings/user/${userId}`);
  }

  // Auth API
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Payments API
  async createPayment(paymentData: {
    booking_id: string;
    amount: number;
    method: string;
    status: string;
  }): Promise<any> {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Admin API
  async getDashboardStats(): Promise<any> {
    return this.request<any>('/admin/dashboard');
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }

  async getAdminBuses(): Promise<any[]> {
    return this.request<any[]>('/admin/buses');
  }

  async getAdminRoutes(): Promise<any[]> {
    return this.request<any[]>('/admin/routes');
  }

  async getAdminTrips(): Promise<any[]> {
    return this.request<any[]>('/admin/trips');
  }

  async getAdminBookings(): Promise<any[]> {
    return this.request<any[]>('/admin/bookings');
  }

  async getAdminPayments(): Promise<any[]> {
    return this.request<any[]>('/admin/payments');
  }

  async getAdminReviews(): Promise<any[]> {
    return this.request<any[]>('/admin/reviews');
  }

  // CRUD operations
  async createTrip(data: any): Promise<any> {
    return this.request<any>('/admin/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createBus(data: any): Promise<any> {
    return this.request<any>('/admin/buses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createRoute(data: any): Promise<any> {
    return this.request<any>('/admin/routes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrip(id: string, data: any): Promise<any> {
    return this.request<any>(`/admin/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateBus(id: string, data: any): Promise<any> {
    return this.request<any>(`/admin/buses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateRoute(id: string, data: any): Promise<any> {
    return this.request<any>(`/admin/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRoute(id: string): Promise<any> {
    return this.request<any>(`/admin/routes/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking from payment
  async createBookingFromPayment(data: any): Promise<any> {
    return this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Create payment
  async createPaymentVNPay(data: any): Promise<any> {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
