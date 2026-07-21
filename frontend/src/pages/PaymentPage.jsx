import React, { useState, useEffect, useRef } from 'react';
import { rupiah } from '../constants';

const ADMIN_FEE = 2500;

const COL = {
  primary: '#166534',
  primary700: '#134d28',
  success: '#16A34A',
  warn: '#F59E0B',
  bg: '#FAF8F4',
  border: '#E5E7EB',
  ink: '#1B231E',
  inkSoft: '#6B7280',
};
const SHADOW = '0 14px 40px -18px rgba(22, 101, 52, 0.22)';
const SHADOW_SM = '0 6px 18px -10px rgba(22, 101, 52, 0.18)';

/* ---------- React-only helpers (no CSS) ---------- */
function useHover() {
  const [h, setH] = useState(false);
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }];
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

/* ---------- Inline styled primitives ---------- */
function Panel({ style, children }) {
  const [h, bind] = useHover();
  return (
    <div
      {...bind}
      style={{
        background: '#fff',
        border: `1px solid ${COL.border}`,
        borderRadius: 20,
        padding: 26,
        boxShadow: h ? '0 18px 46px -16px rgba(22,101,52,0.26)' : SHADOW,
        transition: 'transform .2s ease, box-shadow .2s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ onClick, disabled, children, style }) {
  const [h, bind] = useHover();
  return (
    <button
      {...bind}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: disabled ? '#9bb3a5' : h ? COL.primary700 : COL.primary,
        color: '#fff',
        border: 'none',
        borderRadius: 16,
        padding: '15px 20px',
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: '0 12px 26px -12px rgba(22,101,52,0.7)',
        transition: 'background .2s ease, transform .15s ease, box-shadow .2s ease',
        transform: h && !disabled ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ onClick, children, style }) {
  const [h, bind] = useHover();
  return (
    <button
      {...bind}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: '#fff',
        color: COL.primary,
        border: `1.5px solid ${COL.primary}`,
        borderRadius: 16,
        padding: '14px 20px',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'background .2s ease, transform .15s ease',
        transform: h ? 'translateY(-1px)' : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ onClick, children }) {
  const [h, bind] = useHover();
  return (
    <button
      {...bind}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: '#fff',
        color: COL.inkSoft,
        border: `1px solid ${COL.border}`,
        borderRadius: 12,
        padding: '10px 16px',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background .2s ease, color .2s ease, border-color .2s ease',
        ...(h ? { background: '#F1F8F3', color: COL.primary, borderColor: '#cfe3d4' } : {}),
      }}
    >
      {children}
    </button>
  );
}

function AmountOpt({ active, onClick, title, price }) {
  const [h, bind] = useHover();
  return (
    <button
      {...bind}
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-start',
        textAlign: 'left',
        background: '#fff',
        border: `1.5px solid ${active ? COL.primary : COL.border}`,
        borderRadius: 14,
        padding: '14px 16px',
        cursor: 'pointer',
        boxShadow: active ? 'inset 0 0 0 1px ' + COL.primary : 'none',
        transition: 'border-color .2s ease, background .2s ease, box-shadow .2s ease',
        ...(h && !active ? { borderColor: COL.success, background: '#F4FBF6' } : {}),
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color: COL.ink }}>{title}</span>
      <span style={{ fontSize: 16, fontWeight: 800, color: COL.primary }}>{price}</span>
    </button>
  );
}

