import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { ShieldCheck, Ticket, Loader2 } from "lucide-react";
import { createOrder, verifyPayment, resetPaymentState } from "../Redux/paymentSlice";

// Dynamically loads Razorpay's checkout script once
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Payment = () => {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const seatIds = location.state?.seatIds ?? [];
  const seatLabels = location.state?.seatLabels ?? [];

  const shows = useSelector((state) => {
    const s = state.shows?.shows ?? state.shows ?? [];
    return Array.isArray(s) ? s : [];
  });
  const show = shows.find((s) => String(s._id) === String(showId));
  const movies = useSelector((state) => state.movies?.movies ?? []);
  const movie = show ? movies.find((m) => String(m._id) === String(show.movie)) : null;

  const { loading } = useSelector((state) => state.payment || {});
  const [processing, setProcessing] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const amount = show?.price ? show.price * seatIds.length : 0;

  useEffect(() => {
    if (!seatIds.length) {
      toast.error("No seats selected");
      navigate(-1);
    }
    return () => dispatch(resetPaymentState());
  }, []);

  const handlePay = async () => {
    if (!guestEmail.trim() || !guestEmail.includes("@")) {
      toast.error("Please enter a valid email — your ticket will be sent there.");
      return;
    }
console.log(guestEmail)
    setProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Check your connection.");
      setProcessing(false);
      return;
    }

    const result = await dispatch(createOrder({ showId, seatIds, guestName, guestEmail }));
    if (!createOrder.fulfilled.match(result)) {
      toast.error(result.payload ?? "Could not start payment");
      setProcessing(false);
      return;
    }

    const { order, bookingId, keyId } = result.payload;

    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: "CineBook",
      description: `${movie?.title ?? "Movie"} — ${seatLabels.join(", ")}`,
      order_id: order.id,
      handler: async (response) => {
        const verifyResult = await dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId,
          })
        );

        if (verifyPayment.fulfilled.match(verifyResult)) {
          toast.success("🎉 Booking confirmed! Check your email.", { duration: 5000 });
          navigate(`/booking-confirmed/${bookingId}`);
        } else {
          toast.error(verifyResult.payload ?? "Payment verification failed");
          setProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          toast("Payment cancelled", { icon: "↩️" });
          setProcessing(false);
        },
      },
      prefill: {
        name: guestName,
        email: guestEmail,
      },
      theme: { color: "#7c3aed" },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    });
    razorpayInstance.open();
  };

  return (
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
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 20,
          padding: 32,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(139,92,246,.15)",
            border: "1px solid rgba(139,92,246,.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Ticket size={24} color="#a78bfa" />
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>
          {movie?.title ?? "Confirm Payment"}
        </h2>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 24 }}>
          {show?.theatre} · {seatLabels.join(", ")}
        </p>

        <div style={{ marginBottom: 16, textAlign: "left" }}>
          <label style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>
            YOUR NAME
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="John Doe"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "#fff",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: 24, textAlign: "left" }}>
          <label style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>
            EMAIL (your ticket goes here) *
          </label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "#fff",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,.04)",
            borderRadius: 14,
            padding: "18px 20px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>
            {seatIds.length} Seat{seatIds.length !== 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>₹{amount}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePay}
          disabled={processing || loading}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 99,
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "#fff",
            fontWeight: 900,
            fontSize: 14,
            border: "none",
            cursor: processing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: processing ? 0.7 : 1,
          }}
        >
          {processing ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing...
            </>
          ) : (
            <>Pay ₹{amount}</>
          )}
        </motion.button>

        <p
          style={{
            marginTop: 16,
            fontSize: 11,
            color: "rgba(255,255,255,.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <ShieldCheck size={12} /> Secured by Razorpay
        </p>
      </motion.div>
    </div>
  );
};

export default Payment;