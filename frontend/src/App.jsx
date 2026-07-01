import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginScreen from './pages/LoginScreen';
import AdminLoginScreen from './pages/admin/AdminLoginScreen';
import Dashboard from './pages/Dashboard';
import RoomsPage from './pages/RoomsPage';
import DateTimePage from './pages/DateTimePage';
import FormPage from './pages/FormPage';
import PaymentDone from './pages/PaymentDone';
import MyReservationsPage from './pages/MyReservationsPage';
import PaymentPage from './pages/PaymentPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import { ROOMS } from './constants';

// Admin Imports
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminRooms from './pages/admin/AdminRooms';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReports from './pages/admin/AdminReports';
import AdminProfile from './pages/admin/AdminProfile';
import ChatWidget from './components/ChatWidget';

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Navigation states
  const [page, setPage] = useState("dashboard");
  const [adminPage, setAdminPage] = useState("dashboard");
  
  const [room, setRoom] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [user, setUser] = useState({ name: "Aksa Avendraz", email: "aksa@mail.com" });
  const [adminUser, setAdminUser] = useState({ name: "Administrator", email: "admin@ruangkita.com" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Customer Reservations
  const [reservations, setReservations] = useState([
    { id: 101, room: ROOMS[0], date: "24 Mei 2024", time: "09.00 - 10.00", status: "unpaid", code: "RB-82741" },
    { id: 102, room: ROOMS[2], date: "28 Mei 2024", time: "14.00 - 15.00", status: "paid", code: "RB-90234" },
  ]);

  const [history] = useState([
    { id: 201, room: ROOMS[1], date: "10 Mei 2024", time: "10.00 - 12.00", status: "completed" },
    { id: 202, room: ROOMS[3], date: "02 Apr 2024", time: "13.00 - 14.00", status: "cancelled" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Selamat Datang di RuangKita! Silakan jelajahi ruangan yang tersedia.", time: "Baru saja" },
    { id: 2, text: "Tagihan pending: Selesaikan pembayaran Ruang Meeting A.", time: "1 jam lalu" }
  ]);

  // Admin Mock Data State
  const [adminRooms, setAdminRooms] = useState(
    ROOMS.map(r => ({ ...r, status: 'Aktif', facilities: 'WiFi, Proyektor, AC, Papan Tulis', type: r.id % 2 === 0 ? 'Event Space' : 'Meeting Room' }))
  );

  const [adminBookings, setAdminBookings] = useState([
    { id: 1, code: "RB-90234", customerName: "Budi Santoso", customerEmail: "budi@mail.com", room: ROOMS[0], date: "29 Jun 2026", time: "09.00 - 11.00", capacity: 10, status: "Paid", paymentMethod: "Manual Bank Transfer" },
    { id: 2, code: "RB-82741", customerName: "Ani Wijaya", customerEmail: "ani@mail.com", room: ROOMS[2], date: "29 Jun 2026", time: "14.00 - 16.00", capacity: 20, status: "Pending", paymentMethod: "OVO/Gopay" },
    { id: 3, code: "RB-12345", customerName: "Rudi Hartono", customerEmail: "rudi@mail.com", room: ROOMS[1], date: "30 Jun 2026", time: "10.00 - 12.00", capacity: 8, status: "Confirmed", paymentMethod: "Credit Card" },
    { id: 4, code: "RB-45678", customerName: "Siti Rahma", customerEmail: "siti@mail.com", room: ROOMS[3], date: "28 Jun 2026", time: "13.00 - 14.00", capacity: 2, status: "Completed", paymentMethod: "Manual Bank Transfer" },
    { id: 5, code: "RB-98765", customerName: "Dewi Lestari", customerEmail: "dewi@mail.com", room: ROOMS[4], date: "27 Jun 2026", time: "15.00 - 17.00", capacity: 15, status: "Cancelled", paymentMethod: "Manual Bank Transfer" },
  ]);

  const [adminPayments, setAdminPayments] = useState([
    { id: 1, invoice: "INV-90234", bookingCode: "RB-90234", customerName: "Budi Santoso", customerEmail: "budi@mail.com", amount: 300000, method: "Manual Bank Transfer", status: "Paid", date: "29 Jun 2026" },
    { id: 2, invoice: "INV-82741", bookingCode: "RB-82741", customerName: "Ani Wijaya", customerEmail: "ani@mail.com", amount: 500000, method: "OVO/Gopay", status: "Pending", date: "29 Jun 2026" },
    { id: 3, invoice: "INV-12345", bookingCode: "RB-12345", customerName: "Rudi Hartono", customerEmail: "rudi@mail.com", amount: 250000, method: "Credit Card", status: "Paid", date: "29 Jun 2026" },
    { id: 4, invoice: "INV-98765", bookingCode: "RB-98765", customerName: "Dewi Lestari", customerEmail: "dewi@mail.com", amount: 400000, method: "Manual Bank Transfer", status: "Refund", date: "27 Jun 2026" }
  ]);

  const [adminCustomers, setAdminCustomers] = useState([
    { id: 1, name: "Budi Santoso", email: "budi@mail.com", status: "Aktif" },
    { id: 2, name: "Ani Wijaya", email: "ani@mail.com", status: "Aktif" },
    { id: 3, name: "Rudi Hartono", email: "rudi@mail.com", status: "Aktif" },
    { id: 4, name: "Siti Rahma", email: "siti@mail.com", status: "Aktif" },
    { id: 5, name: "Dewi Lestari", email: "dewi@mail.com", status: "Aktif" },
  ]);

  const handleClearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleConfirmPayment = (id) => {
    const target = reservations.find(r => r.id === id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "paid" } : r));
    if (target) {
      setNotifications(prev => [
        {
          id: Date.now(),
          text: `Pembayaran ${target.room.name} berhasil dikonfirmasi. Selamat menggunakan ruangan!`,
          time: "Baru saja"
        },
        ...prev
      ]);
    }
  };

  // ADMIN ACTION HANDLERS
  const handleUpdateBookingStatus = (id, status) => {
    setAdminBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    // Automatically update payment status if booking is paid or confirmed
    const targetBooking = adminBookings.find(b => b.id === id);
    if (targetBooking) {
      setAdminPayments(prev => prev.map(p => p.bookingCode === targetBooking.code ? { ...p, status: status === 'Cancelled' ? 'Failed' : status } : p));
    }
  };

  const handleCancelBooking = (id) => {
    handleUpdateBookingStatus(id, "Cancelled");
  };

  const handleVerifyPayment = (paymentId) => {
    setAdminPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'Paid' } : p));
    const targetPayment = adminPayments.find(p => p.id === paymentId);
    if (targetPayment) {
      setAdminBookings(prev => prev.map(b => b.code === targetPayment.bookingCode ? { ...b, status: 'Paid' } : b));
    }
  };

  const handleAddRoom = (roomData) => {
    const newRoom = {
      id: Date.now(),
      ...roomData
    };
    setAdminRooms(prev => [newRoom, ...prev]);
  };

  const handleUpdateRoom = (id, roomData) => {
    setAdminRooms(prev => prev.map(r => r.id === id ? { ...r, ...roomData } : r));
  };

  const handleToggleRoomStatus = (id) => {
    setAdminRooms(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : r));
  };

  const handleLogin = (admin) => {
    setAuthed(true);
    setIsAdmin(admin);
    setPage("dashboard");
    setAdminPage("dashboard");
  };

  if (!authed) {
    if (window.location.pathname === '/admin/login') {
      return <AdminLoginScreen onLogin={handleLogin} />;
    }
    return <LoginScreen onLogin={handleLogin} />;
  }

  // ADMIN ROUTING
  if (isAdmin) {
    let adminContent;
    if (adminPage === "dashboard") {
      adminContent = (
        <AdminDashboard 
          bookings={adminBookings}
          rooms={adminRooms}
          customers={adminCustomers}
          payments={adminPayments}
          onViewBookingDetail={(b) => {
            setAdminPage("bookings");
          }}
        />
      );
    } else if (adminPage === "bookings") {
      adminContent = (
        <AdminBookings 
          bookings={adminBookings}
          onUpdateStatus={handleUpdateBookingStatus}
          onCancelBooking={handleCancelBooking}
        />
      );
    } else if (adminPage === "rooms") {
      adminContent = (
        <AdminRooms 
          rooms={adminRooms}
          onAddRoom={handleAddRoom}
          onUpdateRoom={handleUpdateRoom}
          onToggleRoomStatus={handleToggleRoomStatus}
        />
      );
    } else if (adminPage === "payments") {
      adminContent = (
        <AdminPayments 
          payments={adminPayments}
          onVerifyPayment={handleVerifyPayment}
        />
      );
    } else if (adminPage === "customers") {
      adminContent = (
        <AdminCustomers 
          customers={adminCustomers}
          bookings={adminBookings}
          payments={adminPayments}
        />
      );
    } else if (adminPage === "reports") {
      adminContent = (
        <AdminReports 
          bookings={adminBookings}
          payments={adminPayments}
          customers={adminCustomers}
          rooms={adminRooms}
        />
      );
    } else if (adminPage === "profile") {
      adminContent = (
        <AdminProfile 
          user={adminUser}
          onUpdateUser={setAdminUser}
        />
      );
    }

    return (
      <div className="app-shell">
        <AdminSidebar 
          page={adminPage}
          setPage={setAdminPage}
          onLogout={() => setAuthed(false)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="main-area">
          <AdminTopbar 
            user={adminUser}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            setPage={setAdminPage}
            onLogout={() => setAuthed(false)}
          />
          {adminContent}
        </div>
        <ChatWidget />
      </div>
    );
  }

  // CUSTOMER ROUTING
  let content;
  if (page === "dashboard") {
    content = <Dashboard user={user} goToRooms={() => setPage("rooms")} />;
  } else if (page === "rooms") {
    content = <RoomsPage onSelect={(r) => { setRoom(r); setPage("date"); }} />;
  } else if (page === "date") {
    content = <DateTimePage room={room} onBack={() => setPage("rooms")} onNext={(s) => { setSchedule(s); setPage("form"); }} />;
  } else if (page === "form") {
    content = (
      <FormPage
        room={room}
        schedule={schedule}
        onBack={() => setPage("date")}
        onSubmit={() => {
          const newCode = "RB-" + Math.floor(10000 + Math.random() * 90000);
          const newRes = {
            id: Date.now(),
            room: room,
            date: `${schedule.day} Mei 2024`,
            time: schedule.time,
            status: "unpaid",
            code: newCode
          };
          setReservations(prev => [newRes, ...prev]);
          setNotifications(prev => [
            {
              id: Date.now(),
              text: `Reservasi ${room.name} (${newCode}) berhasil dibuat. Silakan selesaikan pembayaran.`,
              time: "Baru saja"
            },
            ...prev
          ]);
          setPage("done");
        }}
      />
    );
  } else if (page === "done") {
    content = <PaymentDone onBackHome={() => setPage("dashboard")} />;
  } else if (page === "myres") {
    content = <MyReservationsPage reservations={reservations} onPay={() => setPage("payment")} />;
  } else if (page === "payment") {
    content = <PaymentPage reservations={reservations} onConfirmPayment={handleConfirmPayment} />;
  } else if (page === "history") {
    content = <HistoryPage history={history} />;
  } else if (page === "profile") {
    content = <ProfilePage user={user} onUpdateUser={setUser} />;
  }

  return (
    <div className="app-shell">
      <Sidebar 
        page={page} 
        setPage={setPage} 
        onLogout={() => setAuthed(false)} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-area">
        <Topbar 
          user={user} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          notifications={notifications}
          onClearNotification={handleClearNotification}
        />
        {content}
      </div>
      <ChatWidget />
    </div>
  );
}

