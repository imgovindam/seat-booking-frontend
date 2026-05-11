import React, { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeats, bookSeat, unbookSeat, lockSeat } from "../Redux/seatSlice";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Monitor,
  Info,
  ShoppingCart,
  Ticket,
  Clock,
} from "lucide-react";
import { createBooking } from "../Redux/bookingSlice";

/* ─── Constants ───────────────────────────────────────────────── */
const LOCK_TIME = 1 * 60 * 1000; // 1 minute in ms
const ROWS = ["A", "B", "C", "D", "E"];
const COLS = 10;

/* ─── Status config ───────────────────────────────────────────── */
const STATUS = {
  available: {
    bg: "rgba(139,92,246,.15)",
    border: "rgba(139,92,246,.4)",
    hover: "rgba(139,92,246,.35)",
    glow: "rgba(139,92,246,.5)",
    label: "Available",
    textColor: "#c4b5fd",
  },
  locked: {
    bg: "rgba(251,191,36,.12)",
    border: "rgba(251,191,36,.45)",
    hover: "rgba(251,191,36,.25)",
    glow: "rgba(251,191,36,.4)",
    label: "Held",
    textColor: "#fde68a",
  },
  booked: {
    bg: "rgba(255,255,255,.04)",
    border: "rgba(255,255,255,.08)",
    hover: null,
    glow: null,
    label: "Taken",
    textColor: "rgba(255,255,255,.2)",
  },
};

/* ─── Ambient orbs (reused from theme) ───────────────────────── */
const Ambient = () => (
  <>
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage: `
        linear-gradient(rgba(139,92,246,.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,.03) 1px, transparent 1px)`,
        backgroundSize: "52px 52px",
      }}
    />
    {[
      { top: "-10%", left: "-5%", w: 500, c: "rgba(124,58,237,.1)" },
      { bottom: "5%", right: "-5%", w: 380, c: "rgba(79,70,229,.08)" },
    ].map((o, i) => (
      <motion.div
        key={i}
        aria-hidden
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{
          duration: 10 + i * 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          borderRadius: "50%",
          width: o.w,
          height: o.w,
          background: o.c,
          filter: "blur(80px)",
          top: o.top,
          left: o.left,
          right: o.right,
          bottom: o.bottom,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    ))}
  </>
);