/* ---------- Inline icons ---------- */
const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const IconShield = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconClock = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconView = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconInvoice = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
);
const IconRefresh = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);
const IconWallet = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M21 7H7a2 2 0 0 0 0 4h14v-4z"/><circle cx="16" cy="9" r="1"/></svg>
);
const IconAlert = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const IconSpinner = ({ size = 26 }) => (
  <svg ref={null} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

/* ---------- Premium payment illustration (no QR) ---------- */
const PaymentArt = () => (
  <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ppCard" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#166534" />
        <stop offset="1" stopColor="#0f4a25" />
      </linearGradient>
      <linearGradient id="ppGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#16A34A" stopOpacity="0.18" />
        <stop offset="1" stopColor="#16A34A" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="150" cy="60" r="78" fill="url(#ppGlow)" />
    <rect x="38" y="34" width="118" height="76" rx="14" fill="url(#ppCard)" transform="rotate(-8 97 72)" />
    <rect x="50" y="28" width="118" height="76" rx="14" fill="#166534" transform="rotate(-8 109 66)" />
    <rect x="62" y="22" width="118" height="76" rx="14" fill="url(#ppCard)" />
    <rect x="74" y="36" width="40" height="9" rx="4.5" fill="#ffffff" opacity="0.55" />
    <rect x="74" y="52" width="74" height="7" rx="3.5" fill="#ffffff" opacity="0.3" />
    <rect x="74" y="64" width="54" height="7" rx="3.5" fill="#ffffff" opacity="0.3" />
    <circle cx="160" cy="78" r="15" fill="#16A34A" />
    <path d="M154 78l4 4 8-8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="40" cy="118" r="9" fill="#F59E0B" opacity="0.9" />
    <circle cx="186" cy="40" r="6" fill="#16A34A" opacity="0.85" />
  </svg>
);

function calcDuration(time) {
  const m = String(time || '').match(/(\d+)\.(\d+)\s*-\s*(\d+)\.(\d+)/);
  if (!m) return '-';
  const start = (+m[1]) * 60 + (+m[2]);
  const end = (+m[3]) * 60 + (+m[4]);
  const h = (end - start) / 60;
  if (!h || h <= 0) return '-';
  return `${h} Jam`;
}

/* ---------- Shared text styles ---------- */
const cardTitle = { fontSize: 22, fontWeight: 600, margin: '0 0 8px', letterSpacing: '-0.01em' };
const cardDesc = { fontSize: 15, lineHeight: 1.6, color: COL.inkSoft, margin: '0 0 6px' };
const badgeBase = { fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999, whiteSpace: 'nowrap' };
const badgeWarn = { ...badgeBase, background: '#FEF3DD', color: '#B26A00' };
const badgeOk = { ...badgeBase, background: '#E7F6EC', color: COL.success };

export default function PaymentPage({
  reservations,
  onPaywuzPayment,
  onCheckPayment,
}) {
  const unpaid = reservations.filter(r =>
    r.status === "unpaid" || r.status === "pending_payment" || r.status === "partial"
  );
  const [selectedRes, setSelectedRes] = useState(null);
  const [paymentType, setPaymentType] = useState("full");
  const [paywuzResult, setPaywuzResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const pollRef = useRef(null);
  const spinRef = useRef(null);
  const [mounted, setMounted] = useState(false);


  const isNarrow = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // restore halaman pembayaran QRIS saat refresh (jangan balik ke daftar)
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    if (!reservations || reservations.length === 0) return;
    restoredRef.current = true;
    try {
      const raw = sessionStorage.getItem('paying');
      if (!raw) return;
      const pay = JSON.parse(raw);
      if (Date.now() > pay.expiry) { sessionStorage.removeItem('paying'); return; }
      const match = reservations.find(r => r.paywuzTrxId === pay.orderId);
      if (match) {
        setSelectedRes(match);
        setExpiry(pay.expiry);
      } else {
        sessionStorage.removeItem('paying');
      }
    } catch {}
  }, [reservations]);

  useEffect(() => { setMounted(true); }, []);

  /* Spinner via Web Animations API (no CSS keyframes) */
  useEffect(() => {
    if (spinRef.current) {
      spinRef.current.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        { duration: 800, iterations: Infinity }
      );
    }
  }, [loading]);

  const resId = selectedRes?.id;
  const trxId = selectedRes?.paywuzTrxId;
  const resStatus = selectedRes?.status;

  /* polling for automatic confirmation */
  useEffect(() => {
    if (!trxId || resStatus === "settlement" || resStatus === "success" || resStatus === "partial") {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        const result = await onCheckPayment(trxId);
        const st = result?.data?.status ?? result?.status;
        if (result && (st === 'settlement' || st === 'success' || st === 'paid')) {
          setPaymentStatus({ type: 'success', data: result });
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch {
      }
    }, 3000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [resId, trxId, resStatus, onCheckPayment]);

  useEffect(() => {
    if (selectedRes) {
      const updated = reservations.find(r => r.id === selectedRes.id);
      if (updated && (updated.status !== selectedRes.status || updated.paywuzTrxId !== selectedRes.paywuzTrxId)) {
        setSelectedRes(updated);
        if (updated.status === 'partial' || updated.status === 'paid' || updated.status === 'settlement') {
          setPaymentStatus({ type: 'success', data: { status: 'success' } });
        }
      }
    }
  }, [reservations]);

  /* ---------- Countdown ---------- */
  const [expiry, setExpiry] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (selectedRes) {
      if (expiry === null) setExpiry(Date.now() + 15 * 60 * 1000);
    } else {
      setExpiry(null);
    }
  }, [selectedRes?.id]);

  useEffect(() => {
    if (!expiry) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiry]);

  const remainingMs = expiry ? Math.max(0, expiry - now) : 0;
  const expired = remainingMs <= 0;
  const mm = String(Math.floor(remainingMs / 60000)).padStart(2, '0');
  const ss = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, '0');

  /* ---------- helpers ---------- */
  const handlePay = (res) => {
    setSelectedRes(res);
    setPaymentType("full");
    setPaywuzResult(null);
    setPaymentStatus(null);
  };

  const openPaywuzz = (result) => {
    if (result?.paymentUrl) {
      window.open(result.paymentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCreatePayment = async () => {
    if (!selectedRes) return;
    setLoading(true);
    setPaymentStatus(null);
    try {
      const result = await onPaywuzPayment(selectedRes.id, paymentType);
      setPaywuzResult(result);
      const updated = reservations.find(r => r.id === selectedRes.id);
      if (updated) setSelectedRes(updated);
      const oid = updated?.paywuzTrxId || result?.orderId;
      if (oid) sessionStorage.setItem('paying', JSON.stringify({ orderId: oid, expiry: Date.now() + 15*60*1000 }));
      openPaywuzz(result);
    } catch (err) {
      setPaymentStatus({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePayRemainingNow = async () => {
    if (!selectedRes) return;
    setLoading(true);
    try {
      const result = await onPaywuzPayment(selectedRes.id, 'remaining');
      setPaywuzResult(result);
      const updated = reservations.find(r => r.id === selectedRes.id);
      if (updated) setSelectedRes(updated);
      const oid = updated?.paywuzTrxId || result?.orderId;
      if (oid) sessionStorage.setItem('paying', JSON.stringify({ orderId: oid, expiry: Date.now() + 15*60*1000 }));
      openPaywuzz(result);
    } catch (err) {
      setPaymentStatus({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem('paying');
    setSelectedRes(null);
    setPaywuzResult(null);
    setPaymentStatus(null);
    setExpiry(null);
  };

  const handleSimulate = async () => {
    const orderId = selectedRes?.paywuzTrxId || paywuzResult?.orderId;
    if (!orderId) return;
    setLoading(true);
    try {
      if (onSimulatePayment) await onSimulatePayment(orderId);
      setPaymentStatus({ type: 'success', data: { status: 'success' } });
    } catch (err) {
      setPaymentStatus({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!selectedRes) return;
    const r = selectedRes;
    const total = r.room.price + ADMIN_FEE;
    const lines = [
      'RUANGKITA — INVOICE PEMBAYARAN',
      '================================',
      `Kode Reservasi : ${r.code}`,
      `Ruangan        : ${r.room.name}`,
      `Tanggal        : ${r.date}`,
      `Waktu          : ${r.time}`,
      `Metode         : QRIS (Paywuzz Secure Payment)`,
      `Status         : ${isSuccess ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}`,
      '--------------------------------',
      `Harga Ruangan  : ${rupiah(r.room.price)}`,
      `Admin Fee      : ${rupiah(ADMIN_FEE)}`,
      `TOTAL BAYAR    : ${rupiah(total)}`,
      '================================',
      'Terima kasih telah menggunakan RuangKita.',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${r.code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ---------- responsive-derived values ---------- */
  const gridCols = isNarrow ? '1fr' : '1.85fr 1fr';
  const containerPad = isMobile ? '28px 18px 44px' : '40px 32px 56px';
  const titleSize = isMobile ? 28 : 36;
  const cardPad = isMobile ? 20 : 26;

  /* ---------- no selection: bill list ---------- */
  if (!selectedRes) {
    return (
      <div style={{ background: COL.bg, minHeight: 'calc(100vh - 72px)', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: COL.ink, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(6px)', transition: 'opacity .25s ease, transform .25s ease' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: containerPad }}>
          <header style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: titleSize, fontWeight: 700, lineHeight: 1.15, margin: '0 0 8px', letterSpacing: '-0.01em' }}>Pembayaran</h1>
            <p style={{ margin: 0, fontSize: 16, color: COL.inkSoft, maxWidth: 640 }}>Selesaikan pembayaran reservasi Anda dengan aman melalui Paywuzz QRIS.</p>
          </header>

          {unpaid.length === 0 ? (
            <div style={{ textAlign: 'center', background: '#fff', border: `1px solid ${COL.border}`, borderRadius: 20, padding: '56px 28px', boxShadow: SHADOW_SM }}>
              <div style={{ width: 64, height: 64, margin: '0 auto 18px', borderRadius: 18, background: '#EEF7F0', color: COL.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconWallet /></div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>Tidak ada tagihan aktif</h3>
              <p style={{ fontSize: 14, color: COL.inkSoft, margin: 0 }}>Semua reservasi Anda sudah lunas. Nikmati ruangan Anda!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {unpaid.map(res => {
                const dpPaid = res.status === "partial";
                const due = dpPaid ? (res.room.price - res.dpAmount) : res.room.price;
                return (
                  <BillRow key={res.id} res={res} dpPaid={dpPaid} due={due + ADMIN_FEE} onPay={() => handlePay(res)} isMobile={isMobile} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------- derived values (selected reservation) ---------- */
  const totalPrice = selectedRes?.room.price || 0;
  const dpAmount = Math.round(totalPrice * 0.5);
  const remainingAmount = totalPrice - dpAmount;
  const isPartial = resStatus === "partial";
  const isSuccess = (paymentStatus?.type === 'success') || resStatus === 'paid' || resStatus === 'settlement';
  const isPending = !isSuccess && (paywuzResult || resStatus === 'pending_payment');
  const showExpired = expired && !isSuccess && resStatus !== 'partial';
  const payAmount = isPartial ? remainingAmount : (paymentType === 'dp' ? dpAmount : totalPrice);
  const displayTotal = payAmount + ADMIN_FEE;

  const alertBox = {
    display: 'flex', alignItems: 'center', gap: 16,
    background: 'linear-gradient(180deg,#FEF6E7,#FDF1D6)',
    border: '1px solid #F6E2B3', borderRadius: 16, padding: '16px 20px', boxShadow: SHADOW_SM,
  };
  const infoRow = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 14, color: COL.inkSoft, padding: '12px 0', borderBottom: `1px dashed ${COL.border}`,
  };

  return (
    <div style={{ background: COL.bg, minHeight: 'calc(100vh - 72px)', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: COL.ink, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(6px)', transition: 'opacity .25s ease, transform .25s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: containerPad }}>
        <header style={{ marginBottom: 28, display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
          <div>
            <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: titleSize, fontWeight: 700, lineHeight: 1.15, margin: '0 0 8px', letterSpacing: '-0.01em' }}>Pembayaran</h1>
            <p style={{ margin: 0, fontSize: 16, color: COL.inkSoft, maxWidth: 640 }}>Selesaikan pembayaran reservasi Anda dengan aman melalui Paywuzz QRIS.</p>
          </div>
          <GhostButton onClick={handleReset}><IconRefresh /> Kembali ke daftar</GhostButton>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 28, alignItems: 'start' }}>
          {/* ---------- LEFT 65% ---------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {isSuccess ? (
              <Panel style={{ textAlign: 'center', background: 'linear-gradient(180deg,#FFFFFF,#F3FBF5)', borderColor: '#CDEBD6', padding: '38px 28px' }}>
                <div style={{ width: 64, height: 64, margin: '0 auto 18px', borderRadius: '50%', background: COL.success, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 26px -10px rgba(22,163,74,0.6)' }}><IconCheck size={28} /></div>
                <h2 style={cardTitle}>Pembayaran Berhasil</h2>
                <p style={cardDesc}>Reservasi Anda telah berhasil dikonfirmasi.</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 160 }}><PrimaryButton onClick={handleReset}><IconView /> Lihat Reservasi</PrimaryButton></div>
                  <div style={{ flex: 1, minWidth: 160 }}><OutlineButton onClick={handleDownloadInvoice}><IconInvoice /> Download Invoice</OutlineButton></div>
                </div>
              </Panel>
            ) : showExpired ? (
              <Panel style={{ textAlign: 'center', background: '#FFF5F4', borderColor: '#F6CFCA', padding: '38px 28px' }}>
                <div style={{ width: 60, height: 60, margin: '0 auto 18px', borderRadius: '50%', background: '#EF4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 26px -10px rgba(239,68,68,0.55)' }}><IconAlert size={26} /></div>
                <h2 style={cardTitle}>Pembayaran Kadaluarsa</h2>
                <p style={cardDesc}>Waktu pembayaran telah habis.</p>
                <PrimaryButton onClick={handleReset}><IconRefresh /> Buat Pembayaran Baru</PrimaryButton>
              </Panel>
            ) : isPending ? (
              <>
                <div style={alertBox}>
                  <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: COL.warn, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px -8px rgba(245,158,11,0.7)' }}><IconClock /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#92591a' }}>Selesaikan pembayaran sebelum waktu habis</div>
                    <div style={{ fontSize: 13, color: '#a9742c', marginTop: 2 }}>Sisa waktu pembayaran Anda</div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#92591a', fontVariantNumeric: 'tabular-nums', letterSpacing: 1, background: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: 12, border: '1px solid #f0d49a' }}>{mm}:{ss}</div>
                </div>

                <Panel style={{ padding: cardPad }}>
                  <h3 style={cardTitle}>Pembayaran QRIS</h3>
                  <p style={cardDesc}>Pembayaran reservasi dilakukan melalui Paywuzz Secure Payment.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 22px' }}><PaymentArt /></div>
                  <a
                    href={paywuzResult?.paymentUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!paywuzResult?.paymentUrl) e.preventDefault(); }}
                    style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: COL.primary, color: '#fff', borderRadius: 16, padding: '15px 20px', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 12px 26px -12px rgba(22,101,52,0.7)' }}
                  >
                    Buka Halaman Pembayaran <IconArrow />
                  </a>
                  <p style={{ textAlign: 'center', fontSize: 13, color: COL.inkSoft, margin: '16px 0 0', lineHeight: 1.55 }}>
                    Anda akan diarahkan ke halaman pembayaran Paywuzz yang aman menggunakan QRIS.
                  </p>
                </Panel>
              </>
            ) : (
              <>
                <div style={alertBox}>
                  <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: COL.warn, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px -8px rgba(245,158,11,0.7)' }}><IconClock /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#92591a' }}>Selesaikan pembayaran sebelum waktu habis</div>
                    <div style={{ fontSize: 13, color: '#a9742c', marginTop: 2 }}>Sisa waktu pembayaran Anda</div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#92591a', fontVariantNumeric: 'tabular-nums', letterSpacing: 1, background: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: 12, border: '1px solid #f0d49a' }}>{mm}:{ss}</div>
                </div>

                <Panel style={{ padding: cardPad }}>
                  <h3 style={cardTitle}>Pembayaran QRIS</h3>
                  <p style={cardDesc}>
                    Pembayaran reservasi dilakukan melalui Paywuzz Secure Payment.
                    Klik tombol di bawah untuk melanjutkan pembayaran.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 22px' }}><PaymentArt /></div>

                  {!isPartial && (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, margin: '20px 0' }}>
                      <AmountOpt active={paymentType === 'full'} onClick={() => setPaymentType('full')} title="Bayar Lunas" price={rupiah(totalPrice + ADMIN_FEE)} />
                      <AmountOpt active={paymentType === 'dp'} onClick={() => setPaymentType('dp')} title="Bayar DP 50%" price={rupiah(dpAmount + ADMIN_FEE)} />
                    </div>
                  )}

                  <PrimaryButton onClick={isPartial ? handlePayRemainingNow : handleCreatePayment} disabled={loading}>
                    {loading ? 'Memproses...' : 'Lanjutkan Pembayaran'} {!loading && <IconArrow />}
                  </PrimaryButton>
                  <p style={{ textAlign: 'center', fontSize: 13, color: COL.inkSoft, margin: '16px 0 0', lineHeight: 1.55 }}>
                    Anda akan diarahkan ke halaman pembayaran Paywuzz yang aman menggunakan QRIS.
                  </p>
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '10px 12px', background: '#EEF2FF', border: '1px dashed #C7D2FE', borderRadius: 12, fontSize: 12, color: '#4338CA' }}>
                      Demo: scan QRIS dengan aplikasi e-wallet, atau klik tombol di bawah untuk simulasi pembayaran berhasil.
                    </div>
                    {selectedRes?.paywuzTrxId && (
                      <button
                        onClick={handleSimulate}
                        disabled={loading}
                        style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#16A34A', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 18px', fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', boxShadow: '0 10px 22px -10px rgba(22,163,74,0.7)' }}
                      >
                        {loading ? 'Memproses...' : 'Simulasi Pembayaran Berhasil'}
                      </button>
                    )}
                  </div>
                  {paymentStatus?.error && (
                    <div style={{ marginTop: 14, background: '#FBE9E7', color: '#C0392B', border: '1px solid #f3c9c3', borderRadius: 12, padding: '11px 14px', fontSize: 13, textAlign: 'center' }}>
                      {paymentStatus.error}
                    </div>
                  )}
                </Panel>
              </>
            )}

            {/* Payment Information */}
            <Panel style={{ padding: cardPad }}>
              <h3 style={cardTitle}>Informasi Pembayaran</h3>
              <div style={infoRow}><span>Metode Pembayaran</span><b style={{ color: COL.ink, fontWeight: 700, fontSize: 15 }}>QRIS</b></div>
              <div style={{ ...infoRow, borderBottom: 'none' }}>
                <span>Status</span>
                <b style={isSuccess ? badgeOk : isPartial ? { ...badgeOk, background: '#E7F6EC', color: COL.success } : badgeWarn}>
                  {isSuccess ? '🟢 Berhasil' : isPartial ? '🟡 DP Dibayar' : '🟡 Menunggu Pembayaran'}
                </b>
              </div>
              <div style={{ ...infoRow, borderBottom: 'none' }}>
                <span>Total Pembayaran</span>
                <b style={{ color: COL.ink, fontWeight: 700, fontSize: 15 }}>{rupiah(displayTotal)}</b>
              </div>
            </Panel>

            {/* Security card */}
            <Panel style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: 'linear-gradient(135deg,#166534,#134d28)', border: 'none', color: '#fff', padding: cardPad }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: 'rgba(255,255,255,0.14)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconShield /></div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>Pembayaran Aman</h4>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, color: 'rgba(255,255,255,0.86)' }}>
                  Transaksi diproses menggunakan Paywuzz Secure Payment. Seluruh pembayaran
                  dilakukan melalui QRIS dan terenkripsi dengan aman.
                </p>
              </div>
            </Panel>

            {/* Payment status card */}
            {!isSuccess && (
              <Panel style={{ background: '#FFFBF2', borderColor: '#F6E7C8', padding: cardPad }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#92591a' }}>Menunggu Pembayaran</h4>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#a9742c', margin: '0 0 14px' }}>
                  Kami akan memverifikasi pembayaran Anda secara otomatis setelah transaksi berhasil.
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Status diperbarui otomatis', 'Tidak perlu refresh halaman', 'Jangan tutup halaman sebelum pembayaran selesai'].map((t, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: COL.ink }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: COL.success, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconCheck /></span>
                      {t}
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </div>

          {/* ---------- RIGHT 35% ---------- */}
          <aside style={{ position: isNarrow ? 'static' : 'sticky', top: 24 }}>
            <Panel style={{ padding: cardPad }}>
              <h3 style={cardTitle}>Ringkasan Reservasi</h3>
              <div style={{ width: '100%', height: 150, borderRadius: 14, overflow: 'hidden', marginBottom: 16, border: `1px solid ${COL.border}` }}>
                <img src={selectedRes.room.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COL.ink }}>{selectedRes.room.name}</div>
              <div style={{ display: 'inline-block', marginTop: 4, fontSize: 13, fontWeight: 700, color: COL.primary, background: '#EEF7F0', padding: '3px 10px', borderRadius: 8 }}>{selectedRes.code}</div>

              <div style={infoRow}><span>Tanggal Reservasi</span><b style={{ color: COL.ink, fontWeight: 700 }}>{selectedRes.date}</b></div>
              <div style={infoRow}><span>Waktu</span><b style={{ color: COL.ink, fontWeight: 700 }}>{selectedRes.time}</b></div>
              <div style={infoRow}><span>Durasi</span><b style={{ color: COL.ink, fontWeight: 700 }}>{calcDuration(selectedRes.time)}</b></div>
              <div style={infoRow}><span>Harga Ruangan</span><b style={{ color: COL.ink, fontWeight: 700 }}>{rupiah(totalPrice)}</b></div>
              {isPartial && (
                <div style={{ ...infoRow, borderBottom: `1px dashed ${COL.border}` }}>
                  <span>DP Dibayar</span><b style={{ color: COL.success, fontWeight: 700 }}>- {rupiah(selectedRes.dpAmount)}</b>
                </div>
              )}
              {paymentType === 'dp' && !isPartial && (
                <div style={{ ...infoRow, borderBottom: `1px dashed ${COL.border}` }}>
                  <span>DP (50%)</span><b style={{ color: COL.success, fontWeight: 700 }}>{rupiah(dpAmount)}</b>
                </div>
              )}
              <div style={infoRow}><span>Admin Fee</span><b style={{ color: COL.ink, fontWeight: 700 }}>{rupiah(ADMIN_FEE)}</b></div>

              <div style={{ height: 0, borderTop: `2px solid ${COL.border}`, margin: '16px 0 14px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: COL.inkSoft, letterSpacing: '.03em' }}>TOTAL PEMBAYARAN</span>
                <b style={{ fontSize: 30, fontWeight: 800, color: COL.primary, letterSpacing: '-0.01em' }}>{rupiah(displayTotal)}</b>
              </div>
            </Panel>
          </aside>
        </div>
      </div>

      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,40,28,0.42)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, boxShadow: '0 24px 60px -20px rgba(0,0,0,0.4)', color: COL.primary }}>
            <span ref={spinRef} style={{ display: 'inline-flex' }}><IconSpinner size={26} /></span>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COL.ink }}>Mengalihkan ke halaman pembayaran Paywuzz...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Bill row (list, no selection) ---------- */
function BillRow({ res, dpPaid, due, onPay, isMobile }) {
  const [h, bind] = useHover();
  return (
    <div
      {...bind}
      style={{
        display: 'flex', alignItems: 'center', gap: 18, background: '#fff',
        border: `1px solid ${COL.border}`, borderRadius: 20, padding: '18px 22px',
        boxShadow: SHADOW_SM, flexWrap: isMobile ? 'wrap' : 'nowrap',
        transform: h ? 'translateY(-3px)' : 'none', boxShadow: h ? SHADOW : SHADOW_SM,
        transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
        ...(h ? { borderColor: '#d6e6da' } : {}),
      }}
    >
      <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
        <img src={res.room.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COL.primary }}>{res.code}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: COL.ink, margin: '2px 0' }}>{res.room.name}</div>
        <div style={{ fontSize: 13, color: COL.inkSoft }}>
          {res.date} · {res.time}
          {dpPaid && <span style={{ ...badgeOk, marginLeft: 8, display: 'inline-block' }}>DP Dibayar</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0, ...(isMobile ? { width: '100%', justifyContent: 'space-between' } : {}) }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: 12, color: COL.inkSoft }}>Tagihan</span>
          <b style={{ fontSize: 17, fontWeight: 800, color: COL.ink }}>{rupiah(due)}</b>
        </div>
        <button
          onClick={onPay}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: COL.primary, color: '#fff', border: 'none', borderRadius: 16, padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 12px 26px -12px rgba(22,101,52,0.7)' }}
        >
          {dpPaid ? 'Lunasi Sekarang' : 'Lanjutkan Pembayaran'} <IconArrow />
        </button>
      </div>
    </div>
  );
}
