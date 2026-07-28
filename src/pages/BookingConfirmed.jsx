import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, Clock, Ticket, Home } from "lucide-react";
import { apiRequest } from "../api";

const BookingConfirmed = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest(`/bookings/${bookingId}`);
        setBooking(data.booking);
      } catch (err) {
        setError(err.message ?? "Could not load booking details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  if (loading) {
    return (
      <Shell>
        <p style={{ color: "rgba(255,255,255,.4)" }}>Loading your booking...</p>
      </Shell>
    );
  }

  if (error || !booking) {
    return (
      <Shell>
        <p style={{ color: "rgba(255,255,255,.4)", marginBottom: 16 }}>
          {error ?? "Booking not found"}
        </p>
        <HomeButton navigate={navigate} />
      </Shell>
    );
  }

  return (
    <Shell>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(34,197,94,.15)",
          border: "1px solid rgba(34,197,94,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <CheckCircle2 size={32} color="#4ade80" />
      </motion.div>

      <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>Booking Confirmed!</h2>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 28 }}>
        {booking.movieTitle}
      </p>

      <div
        style={{
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 16,
          padding: 20,
          textAlign: "left",
          marginBottom: 24,
        }}
      >
        <Row icon={<MapPin size={14} />} label="Theatre" value={booking.theatre} />
        {booking.showTime && (
          <Row
            icon={<Clock size={14} />}
            label="Show Time"
            value={new Date(booking.showTime).toLocaleString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        )}
        <Row icon={<Ticket size={14} />} label="Seats" value={booking.seatLabels.join(", ")} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 12,
            marginTop: 8,
            borderTop: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <span style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>Amount Paid</span>
          <span style={{ fontSize: 18, fontWeight: 900 }}>₹{booking.totalPrice}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontSize: 12,
          color: "rgba(255,255,255,.4)",
          marginBottom: 24,
        }}
      >
        <Mail size={13} />
        Ticket sent to {booking.guestEmail}
      </div>

      <HomeButton navigate={navigate} />
    </Shell>
  );
};

const Row = ({ icon, label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "rgba(255,255,255,.4)",
        fontSize: 12,
      }}
    >
      {icon} {label}
    </span>
    <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
  </div>
);

const HomeButton = ({ navigate }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => navigate("/")}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 28px",
      borderRadius: 99,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      fontFamily: "inherit",
    }}
  >
    <Home size={15} /> Back to Home
  </motion.button>
);

const Shell = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      background: "#080810",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
    }}
  >
    <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>{children}</div>
  </div>
);

export default BookingConfirmed;