/* ─── Single Seat Button ──────────────────────────────────────── */
const SeatBtn = ({ seat, onToggle, remainingTime, isSelected }) => {
  const [hovered, setHovered] = useState(false);
  const cfg = STATUS[seat.status] ?? STATUS.available;
  const isBooked = seat.status === "booked";
  const isLocked = seat.status === "locked";
  const secs = isLocked ? Math.ceil((remainingTime ?? 0) / 1000) : null;

  return (
    <motion.button
      whileHover={!isBooked ? { y: -4, scale: 1.08 } : {}}
      whileTap={!isBooked ? { scale: 0.94 } : {}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => !isBooked && onToggle(seat._id, seat.status)}
      title={`Row ${seat.row} · Seat ${seat.col} · ${cfg.label}`}
      style={{
        position: "relative",
        width: 44,
        height: 44,
        borderRadius: 10,
        background: isSelected
          ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
          : hovered && !isBooked
            ? cfg.hover
            : cfg.bg,
        border: `1.5px solid ${isSelected ? "#a78bfa" : cfg.border}`,
        cursor: isBooked ? "not-allowed" : "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        boxShadow:
          (hovered || isSelected) && !isBooked
            ? `0 0 16px ${cfg.glow}`
            : "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        overflow: "hidden",
      }}
    >
      {/* Seat label */}
      <span
        style={{
          fontSize: 9,
          fontWeight: 900,
          color: isBooked
            ? "rgba(255,255,255,.15)"
            : isSelected
              ? "#fff"
              : cfg.textColor,
          letterSpacing: "0.04em",
          lineHeight: 1,
        }}
      >
        {seat.row}
        {seat.col}
      </span>

      {/* Countdown for locked seats */}
      {isLocked && secs !== null && (
        <span
          style={{
            fontSize: 7,
            color: "#fde68a",
            fontWeight: 800,
            letterSpacing: 0,
          }}
        >
          {secs}s
        </span>
      )}

      {/* Booked X mark */}
      {isBooked && (
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,.12)",
            lineHeight: 1,
          }}
        >
          ✕
        </span>
      )}

      {/* Selected glow overlay */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            background:
              "linear-gradient(135deg, rgba(255,255,255,.15), transparent)",
          }}
        />
      )}
    </motion.button>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const GetSeat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showId } = useParams();

  const [now, setNow] = useState(Date.now());
  const [selectedSeats, setSelectedSeats] = useState([]); // multi-select UX

  // ✅ FIX 1: removed stray `console.log("status is changed", status)`
  // `status` was not defined at module scope — was referencing nothing and crashing.

  const { seats = [], loading } = useSelector((state) => state.seats || {});

  // Pull show/movie context if available
  const shows = useSelector((state) => {
    const s = state.shows?.shows ?? state.shows ?? [];
    return Array.isArray(s) ? s : [];
  });
  const show = shows.find((s) => String(s._id) === String(showId));

  const movies = useSelector((state) => state.movies?.movies ?? []);
  const movie = show
    ? movies.find((m) => String(m._id) === String(show.movie))
    : null;

  useEffect(() => {
    if (showId) dispatch(fetchSeats(showId));
  }, [dispatch, showId]);

  // Tick every second for countdown timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingTime = (lockedAt) => {
    if (!lockedAt) return null;
    return Math.max(0, LOCK_TIME - (now - new Date(lockedAt).getTime()));
  };

  const handleConfirmBooking = async () => {
    const lockedSeatIds = seats
      .filter((s) => s.status === "locked")
      .map((s) => s._id);

    if (lockedSeatIds.length === 0) {
      toast.error("No seats are held. Click a seat first.");
      return;
    }

    const result = await dispatch(
      createBooking({ showId, seatIds: lockedSeatIds }),
    );

    if (createBooking.fulfilled.match(result)) {
      const bookingId = result.payload._id;
      navigate(`/checkout/${bookingId}`); // → Checkout page
    } else {
      toast.error(result.payload ?? "Booking failed");
    }
  };

  // ✅ FIX 2: proper handleToggle — also drives local selected state for summary
  const handleToggle = (id, currentStatus) => {

  // available → lock it
  if (currentStatus === "available") {
    dispatch(lockSeat(id));
    setSelectedSeats((prev) => [...prev, id]);
    toast("Seat held for 60s", {
      icon: "🔒",
      style: {
        background: "#1a1a2e", color: "#fde68a",
        border: "1px solid rgba(251,191,36,.3)", borderRadius: 12,
      },
    });

  // locked → clicking again releases it back to available
  } else if (currentStatus === "locked") {
    dispatch(unbookSeat(id));                              // ✅ release back
    setSelectedSeats((prev) => prev.filter((s) => s !== id));
    toast("Seat released", {                              // ✅ one toast, correct message
      icon: "↩️",
      style: {
        background: "#1a1a2e", color: "rgba(255,255,255,.6)",
        border: "1px solid rgba(255,255,255,.1)", borderRadius: 12,
      },
    });

  // booked → blocked in SeatBtn already, but guard here too just in case
  } else if (currentStatus === "booked") {
    toast.error("This seat is already booked");           // ✅ informative, no dispatch
  }
};

  // Group seats by row for cinema layout
  const seatsByRow = useMemo(() => {
    const map = {};
    (Array.isArray(seats) ? seats : []).forEach((seat) => {
      const row = seat.row ?? "?";
      if (!map[row]) map[row] = [];
      map[row].push(seat);
    });
    // Sort each row by col
    Object.keys(map).forEach((r) => map[r].sort((a, b) => a.col - b.col));
    return map;
  }, [seats]);

  const rows = Object.keys(seatsByRow).sort();

  // Summary counts
  const available = seats.filter((s) => s.status === "available").length;
  const locked = seats.filter((s) => s.status === "locked").length;
  const booked = seats.filter((s) => s.status === "booked").length;

  /* ── Loading ── */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#080810",
          gap: 14,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{
            width: 44,
            height: 44,
            border: "3px solid rgba(139,92,246,.15)",
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
          }}
        />
        <p
          style={{
            color: "rgba(255,255,255,.18)",
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          Loading Theatre
        </p>
      </div>
    );

  /* ── Main ── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080810",
        color: "#fff",
        fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Toaster position="top-center" />
      <Ambient />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 860,
          margin: "0 auto",
          padding: "32px 24px 100px",
        }}
      >
        {/* ── Top nav ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
          }}
        >
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 16px",
              borderRadius: 99,
              background: "rgba(255,255,255,.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,.09)",
              color: "rgba(255,255,255,.5)",
              fontWeight: 800,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <ChevronLeft size={14} /> Back
          </motion.button>

          {/* Movie pill */}
          {movie && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px 6px 6px",
                borderRadius: 99,
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "rgba(255,255,255,.7)",
                }}
              >
                {movie.title}
              </span>
            </motion.div>
          )}
        </div>

        {/* ── Page title ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(139,92,246,.7)",
              marginBottom: 8,
            }}
          >
            Choose Your Seats
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              margin: 0,
              background:
                "linear-gradient(135deg, #fff 50%, rgba(255,255,255,.4))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {show?.theatre ?? "Auditorium"}
            {show?.screen && (
              <span
                style={{
                  fontSize: 14,
                  WebkitTextFillColor: "rgba(255,255,255,.3)",
                  marginLeft: 10,
                  fontWeight: 700,
                }}
              >
                · {show.screen}
              </span>
            )}
          </h1>
          {show?.showTime && (
            <p
              style={{
                color: "rgba(255,255,255,.25)",
                fontSize: 12,
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Clock size={11} color="#7c3aed" />
              {new Date(show.showTime).toLocaleString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </motion.div>

        {/* ── SCREEN arc ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            marginBottom: 48,
            position: "relative",
          }}
        >
          {/* Arc line */}
          <div
            style={{
              margin: "0 auto",
              width: "80%",
              height: 3,
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,.6), rgba(99,102,241,.6), transparent)",
              boxShadow: "0 -6px 24px rgba(139,92,246,.3)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginTop: 8,
            }}
          >
            <Monitor size={12} color="rgba(139,92,246,.5)" />
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.28em",
                color: "rgba(139,92,246,.45)",
                textTransform: "uppercase",
              }}
            >
              All Eyes This Way
            </span>
          </div>
        </motion.div>

        {/* ── Seat Grid ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
          }}
        >
          {rows.map((row, ri) => (
            <motion.div
              key={row}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ri * 0.06 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              {/* Row label left */}
              <span
                style={{
                  width: 22,
                  textAlign: "right",
                  fontSize: 10,
                  fontWeight: 900,
                  color: "rgba(255,255,255,.2)",
                  letterSpacing: "0.08em",
                  flexShrink: 0,
                }}
              >
                {row}
              </span>

              {/* Seats */}
              <div style={{ display: "flex", gap: 6 }}>
                {seatsByRow[row].map((seat) => (
                  <SeatBtn
                    key={seat._id}
                    seat={seat}
                    onToggle={handleToggle}
                    remainingTime={getRemainingTime(seat.lockedAt)}
                    isSelected={selectedSeats.includes(seat._id)}
                  />
                ))}
              </div>

              {/* Row label right */}
              <span
                style={{
                  width: 22,
                  fontSize: 10,
                  fontWeight: 900,
                  color: "rgba(255,255,255,.2)",
                  letterSpacing: "0.08em",
                  flexShrink: 0,
                }}
              >
                {row}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Legend ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 28,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            {
              color: "rgba(139,92,246,.4)",
              bg: "rgba(139,92,246,.15)",
              label: "Available",
            },
            {
              color: "rgba(251,191,36,.45)",
              bg: "rgba(251,191,36,.12)",
              label: "Held",
            },
            {
              color: "rgba(255,255,255,.08)",
              bg: "rgba(255,255,255,.04)",
              label: "Taken",
            },
          ].map(({ color, bg, label }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 7 }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: bg,
                  border: `1.5px solid ${color}`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,.3)",
                  fontWeight: 700,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Stats bar ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Available", value: available, color: "#a78bfa" },
            { label: "Held", value: locked, color: "#fde68a" },
            { label: "Booked", value: booked, color: "rgba(255,255,255,.2)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 900, color, margin: 0 }}>
                {value}
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,.2)",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Sticky bottom CTA ─────────────────────────────── */}
      <AnimatePresence>
        {locked > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px 24px",
              background: "rgba(8,8,16,.85)",
              backdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(255,255,255,.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              zIndex: 100,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(139,92,246,.2)",
                  border: "1px solid rgba(139,92,246,.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingCart size={18} color="#a78bfa" />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  {locked} Seat{locked !== 1 ? "s" : ""} Held
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "rgba(255,255,255,.35)",
                    fontWeight: 600,
                  }}
                >
                  {show?.price
                    ? `₹${show.price * locked} total`
                    : "Confirm to book"}
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleConfirmBooking}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 12px 32px rgba(124,58,237,.5)",
              }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 32px",
                borderRadius: 99,
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                fontWeight: 900,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.04em",
                boxShadow: "0 8px 24px rgba(124,58,237,.4)",
              }}
            >
              <Ticket size={15} /> Confirm Booking
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,.25); border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default GetSeat;
