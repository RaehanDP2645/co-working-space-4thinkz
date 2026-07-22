import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
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
import RecommendationPage from './pages/RecommendationPage';
import { ROOMS, rupiah, getRoomImg } from './constants';
import ChatbotWidget from './components/ChatbotWidget';
import { createTransaction, getTransaction, simulatePayment } from './services/paywuz';
import { api } from './services/api';

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

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [authPage, setAuthPage] = useState('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const isAdminPath = () => window.location.pathname.startsWith('/admin');
  const tokenKey = () => isAdminPath() ? 'token_admin' : 'token_user';
  const [adminMode, setAdminMode] = useState(isAdminPath());
  const [booting, setBooting] = useState(true);
  
  // sinkron page saat tombol back/forward browser
  useEffect(() => {
    const onPop = () => {
      if (isAdminPath()) {
        setAdminMode(true);
        setAdminPage(window.location.pathname.replace('/admin','').replace(/^\//,'') || 'dashboard');
      } else {
        setPage(PATH_TO_PAGE[window.location.pathname] || 'dashboard');
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const finishGoogleLogin = async (code) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/exchange', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({code}),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem(tokenKey(), data.token);
        await handleCustomerLogin();
      }
    } catch (e) {
      console.error('Google login gagal', e);
    }
  };

  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const orderId = params.get('orderId');
      if (code) {
        window.history.replaceState({}, document.title, window.location.pathname);
        finishGoogleLogin(code);
      }
      if (orderId) {
        window.history.replaceState({}, document.title, window.location.pathname);
        handleCheckPaymentByOrder(orderId);
      }
      setBooting(true);
      if (localStorage.getItem(tokenKey())) {
        if (isAdminPath()) {
          // refresh di /admin: verifikasi token admin
          api.getAdminDashboard().then(() => {
            setIsAdmin(true);
            setAdminMode(true);
            setAuthed(true);
            setBooting(false);
            loadAdminData();
          }).catch(() => {
            localStorage.removeItem(tokenKey());
            setAuthed(false);
            setBooting(false);
            setAdminMode(true);
          });
        } else {
          // refresh di / : load user dulu, baru authed (hindari flash template)
          api.getUser().then(u => {
            setUser({ name: u.name || 'Pengguna', email: u.email, phone: u.no_telepon || '', avatar: u.avatar_url || null });
            if (u.role === 'admin') {
              window.history.pushState({}, '', '/admin');
              setAdminMode(true);
            } else {
              setAuthed(true);
              api.getRooms().then(setBackendRooms).catch(() => {});
              loadReservations();
            }
            setBooting(false);
          }).catch(() => {
            localStorage.removeItem(tokenKey());
            setAuthed(false);
            setBooting(false);
          });
        }
      } else {
        setBooting(false);
      }
  }, []);


  const loadReservations = () => {
    if (!localStorage.getItem(tokenKey())) return;
    api.getReservations()
      .then(data => setBackendReservations(data.map(b => ({
        id: b.id,
        room: b.room ? { ...b.room, img: getRoomImg(b.room.name, b.room.img) } : null,
        date: b.date,
        time: b.time,
        status: b.status === 'pending' ? 'unpaid' : b.status,
        code: b.code,
        paymentType: null,
        dpAmount: 0,
        paywuzTrxId: null,
        batasPembayaran: b.batas_pembayaran || null,
        isExpired: b.is_expired || false,
      }))))
      .catch(() => {});
  };

  const mapBackendRoom = (r) => {
    return {
      id: r.id,
      name: r.nama_ruangan,
      cap: r.kapasitas,
      price: Number(r.harga_per_jam),
      img: getRoomImg(r.nama_ruangan, r.gambar_url),
    };
  };

  // URL-based routing (path -> page) -- dideklarasikan SEBELUM useState agar tidak TDZ
  const PATH_TO_PAGE = {
    '/': 'dashboard',
    '/ruangan': 'rooms',
    '/rekomendasi': 'recommendation',
    '/jadwal': 'date',
    '/form': 'form',
    '/selesai': 'done',
    '/reservasi': 'myres',
    '/pembayaran': 'payment',
    '/riwayat': 'history',
    '/profil': 'profile',
  };
  const PAGE_TO_PATH = {
    'dashboard': '/', 'rooms': '/ruangan', 'recommendation': '/rekomendasi', 'date': '/jadwal', 'form': '/form',
    'done': '/selesai', 'myres': '/reservasi', 'payment': '/pembayaran',
    'history': '/riwayat', 'profile': '/profil',
  };
  const pageFromPath = () => {
    const path = window.location.pathname;
    if (isAdminPath()) {
      const sub = path.replace('/admin', '').replace(/^\//, '') || 'dashboard';
      return sub;
    }
    return PATH_TO_PAGE[path] || 'dashboard';
  };
  const goPage = (p) => { sessionStorage.setItem('user_page', p); setPage(p); window.history.pushState({}, '', PAGE_TO_PATH[p] || '/'); };
  const goAdminPage = (p) => { sessionStorage.setItem('admin_page', p); setAdminPage(p); window.history.pushState({}, '', p === 'dashboard' ? '/admin' : '/admin/' + p); };

  // Navigation states
  const [page, setPage] = useState(pageFromPath());
  const [adminPage, setAdminPage] = useState(isAdminPath() ? (window.location.pathname.replace('/admin','').replace(/^\//,'') || 'dashboard') : (sessionStorage.getItem('admin_page') || "dashboard"));
  
  const [room, setRoom] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState({ name: "Administrator", email: "admin@ruangkita.com" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const [backendRooms, setBackendRooms] = useState([]);
  const [backendReservations, setBackendReservations] = useState([]);
  
  // Customer Reservations
  const [reservations, setReservations] = useState([
    { id: 101, room: ROOMS[0], date: "24 Mei 2024", time: "09.00 - 10.00", status: "unpaid", code: "RB-82741", paymentType: null, dpAmount: 0, paywuzTrxId: null },
    { id: 102, room: ROOMS[2], date: "28 Mei 2024", time: "14.00 - 15.00", status: "paid", code: "RB-90234", paymentType: "full", dpAmount: 0, paywuzTrxId: null },
  ]);

  const [history] = useState([
    { id: 201, room: ROOMS[1], date: "10 Mei 2024", time: "10.00 - 12.00", status: "completed" },
    { id: 202, room: ROOMS[3], date: "02 Apr 2024", time: "13.00 - 14.00", status: "cancelled" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Selamat Datang di RuangKita! Silakan jelajahi ruangan yang tersedia.", time: "Baru saja" },
    { id: 2, text: "Tagihan pending: Selesaikan pembayaran Ruang Meeting A.", time: "1 jam lalu" }
  ]);

  // Admin Data State
  const [adminStats, setAdminStats] = useState(null);
  const [adminRooms, setAdminRooms] = useState(
    ROOMS.map(r => ({ ...r, status: 'Aktif', facilities: 'WiFi, Proyektor, AC, Papan Tulis', type: r.id % 2 === 0 ? 'Event Space' : 'Meeting Room' }))
  );

  const [adminBookings, setAdminBookings] = useState([
    { id: 1, code: "RB-90234", customerName: "Budi Santoso", customerEmail: "budi@mail.com", room: ROOMS[0], date: "29 Jun 2026", time: "09.00 - 11.00", capacity: 10, status: "Paid", paymentMethod: "QRIS" },
    { id: 2, code: "RB-82741", customerName: "Ani Wijaya", customerEmail: "ani@mail.com", room: ROOMS[2], date: "29 Jun 2026", time: "14.00 - 16.00", capacity: 20, status: "Pending", paymentMethod: "QRIS" },
    { id: 3, code: "RB-12345", customerName: "Rudi Hartono", customerEmail: "rudi@mail.com", room: ROOMS[1], date: "30 Jun 2026", time: "10.00 - 12.00", capacity: 8, status: "Confirmed", paymentMethod: "QRIS" },
    { id: 4, code: "RB-45678", customerName: "Siti Rahma", customerEmail: "siti@mail.com", room: ROOMS[3], date: "28 Jun 2026", time: "13.00 - 14.00", capacity: 2, status: "Completed", paymentMethod: "QRIS" },
    { id: 5, code: "RB-98765", customerName: "Dewi Lestari", customerEmail: "dewi@mail.com", room: ROOMS[4], date: "27 Jun 2026", time: "15.00 - 17.00", capacity: 15, status: "Cancelled", paymentMethod: "QRIS" },
  ]);

  const [adminPayments, setAdminPayments] = useState([
    { id: 1, invoice: "INV-90234", bookingCode: "RB-90234", customerName: "Budi Santoso", customerEmail: "budi@mail.com", amount: 300000, method: "QRIS", status: "Paid", date: "29 Jun 2026" },
    { id: 2, invoice: "INV-82741", bookingCode: "RB-82741", customerName: "Ani Wijaya", customerEmail: "ani@mail.com", amount: 500000, method: "QRIS", status: "Pending", date: "29 Jun 2026" },
    { id: 3, invoice: "INV-12345", bookingCode: "RB-12345", customerName: "Rudi Hartono", customerEmail: "rudi@mail.com", amount: 250000, method: "QRIS", status: "Paid", date: "29 Jun 2026" },
    { id: 4, invoice: "INV-98765", bookingCode: "RB-98765", customerName: "Dewi Lestari", customerEmail: "dewi@mail.com", amount: 400000, method: "QRIS", status: "Refund", date: "27 Jun 2026" }
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

  const getOrderId = (code, type) => {
    if (type === 'dp') return `${code}-DP`;
    if (type === 'remaining') return `${code}-SISA`;
    return `${code}-FULL`;
  };

  const handlePaywuzPayment = async (id, paymentType) => {
    const target = backendReservations.find(r => r.id === id);
    if (!target) return;

    const totalPrice = target.room.price;
    const dpAmount = Math.round(totalPrice * 0.5);
    const amount = paymentType === 'dp' ? dpAmount : totalPrice;
    const orderId = getOrderId(target.code, paymentType);

    const result = await createTransaction({
      orderId,
      amount,
      paymentMethod: 'QRIS',
      redirectUrl: `${window.location.origin}/?orderId=${orderId}`,
      metadata: {
        reservationCode: target.code, //ambil kode pemesanan
        reservationId: id,
        paymentType,
        roomName: target.room.name,
      },
    });

    setBackendReservations(prev => prev.map(r =>
      r.id === id ? {
        ...r,
        paywuzTrxId: orderId,
        paymentType,
        dpAmount: paymentType === 'dp' ? dpAmount : 0,
        status: 'pending_payment',
      } : r
    ));

    return result;
  };

  const handleCheckPayment = async (id) => {
    const target = backendReservations.find(r => r.id === id);
    if (!target || !target.paywuzTrxId) return null;

    try {
      const result = await getTransaction(target.paywuzTrxId);
      const status = result?.data?.status ?? result?.status;
      if (result && (status === 'settlement' || status === 'success')) {
        const isDp = target.paymentType === 'dp';
        const isRemaining = target.paymentType === 'remaining';
        setBackendReservations(prev => prev.map(r =>
          r.id === id ? {
            ...r,
            status: isDp ? 'partial' : 'paid',
            paymentType: isDp ? 'dp' : isRemaining ? 'remaining' : 'full',
          } : r
        ));
        setNotifications(prev => [
          {
            id: Date.now(),
            text: isDp
              ? `DP ${rupiah(target.dpAmount)} untuk ${target.room.name} telah diterima. Silakan lunasi sisa pembayaran.`
              : `Pembayaran ${target.room.name} lunas! Selamat menggunakan ruangan!`,
            time: "Baru saja"
          },
          ...prev
        ]);
        return result;
      }
      return result;
    } catch (e) {
      showToast('error', e.message || 'Gagal memproses pembayaran');
      return null;
    }
  };

  const handleCheckPaymentByOrder = async (orderId) => {
    try {
      const result = await getTransaction(orderId);
      if (result && (result.status === 'settlement' || result.status === 'success' || result.status === 'paid')) {
        const code = orderId.split('-')[0];
        setBackendReservations(prev => prev.map(r =>
          r.code === code ? { ...r, status: orderId.includes('-DP') ? 'partial' : 'paid' } : r
        ));
      }
    } catch {}
  };

  // simulasi pembayaran sukses (demo tanpa bayar nyata)
  const handleSimulatePayment = async (orderId) => {
    try {
      await simulatePayment(orderId);
      const result = await getTransaction(orderId);
      const status = result?.data?.status ?? result?.status;
      const code = orderId.split('-')[0];
      const isDp = orderId.includes('-DP');
      setBackendReservations(prev => prev.map(r =>
        r.code === code ? {
          ...r,
          status: isDp ? 'partial' : (status === 'paid' || status === 'settlement' || status === 'success' ? 'paid' : r.status),
        } : r
      ));
      await loadReservations();
      showToast('success', 'Pembayaran berhasil (simulasi demo).');
    } catch (e) {
      showToast('error', e.message || 'Gagal simulasi pembayaran');
    }
  };

  // cancel reservasi user (hanya kalau belum bayar)
  const handleCancelReservation = async (id) => {
    try {
      await api.cancelReservation(id);
      await loadReservations();
      showToast('success', 'Reservasi berhasil dibatalkan.');
    } catch (e) {
      showToast('error', e.message || 'Gagal membatalkan reservasi');
    }
  };

  // ADMIN ACTION HANDLERS (backend)
  const loadAdminData = async () => {
    try {
      const dash = await api.getAdminDashboard();
      setAdminStats(dash);
    } catch {}
    try { setAdminBookings(await api.getAdminBookings()); } catch {}
    try { setAdminPayments(await api.getAdminPayments()); } catch {}
    try {
      const cust = await api.getAdminCustomers();
      setAdminCustomers(cust.map(c => ({
        id: c.id, name: c.name, email: c.email, status: c.status,
        bookingCount: c.bookingCount, totalSpent: c.totalSpent,
        bookings: c.bookings,
      })));
    } catch {}
    try {
      const rm = await api.getAdminRooms();
      setAdminRooms(rm.map(r => ({
        id: r.id,
        name: r.nama_ruangan,
        type: r.jenis_ruangan,
        cap: r.kapasitas,
        price: Number(r.harga_per_jam),
        img: getRoomImg(r.nama_ruangan, r.gambar_url),
        privasi: r.tingkat_privasi || 'publik',
        facilities: (r.fasilitas || []).map(f => f.nama_fasilitas || f.nama || '').join(', '),
        status: 'Aktif',
      })));
    } catch {}
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status.toLowerCase());
      setAdminBookings(prev => prev.map(b => b.id === id ? { ...b, status: status.toLowerCase() } : b));
    } catch (e) { alert(e.message); }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.cancelBooking(id);
      setAdminBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e) { alert(e.message); }
  };

  const handleVerifyPayment = async (paymentId) => {
    try {
      await api.verifyPayment(paymentId);
      setAdminPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'paid' } : p));
    } catch (e) { alert(e.message); }
  };

  const handleAddRoom = async (roomData) => {
    try {
      await api.createRoom({
        nama_ruangan: roomData.name,
        jenis_ruangan: roomData.type,
        kapasitas: roomData.cap,
        harga_per_jam: roomData.price,
        deskripsi: roomData.facilities,
        tingkat_privasi: roomData.tingkat_privasi || roomData.privasi || 'publik',
        gambar_url: roomData.gambar_url ?? null,
        gambar_file: roomData.gambar_file ?? null,
      });
      loadAdminData();
    } catch (e) { alert(e.message); }
  };

  const handleUpdateRoom = async (id, roomData) => {
    try {
      await api.updateRoom(id, {
        nama_ruangan: roomData.name,
        jenis_ruangan: roomData.type,
        kapasitas: roomData.cap,
        harga_per_jam: roomData.price,
        deskripsi: roomData.facilities,
        tingkat_privasi: roomData.tingkat_privasi || roomData.privasi || 'publik',
        gambar_url: roomData.gambar_url ?? null,
        gambar_file: roomData.gambar_file ?? null,
      });
      loadAdminData();
    } catch (e) { alert(e.message); }
  };

  const handleToggleRoomStatus = async (id) => {
    try {
      await api.toggleRoomStatus(id);
      loadAdminData();
    } catch (e) { alert(e.message); }
  };

  // customer login (hanya untuk path user)
  const handleCustomerLogin = async () => {
    try {
      const u = await api.getUser();
      // blokir login admin di path user (tidak redirect, tampil error)
      if (u.role === 'admin') {
        throw new Error('Email atau password yang Anda masukkan salah.');
      }
      setUser({ name: u.name || 'Pengguna', email: u.email, phone: u.no_telepon || '', avatar: u.avatar_url || null });
      setAuthed(true);
      setIsAdmin(false);
      setAdminMode(false);
      setPage("dashboard");
      window.history.pushState({}, '', '/');
      api.getRooms().then(setBackendRooms).catch(() => {});
      loadReservations();
    } catch (e) {
      if (e.message === 'email/password salah' || e.message === 'tidak ditemukan user') {
        throw e;
      }
      alert(e.message || 'Login gagal');
    }
  };

  // admin login
  const handleLogin = async (admin) => {
    try {
      if (admin && admin.token) {
        localStorage.setItem(tokenKey(), admin.token);
      }
      const me = await api.adminLogin(admin.email, admin.password).catch(() => null);
      if (me && me.token) {
        localStorage.setItem(tokenKey(), me.token);
        setAdminUser({ name: me.user.name, email: me.user.email });
      }
      setAuthed(true);
      setIsAdmin(true);
      setAdminMode(true);
      goPage("dashboard");
      setAdminPage(window.location.pathname.replace('/admin','').replace(/^\//,'') || 'dashboard');
      window.history.pushState({}, '', '/admin');
      loadAdminData();
    } catch (e) {
      alert(e.message || 'Login admin gagal');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(tokenKey());
    sessionStorage.removeItem('user_page');
    sessionStorage.removeItem('admin_page');
    setAuthed(false);
    setIsAdmin(false);
    if (isAdminPath()) {
      setAdminMode(true);
      window.history.pushState({}, '', '/admin');
    } else {
      setAdminMode(false);
      goPage("dashboard");
    }
  };

  // ganti password user
  const handleChangePassword = async (current_password, password, password_confirmation) => {
    await api.changePassword(current_password, password, password_confirmation);
  };

  // update foto profil user -> DB
  const handleUpdateAvatar = async (avatar) => {
    const res = await api.uploadAvatar(avatar);
    setUser(u => ({ ...(u || {}), avatar: res.avatar_url || avatar }));
    return res;
  };

  // update profil user (nama/email/hp) -> DB
  const handleUpdateUser = async (data) => {
    const updated = await api.updateUser(data);
    const u = updated.user ?? updated;
    setUser({ name: u.name || 'Pengguna', email: u.email, phone: u.no_telepon || '', avatar: u.avatar_url || user?.avatar || null });
    return updated;
  };

  const handlePickRoom = (roomName) => {
    if (!roomName) { goPage("rooms"); return; }
    const found = ROOMS.find(r => r.name.toLowerCase().includes(roomName.toLowerCase()));
    if (found) {
      setRoom(found);
      goPage("date");
    } else {
      goPage("rooms");
    }
  };

  if (booting) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'var(--bg, #FAF8F4)'}}>
        <div style={{width:38,height:38,border:'4px solid #cfe3d4',borderTopColor:'#166534',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      </div>
    );
  }

  if (!authed) {
    if (isAdminPath()) {
      return <AdminLoginScreen onLogin={handleLogin} />;
    }
    if (authPage === 'register') {
      return <RegisterScreen onSwitchToLogin={() => setAuthPage('login')} onRegistered={() => { setAuthPage('login'); }} />;
    }
    return <LoginScreen onLogin={handleCustomerLogin} onSwitchToRegister={() => setAuthPage('register')} />;
  }

  // authed tapi user belum termuat (mis. SSO): jangan render dashboard dengan user null
  if (authed && !isAdmin && !user) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'var(--bg, #FAF8F4)'}}>
        <div style={{width:38,height:38,border:'4px solid #cfe3d4',borderTopColor:'#166534',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      </div>
    );
  }

  // ADMIN ROUTING
  if (adminMode && !isAdmin) {
    return <AdminLoginScreen onLogin={handleLogin} />;
  }
  if (adminMode && isAdmin) {
    let adminContent;
    if (adminPage === "dashboard") {
      adminContent = (
        <AdminDashboard 
          bookings={adminBookings}
          rooms={adminRooms}
          customers={adminCustomers}
          payments={adminPayments}
          stats={adminStats}
          onViewBookingDetail={() => {
            goAdminPage("bookings");
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
      <>
        <div className="app-shell">
          <AdminSidebar 
            page={adminPage}
            setPage={goAdminPage}
            onLogout={handleLogout}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div className="main-area">
            <AdminTopbar 
              user={adminUser}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              setPage={goAdminPage}
              onLogout={handleLogout}
            />
            {adminContent}
          </div>
        </div>
        <ChatbotWidget rooms={ROOMS} reservations={[]} onPickRoom={() => goAdminPage("dashboard")} />
      </>
    );
  }

  // CUSTOMER ROUTING
  // path user: paksa mode customer meski state admin tersisa
  if (!isAdminPath() && (isAdmin || adminMode)) {
    setIsAdmin(false);
    setAdminMode(false);
  }
  if (isAdminPath() && isAdmin && !adminMode) {
    setAdminMode(true);
    return <AdminLoginScreen onLogin={handleLogin} />;
  }
  let content;
  if (page === "dashboard") {
    content = <Dashboard user={user} goToRooms={() => goPage("rooms")} onViewDetail={(r) => {
      if (r && (r.status === "unpaid" || r.status === "pending_payment")) goPage("payment");
      else goPage("myres");
    }} reservations={backendReservations} rooms={backendRooms.map(mapBackendRoom)} showToast={showToast} />;
  } else if (page === "rooms") {
    content = <RoomsPage onSelect={(r) => { setRoom(r); goPage("date"); }} rooms={backendRooms.map(mapBackendRoom)} onGoRecommendation={() => goPage("recommendation")} />;
  } else if (page === "recommendation") {
    content = <RecommendationPage onSelect={(r) => { setRoom(r); goPage("date"); }} onBack={() => goPage("rooms")} />;
  } else if (page === "date") {
    content = <DateTimePage room={room} onBack={() => goPage("rooms")} onNext={(s) => { setSchedule(s); goPage("form"); }} />;
  } else if (page === "form") {
    content = (
      <FormPage
        room={room}
        schedule={schedule}
        onBack={() => goPage("date")}
        onSubmit={async (form) => {
          try {
            const created = await api.createReservation({
              ruangan_id: room.id,
              date: schedule.isoDate || schedule.date,
              time: schedule.time,
              jumlah_orang: 1,
              catatan: form.note,
              nama: form.nama,
              email: form.email,
              hp: form.hp,
            });
            setNotifications(prev => [
              {
                id: Date.now(),
                text: `Reservasi ${room.name} (${created.code}) berhasil dibuat. Silakan selesaikan pembayaran.`,
                time: "Baru saja"
              },
              ...prev
            ]);
            await loadReservations();
            showToast('success', 'Reservasi berhasil dibuat. Silakan selesaikan pembayaran.');
            goPage("done");
          } catch (e) {
            showToast('error', e.message || 'Gagal membuat reservasi');
          }
        }}
      />
    );
  } else if (page === "done") {
    content = <PaymentDone onBackHome={() => goPage("dashboard")} />;
  } else if (page === "myres") {
    content = <MyReservationsPage reservations={backendReservations} onPay={() => goPage("payment")} onCancel={handleCancelReservation} showToast={showToast} />;
  } else if (page === "payment") {
    content = (
      <PaymentPage
        reservations={backendReservations}
        onPaywuzPayment={handlePaywuzPayment}
        onCheckPayment={handleCheckPayment}
        onSimulatePayment={handleSimulatePayment}
      />
    );
  } else if (page === "history") {
    content = <HistoryPage history={backendReservations.filter(r => r.status === "completed" || r.status === "cancelled")} />;
  } else if (page === "profile") {
    content = <ProfilePage user={user} onUpdateUser={handleUpdateUser} onChangePassword={handleChangePassword} onUpdateAvatar={handleUpdateAvatar} />;
  }

  return (
    <div className="app-shell">
      <Sidebar 
        page={page} 
        setPage={goPage} 
        onLogout={handleLogout} 
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
      <ChatbotWidget rooms={ROOMS} reservations={reservations} onPickRoom={handlePickRoom} />
      {toast && (
        <div className={"toast toast-" + toast.type}>
          {toast.type === 'success' ? '✓ ' : '⚠ '}{toast.msg}
        </div>
      )}
    </div>
  );
}

