import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBooking, cancelBooking } from "../Redux/bookingSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "../api";
import {
  ChevronLeft, Ticket, MapPin, Clock, Star,
  Armchair, CreditCard, XCircle, CheckCircle2,
  AlertCircle, Calendar, Loader2,
} from "lucide-react";

/* ─── Load Razorpay script once ──────────────────────────────── */
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true); // already loaded
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ─── Ambient ─────────────────────────────────────────────────── */
const Ambient = () => (
  <>
    <div aria-hidden style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(139,92,246,.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,.03) 1px, transparent 1px)`,
      backgroundSize: "52px 52px",
    }} />
    {[
      { top: "-10%", left: "-5%",  w: 500, c: "rgba(124,58,237,.08)" },
      { bottom: "5%", right: "-5%", w: 380, c: "rgba(79,70,229,.07)" },
    ].map((o, i) => (
      <motion.div key={i} aria-hidden
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed", borderRadius: "50%", width: o.w, height: o.w,
          background: o.c, filter: "blur(80px)",
          top: o.top, left: o.left, right: o.right, bottom: o.bottom,
          pointerEvents: "none", zIndex: 0,
        }}
      />
    ))}
  </>
);

/* ─── Status badge ────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const cfg = {
    pending:   { color: "#fde68a", bg: "rgba(251,191,36,.1)",  border: "rgba(251,191,36,.25)",  icon: AlertCircle,  label: "Payment Pending" },
    confirmed: { color: "#4ade80", bg: "rgba(74,222,128,.1)",  border: "rgba(74,222,128,.25)",  icon: CheckCircle2, label: "Confirmed" },
    cancelled: { color: "#f87171", bg: "rgba(248,113,113,.1)", border: "rgba(248,113,113,.25)", icon: XCircle,      label: "Cancelled" },
  }[status] ?? {};
  const Icon = cfg.icon;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 14px", borderRadius: 99,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, fontSize: 11, fontWeight: 800, letterSpacing: ".08em",
    }}>
      {Icon && <Icon size={12} />} {cfg.label}
    </div>
  );
};

/* ─── Seat chip ───────────────────────────────────────────────── */
const SeatChip = ({ seat }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 12,
    background: "rgba(139,92,246,.12)", border: "1px solid rgba(139,92,246,.25)",
    fontSize: 13, fontWeight: 800, color: "#c4b5fd",
  }}>
    <Armchair size={13} />
    {seat.seatNumber ?? `${seat.row}-${seat.col}`}
  </div>
);

/* ─── Info row ────────────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,.05)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8,
      color: "rgba(255,255,255,.35)", fontSize: 13 }}>
      <Icon size={14} color="#7c3aed" /> {label}
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.75)" }}>{value}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Checkout = () => {
  const { bookingId } = useParams();
  const dispatch      = useDispatch();
  const navigate      = useNavigate();

  const [paying, setPaying] = useState(false);

  const { current: booking, loading, error } = useSelector((s) => s.bookings);
  const movies = useSelector((s) => s.movies?.movies ?? []);

  useEffect(() => {
    if (bookingId) dispatch(fetchBooking(bookingId));
  }, [dispatch, bookingId]);

  const show  = booking?.show;
  const seats = Array.isArray(booking?.seats) ? booking.seats : [];
  const movie = show ? movies.find((m) => String(m._id) === String(show.movie)) : null;

  /* ── Razorpay payment handler ─────────────────────────────── */
  const handlePayment = async () => {
    setPaying(true);
    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Check your internet connection.");
        setPaying(false);
        return;
      }

      // 2. Create Razorpay order on backend
      const orderData = await apiRequest(
        `/bookings/${bookingId}/create-payment-order`, "POST"
      );

      // 3. Open Razorpay checkout modal
      const options = {
        key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:   orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,

        name:        "CinemaBooking",
        description: `${seats.length} seat${seats.length > 1 ? "s" : ""} — ${show?.theatre ?? ""}`,
        image:       movie?.poster ?? "",

        prefill: {
          name:  booking?.user?.name  ?? "",
          email: booking?.user?.email ?? "",
        },

        theme: { color: "#7c3aed" },

        // 4. On successful payment
        handler: async (response) => {
          try {
            const verify = await apiRequest(
              `/bookings/${bookingId}/verify-payment`, "POST",
              {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }
            );

            // Refresh booking in Redux
            dispatch(fetchBooking(bookingId));

            toast.success("Payment successful! Enjoy the show 🎬", {
              style: {
                background: "#1a1a2e", color: "#4ade80",
                border: "1px solid rgba(74,222,128,.3)", borderRadius: 12,
              },
            });
          } catch (err) {
            toast.error("Payment done but verification failed. Contact support.");
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
            toast("Payment cancelled", {
              icon: "↩️",
              style: {
                background: "#1a1a2e", color: "rgba(255,255,255,.6)",
                border: "1px solid rgba(255,255,255,.1)", borderRadius: 12,
              },
            });
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.message ?? "Payment failed");
      setPaying(false);
    }
  };

  /* ── Cancel handler ───────────────────────────────────────── */
  const handleCancel = async () => {
    if (!window.confirm("Cancel this booking? Seats will be released.")) return;
    const result = await dispatch(cancelBooking(bookingId));
    if (cancelBooking.fulfilled.match(result)) {
      toast("Booking cancelled — seats released", {
        icon: "↩️",
        style: { background: "#1a1a2e", color: "rgba(255,255,255,.6)", borderRadius: 12 },
      });
    } else {
      toast.error(result.payload ?? "Cancel failed");
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", background: "#080810", gap: 14 }}>
      <motion.div animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        style={{ width: 44, height: 44,
          border: "3px solid rgba(139,92,246,.15)", borderTop: "3px solid #7c3aed",
          borderRadius: "50%" }}
      />
      <p style={{ color: "rgba(255,255,255,.18)", fontSize: 9,
        letterSpacing: ".25em", textTransform: "uppercase",
        fontWeight: 700, fontFamily: "monospace" }}>
        Loading Booking
      </p>
    </div>
  );

  /* ── Error / Not found ── */
  if (error || !booking) return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      fontFamily: "inherit" }}>
      <XCircle size={48} color="rgba(248,113,113,.4)" />
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 14 }}>
        {error ?? "Booking not found"}
      </p>
      <button onClick={() => navigate("/")} style={{
        padding: "10px 24px", borderRadius: 99,
        background: "rgba(124,58,237,.2)", border: "1px solid rgba(124,58,237,.3)",
        color: "#a78bfa", fontWeight: 800, fontSize: 12,
        cursor: "pointer", fontFamily: "inherit",
      }}>
        Go Home
      </button>
    </div>
  );

  /* ── Main ── */
  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff",
      fontFamily: "'DM Sans','Outfit',system-ui,sans-serif",
      position: "relative", overflowX: "hidden" }}>
      <Toaster position="top-center" />
      <Ambient />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640,
        margin: "0 auto", padding: "36px 24px 100px" }}>

        {/* Top nav */}
        <div style={{ display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 36 }}>
          <motion.button whileHover={{ x: -3 }} onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 99,
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)",
              color: "rgba(255,255,255,.5)", fontWeight: 800, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit",
              letterSpacing: ".06em", textTransform: "uppercase" }}>
            <ChevronLeft size={14} /> Back
          </motion.button>
          <StatusBadge status={booking.status} />
        </div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".22em",
            textTransform: "uppercase", color: "rgba(139,92,246,.7)", marginBottom: 8 }}>
            Booking Summary
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-.04em", margin: 0,
            background: "linear-gradient(135deg, #fff 50%, rgba(255,255,255,.4))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {movie?.title ?? show?.theatre ?? "Your Booking"}
          </h1>
        </motion.div>

        {/* Movie + show info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .1 }}
          style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 24, padding: 24, marginBottom: 16,
            display: "flex", gap: 20, alignItems: "flex-start" }}>
          {movie?.poster && (
            <img src={movie.poster} alt={movie.title}
              style={{ width: 76, height: 108, objectFit: "cover", borderRadius: 14,
                boxShadow: "0 12px 32px rgba(0,0,0,.5)", flexShrink: 0,
                border: "1px solid rgba(255,255,255,.08)" }}
            />
          )}
          <div style={{ flex: 1 }}>
            <InfoRow icon={MapPin}   label="Theatre"   value={show?.theatre ?? "—"} />
            <InfoRow icon={Armchair} label="Screen"    value={show?.screen  ?? "—"} />
            <InfoRow icon={Clock}    label="Show Time" value={
              show?.showTime
                ? new Date(show.showTime).toLocaleString([], {
                    weekday: "short", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })
                : "—"
            } />
            {movie?.duration && (
              <InfoRow icon={Calendar} label="Duration" value={`${movie.duration} min`} />
            )}
          </div>
        </motion.div>

        {/* Seats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .15 }}
          style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 24, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".18em",
            textTransform: "uppercase", color: "rgba(255,255,255,.25)", marginBottom: 14 }}>
            Selected Seats ({seats.length})
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {seats.map((seat) => <SeatChip key={seat._id} seat={seat} />)}
          </div>
        </motion.div>

        {/* Price breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .2 }}
          style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 24, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".18em",
            textTransform: "uppercase", color: "rgba(255,255,255,.25)", marginBottom: 14 }}>
            Price Breakdown
          </p>
          <div style={{ display: "flex", justifyContent: "space-between",
            padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)",
            fontSize: 13, color: "rgba(255,255,255,.45)" }}>
            <span>₹{show?.price ?? 0} × {seats.length} seat{seats.length > 1 ? "s" : ""}</span>
            <span>₹{(show?.price ?? 0) * seats.length}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between",
            padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)",
            fontSize: 13, color: "rgba(255,255,255,.45)" }}>
            <span>Convenience fee</span>
            <span style={{ color: "#4ade80" }}>FREE</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between",
            padding: "16px 0 4px", fontSize: 20, fontWeight: 900 }}>
            <span style={{ color: "rgba(255,255,255,.6)" }}>Total</span>
            <span style={{ color: "#a78bfa" }}>₹{booking.totalPrice}</span>
          </div>
        </motion.div>

        {/* Booking ID */}
        <div style={{ padding: "12px 20px", borderRadius: 14,
          background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.06)",
          marginBottom: 28, display: "flex", justifyContent: "space-between",
          alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)", fontWeight: 700,
            letterSpacing: ".14em", textTransform: "uppercase" }}>Booking ID</span>
          <span style={{ fontFamily: "monospace", fontSize: 11,
            color: "rgba(255,255,255,.35)" }}>{booking._id}</span>
        </div>

        {/* CTAs */}
        <AnimatePresence>

          {/* ── PENDING — show Pay + Cancel ── */}
          {booking.status === "pending" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>

              {/* PAY BUTTON */}
              <motion.button
                whileHover={!paying ? { scale: 1.03, boxShadow: "0 16px 40px rgba(124,58,237,.5)" } : {}}
                whileTap={!paying ? { scale: 0.97 } : {}}
                onClick={handlePayment}
                disabled={paying}
                style={{
                  flex: 1, minWidth: 200,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 10,
                  padding: "16px 32px", borderRadius: 99,
                  background: paying
                    ? "rgba(124,58,237,.4)"
                    : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff", fontWeight: 900, fontSize: 15,
                  border: "none", cursor: paying ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 24px rgba(124,58,237,.4)",
                  transition: "all 0.2s",
                }}>
                {paying
                  ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Processing...</>
                  : <><CreditCard size={18} /> Pay ₹{booking.totalPrice}</>
                }
              </motion.button>

              {/* CANCEL BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleCancel}
                disabled={paying}
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8,
                  padding: "16px 24px", borderRadius: 99,
                  background: "rgba(248,113,113,.08)",
                  border: "1px solid rgba(248,113,113,.2)",
                  color: "#f87171", fontWeight: 800, fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                <XCircle size={15} /> Cancel
              </motion.button>
            </motion.div>
          )}

          {/* ── CONFIRMED ── */}
          {booking.status === "confirmed" && (
            <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: 24, borderRadius: 20,
                background: "rgba(74,222,128,.06)",
                border: "1px solid rgba(74,222,128,.2)",
                display: "flex", alignItems: "center", gap: 16 }}>
              <CheckCircle2 size={36} color="#4ade80" />
              <div>
                <p style={{ fontSize: 17, fontWeight: 900, color: "#4ade80", margin: 0 }}>
                  Payment Successful!
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", margin: "4px 0 0" }}>
                  Your seats are confirmed. Enjoy the show! 🎬
                </p>
                {booking.paymentId && (
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,.2)",
                    fontFamily: "monospace", margin: "6px 0 0" }}>
                    Payment ID: {booking.paymentId}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── CANCELLED ── */}
          {booking.status === "cancelled" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: 24, borderRadius: 20,
                background: "rgba(248,113,113,.06)",
                border: "1px solid rgba(248,113,113,.2)",
                display: "flex", alignItems: "center", gap: 16 }}>
              <XCircle size={36} color="#f87171" />
              <div>
                <p style={{ fontSize: 17, fontWeight: 900, color: "#f87171", margin: 0 }}>
                  Booking Cancelled
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", margin: "4px 0 0" }}>
                  Your seats have been released back to the pool.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,.25); border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default Checkout;