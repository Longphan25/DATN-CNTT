require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const RouteStop = require('./models/RouteStop');
const Trip = require('./models/Trip');

(async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Bus.deleteMany();
    await Route.deleteMany();
    await RouteStop.deleteMany();
    await Trip.deleteMany();

    const u = await User.create({ full_name: 'Nguyễn Văn A', phone: '0901234567', email: 'a@gmail.com', role: 'customer' });
    const driver = await User.create({ full_name: 'Tài xế', phone: '090888999', email: 'driver@gmail.com', role: 'driver' });
    const assistant = await User.create({ full_name: 'Phụ xe', phone: '091111222', email: 'assistant@gmail.com', role: 'assistant' });

    const bus1 = await Bus.create({ license_plate: '29B-12345', bus_type: 'Ghế ngồi 29 chỗ', seat_count: 29 });
    const bus2 = await Bus.create({ license_plate: '29B-67890', bus_type: 'Giường nằm 40 chỗ', seat_count: 40 });

    const route = await Route.create({ name: 'Thái Nguyên - Hà Nội', from_city: 'Thái Nguyên', to_city: 'Hà Nội', total_distance_km: 80, estimated_duration_min: 120 });

    await RouteStop.create({ route: route._id, stop_name: 'Bến xe Thái Nguyên', order: 1 });
    await RouteStop.create({ route: route._id, stop_name: 'Cầu Nhật Tân', order: 2 });
    await RouteStop.create({ route: route._id, stop_name: 'Bến xe Mỹ Đình (Hà Nội)', order: 3 });

    await Trip.create({ route: route._id, bus: bus1._id, start_time: new Date('2025-10-24T08:00:00Z'), end_time: new Date('2025-10-24T10:00:00Z'), base_price: 100000, direction: 'go' });
    await Trip.create({ route: route._id, bus: bus1._id, start_time: new Date('2025-10-24T11:00:00Z'), end_time: new Date('2025-10-24T13:00:00Z'), base_price: 100000, direction: 'return' });
    await Trip.create({ route: route._id, bus: bus2._id, start_time: new Date('2025-10-24T11:00:00Z'), end_time: new Date('2025-10-24T13:00:00Z'), base_price: 100000, direction: 'go' });
    await Trip.create({ route: route._id, bus: bus2._id, start_time: new Date('2025-10-24T15:00:00Z'), end_time: new Date('2025-10-24T17:00:00Z'), base_price: 100000, direction: 'return' });

    console.log('✅ Seed finished');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
