



// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchShows } from "../Redux/showSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MapPin, Clock, Ticket, ChevronLeft, Star,
//   Wifi, Volume2, Armchair, Zap, Coffee, Car,
//   CheckCircle2, AlertCircle, Circle,
// } from "lucide-react";

// /* ─── Fake amenity icons per theatre (cosmetic) ─────────────── */
// const AMENITY_POOLS = [
//   [Wifi, Volume2, Armchair, Car],
//   [Coffee, Armchair, Volume2],
//   [Zap, Wifi, Armchair, Coffee, Car],
//   [Volume2, Armchair, Coffee],
// ];

// /* ─── Derive occupancy hint from show._id hash ───────────────── */
// const occupancyHint = (id = "") => {
//   const n = id.charCodeAt(id.length - 1) % 3;
//   return [
//     { label: "FILLING FAST", color: "#f87171", icon: AlertCircle },
//     { label: "AVAILABLE",    color: "#4ade80", icon: CheckCircle2 },
//     { label: "FEW SEATS",    color: "#fbbf24", icon: Circle },
//   ][n];
// };

// /* ─── Format show time ───────────────────────────────────────── */
// const fmt = (iso) =>
//   new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// const fmtPeriod = (iso) => {
//   const h = new Date(iso).getHours();
//   if (h < 12) return "MORNING";
//   if (h < 17) return "AFTERNOON";
//   if (h < 21) return "EVENING";
//   return "NIGHT";
// };

// const periodAccent = { MORNING: "#fde68a", AFTERNOON: "#86efac", EVENING: "#c4b5fd", NIGHT: "#93c5fd" };

// /* ─── Ambient background ──────────────────────────────────────── */
// const Ambient = () => (
//   <>
//     <div aria-hidden style={{
//       position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
//       backgroundImage: `
//         linear-gradient(rgba(139,92,246,.035) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(139,92,246,.035) 1px, transparent 1px)`,
//       backgroundSize: "52px 52px",
//     }} />
//     {[
//       { top: "-12%", left: "-8%",  w: 560, c: "rgba(124,58,237,.1)"  },
//       { top:  "55%", right: "-6%", w: 380, c: "rgba(56,189,248,.07)" },
//       { bottom:"5%", left: "30%",  w: 320, c: "rgba(236,72,153,.06)" },
//     ].map((o, i) => (
//       <motion.div key={i} aria-hidden
//         animate={{ y: [0, -18, 0], scale: [1, 1.06, 1] }}
//         transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "easeInOut" }}
//         style={{
//           position: "fixed", borderRadius: "50%",
//           width: o.w, height: o.w,
//           background: o.c, filter: "blur(80px)",
//           top: o.top, left: o.left, right: o.right, bottom: o.bottom,
//           pointerEvents: "none", zIndex: 0,
//         }}
//       />
//     ))}
//   </>
// );

// /* ─── Show Time Button ────────────────────────────────────────── */
// const ShowButton = ({ show, onClick, delay }) => {
//   const [hovered, setHovered] = useState(false);
//   const occ = occupancyHint(show._id);
//   const OccIcon = occ.icon;
//   const period = fmtPeriod(show.showTime);
//   const accent = periodAccent[period];

//   return (
//     <motion.button
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//       whileHover={{ y: -4, scale: 1.03 }}
//       whileTap={{ scale: 0.96 }}
//       onHoverStart={() => setHovered(true)}
//       onHoverEnd={() => setHovered(false)}
//       onClick={onClick}
//       style={{
//         position: "relative",
//         display: "flex", flexDirection: "column", alignItems: "flex-start",
//         gap: 6, padding: "14px 18px",
//         minWidth: 130,
//         background: hovered
//           ? `linear-gradient(135deg, ${accent}18, rgba(255,255,255,.06))`
//           : "rgba(255,255,255,.04)",
//         border: hovered
//           ? `1.5px solid ${accent}55`
//           : "1.5px solid rgba(255,255,255,.08)",
//         borderRadius: 16, cursor: "pointer",
//         backdropFilter: "blur(16px)",
//         boxShadow: hovered ? `0 12px 32px rgba(0,0,0,.4), 0 0 20px ${accent}22` : "0 4px 16px rgba(0,0,0,.3)",
//         transition: "all 0.25s ease",
//         fontFamily: "inherit",
//         overflow: "hidden",
//       }}
//     >
//       {/* Period label top-right */}
//       <span style={{
//         position: "absolute", top: 10, right: 10,
//         fontSize: 8, fontWeight: 900, letterSpacing: "0.14em",
//         color: accent, opacity: 0.7,
//       }}>{period}</span>

//       {/* Time */}
//       <span style={{
//         fontSize: 22, fontWeight: 900, color: "#fff",
//         letterSpacing: "-0.03em", lineHeight: 1,
//         fontVariantNumeric: "tabular-nums",
//       }}>
//         {fmt(show.showTime)}
//       </span>

//       {/* Price */}
//       <span style={{
//         fontSize: 13, fontWeight: 800,
//         color: hovered ? accent : "rgba(255,255,255,.5)",
//         transition: "color 0.2s",
//       }}>
//         ₹{show.price}
//       </span>

//       {/* Occupancy */}
//       <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
//         <OccIcon size={9} color={occ.color} />
//         <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: occ.color }}>
//           {occ.label}
//         </span>
//       </div>

//       {/* Hover shine sweep */}
//       <AnimatePresence>
//         {hovered && (
//           <motion.div aria-hidden
//             initial={{ x: "-100%", opacity: 0 }}
//             animate={{ x: "200%", opacity: 0.15 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//             style={{
//               position: "absolute", inset: 0,
//               background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
//               pointerEvents: "none",
//             }}
//           />
//         )}
//       </AnimatePresence>
//     </motion.button>
//   );
// };

// /* ─── Theatre Card ────────────────────────────────────────────── */
// const TheatreCard = ({ theatre, shows, amenities, index, onSelect }) => {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 32 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
//       style={{
//         background: "rgba(255,255,255,.03)",
//         border: "1px solid rgba(255,255,255,.07)",
//         borderRadius: 28, overflow: "hidden",
//         backdropFilter: "blur(20px)",
//         boxShadow: "0 20px 50px rgba(0,0,0,.35)",
//       }}
//     >
//       {/* Card header */}
//       <button
//         onClick={() => setExpanded(e => !e)}
//         style={{
//           width: "100%", display: "flex", alignItems: "center",
//           justifyContent: "space-between", gap: 16,
//           padding: "24px 28px",
//           background: "none", border: "none", cursor: "pointer",
//           borderBottom: expanded ? "1px solid rgba(255,255,255,.06)" : "none",
//           fontFamily: "inherit",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           {/* Index badge */}
//           <div style={{
//             width: 42, height: 42, borderRadius: 14,
//             background: "linear-gradient(135deg, #7c3aed22, #4f46e522)",
//             border: "1px solid rgba(139,92,246,.25)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             flexShrink: 0,
//           }}>
//             <span style={{ fontSize: 14, fontWeight: 900, color: "#a78bfa" }}>
//               {String(index + 1).padStart(2, "0")}
//             </span>
//           </div>

//           <div style={{ textAlign: "left" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//               <MapPin size={13} color="#a78bfa" />
//               <h2 style={{
//                 fontSize: 16, fontWeight: 900, color: "#fff", margin: 0,
//                 letterSpacing: "-0.02em",
//               }}>
//                 {theatre}
//               </h2>
//             </div>
//             {/* Amenities */}
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               {amenities.map((A, i) => (
//                 <A key={i} size={12} color="rgba(255,255,255,.25)" />
//               ))}
//               <span style={{
//                 fontSize: 9, color: "rgba(255,255,255,.2)", fontWeight: 700,
//                 letterSpacing: "0.12em", textTransform: "uppercase",
//               }}>
//                 {shows.length} Show{shows.length !== 1 ? "s" : ""}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Star rating (cosmetic) */}
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
//           <div style={{ display: "flex", gap: 2 }}>
//             {[1,2,3,4,5].map(s => (
//               <Star key={s} size={11}
//                 fill={s <= 4 ? "#a78bfa" : "transparent"}
//                 color={s <= 4 ? "#a78bfa" : "rgba(255,255,255,.15)"}
//               />
//             ))}
//           </div>
//           <motion.div
//             animate={{ rotate: expanded ? 180 : 0 }}
//             transition={{ duration: 0.25 }}
//             style={{ color: "rgba(255,255,255,.2)", fontSize: 11 }}
//           >
//             ▲
//           </motion.div>
//         </div>
//       </button>

//       {/* Shows grid */}
//       <AnimatePresence initial={false}>
//         {expanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
//             style={{ overflow: "hidden" }}
//           >
//             <div style={{ padding: "20px 28px 28px", display: "flex", flexWrap: "wrap", gap: 12 }}>

              
//               {(shows ||[])?.map((show, si) => (
//                 <ShowButton
//                   key={show._id}
//                   show={show}
//                   delay={si * 0.05}
//                   onClick={() => onSelect(show._id)}
//                 />
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════ */
// const Shows = () => {
//   const { movieId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   // const { shows, loading } = useSelector((state) => state.shows);

//   const { shows = [], loading } = useSelector(
//   (state) => state.shows || {}
// );

//   // Try to pull movie info from movies slice (may exist in state)
//   const movies = useSelector((state) => state.movies?.movies ?? []);
//   const movie = movies.find((m) => String(m._id) === String(movieId));

// const city = useSelector((state) => state.location.city);

// useEffect(() => {
//   if (movieId && city) {
//     dispatch(fetchShows({ movieId, city }));
//   }
// }, [dispatch, movieId, city]);
// console.log("SHOWS:", shows);
//   // Group by theatre
//   const groupedShows = (shows || []).reduce((acc, show) => {
//     if (!acc[show.theatre]) acc[show.theatre] = [];
//     acc[show.theatre].push(show);
//     return acc;
//   }, {});

//   const theatres = Object.keys(groupedShows);

//   /* ── Loading ── */
//   if (loading) return (
//     <div style={{
//       display: "flex", flexDirection: "column", alignItems: "center",
//       justifyContent: "center", height: "100vh",
//       background: "#080810", gap: 14,
//     }}>
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
//         style={{
//           width: 44, height: 44,
//           border: "3px solid rgba(139,92,246,.15)",
//           borderTop: "3px solid #7c3aed",
//           borderRadius: "50%",
//         }}
//       />
//       <p style={{
//         color: "rgba(255,255,255,.18)", fontSize: 9,
//         letterSpacing: "0.25em", textTransform: "uppercase",
//         fontWeight: 700, fontFamily: "monospace",
//       }}>
//         Fetching Showtimes
//       </p>
//     </div>
//   );

//   /* ── Empty ── */
//   if (!loading && theatres.length === 0) return (
//     <div style={{
//       minHeight: "100vh", background: "#080810", color: "#fff",
//       display: "flex", flexDirection: "column", alignItems: "center",
//       justifyContent: "center", gap: 16, fontFamily: "inherit",
//     }}>
//       <Ticket size={48} color="rgba(139,92,246,.3)" />
//       <h2 style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,.5)", margin: 0 }}>
//         No shows available
//       </h2>
//       <button onClick={() => navigate(-1)} style={{
//         display: "flex", alignItems: "center", gap: 8,
//         padding: "10px 24px", borderRadius: 99,
//         background: "rgba(124,58,237,.2)", border: "1px solid rgba(124,58,237,.3)",
//         color: "#a78bfa", fontWeight: 800, fontSize: 12,
//         cursor: "pointer", fontFamily: "inherit",
//       }}>
//         <ChevronLeft size={14} /> Go Back
//       </button>
//     </div>
//   );

//   /* ── Main ── */
//   return (
//     <div style={{
//       minHeight: "100vh", background: "#080810", color: "#fff",
//       fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
//       position: "relative", overflowX: "hidden",
//     }}>
//       <Ambient />

//       <div style={{ position: "relative", zIndex: 1 }}>

//         {/* ── Hero Banner ─────────────────────────────────── */}
//         <div style={{ position: "relative", height: 300, overflow: "hidden" }}>

//           {/* Blurred poster bg */}
//           {movie?.poster && (
//             <>
//               <img src={movie.poster} alt=""
//                 style={{
//                   position: "absolute", inset: 0,
//                   width: "100%", height: "100%", objectFit: "cover",
//                   filter: "blur(24px) brightness(0.25) saturate(0.6)",
//                   transform: "scale(1.08)",
//                 }}
//               />
//               <div style={{
//                 position: "absolute", inset: 0,
//                 background: "linear-gradient(to bottom, rgba(8,8,16,.4), rgba(8,8,16,1))",
//               }} />
//             </>
//           )}
//           {!movie?.poster && (
//             <div style={{
//               position: "absolute", inset: 0,
//               background: "linear-gradient(135deg, rgba(124,58,237,.15), rgba(8,8,16,1))",
//             }} />
//           )}

//           {/* Back button */}
//           <motion.button
//             initial={{ opacity: 0, x: -12 }}
//             animate={{ opacity: 1, x: 0 }}
//             whileHover={{ x: -3 }}
//             onClick={() => navigate(-1)}
//             style={{
//               position: "absolute", top: 28, left: 32,
//               display: "flex", alignItems: "center", gap: 7,
//               padding: "8px 16px", borderRadius: 99,
//               background: "rgba(255,255,255,.07)", backdropFilter: "blur(12px)",
//               border: "1px solid rgba(255,255,255,.1)",
//               color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 11,
//               cursor: "pointer", fontFamily: "inherit",
//               letterSpacing: "0.06em", textTransform: "uppercase",
//             }}
//           >
//             <ChevronLeft size={14} /> Back
//           </motion.button>

//           {/* Movie info row */}
//           <div style={{
//             position: "absolute", bottom: 28, left: 32, right: 32,
//             display: "flex", alignItems: "flex-end", gap: 20,
//           }}>
//             {movie?.poster && (
//               <motion.img
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 src={movie.poster} alt={movie.title}
//                 style={{
//                   width: 72, height: 104, objectFit: "cover", borderRadius: 14,
//                   boxShadow: "0 16px 40px rgba(0,0,0,.7)",
//                   border: "1px solid rgba(255,255,255,.1)", flexShrink: 0,
//                 }}
//               />
//             )}
//             <div>
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 style={{ marginBottom: 8 }}
//               >
//                 <span style={{
//                   display: "inline-flex", alignItems: "center", gap: 5,
//                   padding: "3px 10px", borderRadius: 99,
//                   background: "rgba(139,92,246,.2)", border: "1px solid rgba(139,92,246,.35)",
//                   color: "#c4b5fd", fontSize: 9, fontWeight: 800,
//                   letterSpacing: "0.14em", textTransform: "uppercase",
//                 }}>
//                   <Ticket size={9} /> Select Showtime
//                 </span>
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.15 }}
//                 style={{
//                   fontSize: 30, fontWeight: 900, margin: "0 0 8px",
//                   letterSpacing: "-0.04em",
//                   background: "linear-gradient(135deg, #fff 50%, rgba(255,255,255,.5))",
//                   WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 {movie?.title ?? "Select a Show"}
//               </motion.h1>

//               <motion.div
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}
//               >
//                 {movie?.genre && (
//                   <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.35)", fontSize: 11, fontWeight: 700 }}>
//                     <Ticket size={11} color="#7c3aed" /> {movie.genre}
//                   </span>
//                 )}
//                 {movie?.duration && (
//                   <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.35)", fontSize: 11, fontWeight: 700 }}>
//                     <Clock size={11} color="#7c3aed" /> {movie.duration} min
//                   </span>
//                 )}
//                 {movie?.rating && (
//                   <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.35)", fontSize: 11, fontWeight: 700 }}>
//                     <Star size={11} fill="#7c3aed" color="#7c3aed" /> {movie.rating}
//                   </span>
//                 )}
//                 <span style={{ color: "rgba(255,255,255,.2)", fontSize: 11, fontWeight: 700 }}>
//                   {theatres.length} Theatre{theatres.length !== 1 ? "s" : ""} · {shows.length} Shows
//                 </span>
//               </motion.div>
//             </div>
//           </div>
//         </div>

//         {/* ── Date Strip ──────────────────────────────────── */}
//         <div style={{ padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
//           <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
//             {["Today", "Tomorrow", "Wed 19", "Thu 20", "Fri 21"].map((d, i) => (
//               <motion.button
//                 key={d}
//                 whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
//                 style={{
//                   flexShrink: 0,
//                   padding: "8px 18px", borderRadius: 99,
//                   background: i === 0 ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,.04)",
//                   border: i === 0 ? "none" : "1px solid rgba(255,255,255,.07)",
//                   color: i === 0 ? "#fff" : "rgba(255,255,255,.3)",
//                   fontWeight: 800, fontSize: 11, cursor: "pointer",
//                   fontFamily: "inherit", letterSpacing: "0.04em",
//                   boxShadow: i === 0 ? "0 8px 20px rgba(124,58,237,.4)" : "none",
//                 }}
//               >
//                 {d}
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         {/* ── Legend ──────────────────────────────────────── */}
//         <div style={{
//           padding: "14px 32px",
//           display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
//           borderBottom: "1px solid rgba(255,255,255,.04)",
//         }}>
//           {[
//             { color: "#4ade80", icon: CheckCircle2, label: "Available" },
//             { color: "#fbbf24", icon: Circle,       label: "Few Seats" },
//             { color: "#f87171", icon: AlertCircle,  label: "Filling Fast" },
//           ].map(({ color, icon: Icon, label }) => (
//             <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
//               <Icon size={11} color={color} />
//               <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
//                 {label}
//               </span>
//             </div>
//           ))}
//           <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
//             {Object.entries(periodAccent).map(([p, c]) => (
//               <div key={p} style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                 <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
//                 <span style={{ fontSize: 9, color: "rgba(255,255,255,.2)", fontWeight: 700, letterSpacing: "0.1em" }}>{p}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Theatre List ─────────────────────────────────── */}
//         <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 32px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
//           {theatres.map((theatre, idx) => (
//             <TheatreCard
//               key={theatre}
//               theatre={theatre}
//               shows={groupedShows[theatre]}
//               amenities={AMENITY_POOLS[idx % AMENITY_POOLS.length]}
//               index={idx}
//               onSelect={(showId) => navigate(`/seats/${showId}`)}
//             />
//           ))}
//         </div>

//       </div>

//       <style>{`
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 5px; height: 5px; background: #080810; }
//         ::-webkit-scrollbar-thumb { background: rgba(124,58,237,.25); border-radius: 99px; }
//       `}</style>
//     </div>
//   );
// };

// export default Shows;




import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShows } from "../Redux/showSlice";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Ticket, ChevronLeft, Star,
  Wifi, Volume2, Armchair, Zap, Coffee, Car,
  CheckCircle2, AlertCircle, Circle,
} from "lucide-react";

/* ─── Fake amenity icons per theatre (cosmetic) ─────────────── */
const AMENITY_POOLS = [
  [Wifi, Volume2, Armchair, Car],
  [Coffee, Armchair, Volume2],
  [Zap, Wifi, Armchair, Coffee, Car],
  [Volume2, Armchair, Coffee],
];

/* ─── Derive occupancy hint from show._id hash ───────────────── */
const occupancyHint = (id = "") => {
  const n = id.charCodeAt(id.length - 1) % 3;
  return [
    { label: "FILLING FAST", color: "#f87171", icon: AlertCircle },
    { label: "AVAILABLE",    color: "#4ade80", icon: CheckCircle2 },
    { label: "FEW SEATS",    color: "#fbbf24", icon: Circle },
  ][n];
};

/* ─── Format show time ───────────────────────────────────────── */
const fmt = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtPeriod = (iso) => {
  const h = new Date(iso).getHours();
  if (h < 12) return "MORNING";
  if (h < 17) return "AFTERNOON";
  if (h < 21) return "EVENING";
  return "NIGHT";
};

const periodAccent = { MORNING: "#fde68a", AFTERNOON: "#86efac", EVENING: "#c4b5fd", NIGHT: "#93c5fd" };

/* ─── Ambient background ──────────────────────────────────────── */
const Ambient = () => (
  <>
    <div aria-hidden style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(139,92,246,.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,.035) 1px, transparent 1px)`,
      backgroundSize: "52px 52px",
    }} />
    {[
      { top: "-12%", left: "-8%",  w: 560, c: "rgba(124,58,237,.1)"  },
      { top:  "55%", right: "-6%", w: 380, c: "rgba(56,189,248,.07)" },
      { bottom:"5%", left: "30%",  w: 320, c: "rgba(236,72,153,.06)" },
    ].map((o, i) => (
      <motion.div key={i} aria-hidden
        animate={{ y: [0, -18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed", borderRadius: "50%",
          width: o.w, height: o.w,
          background: o.c, filter: "blur(80px)",
          top: o.top, left: o.left, right: o.right, bottom: o.bottom,
          pointerEvents: "none", zIndex: 0,
        }}
      />
    ))}
  </>
);

/* ─── Show Time Button ────────────────────────────────────────── */
const ShowButton = ({ show, onClick, delay }) => {
  const [hovered, setHovered] = useState(false);
  const occ = occupancyHint(show._id);
  const OccIcon = occ.icon;
  const period = fmtPeriod(show.showTime);
  const accent = periodAccent[period];

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 6, padding: "14px 18px", minWidth: 130,
        background: hovered
          ? `linear-gradient(135deg, ${accent}18, rgba(255,255,255,.06))`
          : "rgba(255,255,255,.04)",
        border: hovered
          ? `1.5px solid ${accent}55`
          : "1.5px solid rgba(255,255,255,.08)",
        borderRadius: 16, cursor: "pointer",
        backdropFilter: "blur(16px)",
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,.4), 0 0 20px ${accent}22`
          : "0 4px 16px rgba(0,0,0,.3)",
        transition: "all 0.25s ease",
        fontFamily: "inherit", overflow: "hidden",
      }}
    >
      <span style={{
        position: "absolute", top: 10, right: 10,
        fontSize: 8, fontWeight: 900, letterSpacing: "0.14em",
        color: accent, opacity: 0.7,
      }}>{period}</span>

      <span style={{
        fontSize: 22, fontWeight: 900, color: "#fff",
        letterSpacing: "-0.03em", lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>
        {fmt(show.showTime)}
      </span>

      <span style={{
        fontSize: 13, fontWeight: 800,
        color: hovered ? accent : "rgba(255,255,255,.5)",
        transition: "color 0.2s",
      }}>
        ₹{show.price}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
        <OccIcon size={9} color={occ.color} />
        <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: occ.color }}>
          {occ.label}
        </span>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div aria-hidden
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "200%", opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/* ─── Theatre Card ────────────────────────────────────────────── */
const TheatreCard = ({ theatre, shows, amenities, index, onSelect }) => {
  const [expanded, setExpanded] = useState(true);

  // ✅ FIX 2: always guarantee an array before .map — defensive guard
  const showList = Array.isArray(shows) ? shows : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 28, overflow: "hidden",
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 50px rgba(0,0,0,.35)",
      }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
          padding: "24px 28px", background: "none", border: "none",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid rgba(255,255,255,.06)" : "none",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: "linear-gradient(135deg, #7c3aed22, #4f46e522)",
            border: "1px solid rgba(139,92,246,.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#a78bfa" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <MapPin size={13} color="#a78bfa" />
              <h2 style={{ fontSize: 16, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                {theatre}
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {amenities.map((A, i) => <A key={i} size={12} color="rgba(255,255,255,.25)" />)}
              <span style={{ fontSize: 9, color: "rgba(255,255,255,.2)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {showList.length} Show{showList.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={11}
                fill={s <= 4 ? "#a78bfa" : "transparent"}
                color={s <= 4 ? "#a78bfa" : "rgba(255,255,255,.15)"}
              />
            ))}
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ color: "rgba(255,255,255,.2)", fontSize: 11 }}
          >▲</motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "20px 28px 28px", display: "flex", flexWrap: "wrap", gap: 12 }}>
              {/* ✅ FIX 2: was commented out — now rendering show buttons */}
              {showList.map((show, si) => (
                <ShowButton
                  key={show._id}
                  show={show}
                  delay={si * 0.05}
                  onClick={() => onSelect(show._id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Shows = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shows = [], loading } = useSelector((state) => state.shows || {});
  const movies = useSelector((state) => state.movies?.movies ?? []);
  const movie = movies.find((m) => String(m._id) === String(movieId));
  const city = useSelector((state) => state.location.city);

  useEffect(() => {
    if (movieId && city) {
      dispatch(fetchShows({ movieId, city }));
    }
  }, [dispatch, movieId, city]);

  // ✅ FIX 1: was `shows || [].reduce(...)` — operator precedence bug.
  // [].reduce() ran first (returned {}), then `shows || {}` = shows (the raw array).
  // Object.keys(array) → ["0","1","2"...], groupedShows["0"] = one show object, not array → .map crashed.
  // Fix: wrap in Array.isArray guard, then reduce.
  const showsArray = Array.isArray(shows) ? shows : [];
  const groupedShows = showsArray.reduce((acc, show) => {
    if (!acc[show.theatre]) acc[show.theatre] = [];
    acc[show.theatre].push(show);
    return acc;
  }, {});

  const theatres = Object.keys(groupedShows);

  if (loading) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh",
      background: "#080810", gap: 14,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        style={{
          width: 44, height: 44,
          border: "3px solid rgba(139,92,246,.15)",
          borderTop: "3px solid #7c3aed",
          borderRadius: "50%",
        }}
      />
      <p style={{
        color: "rgba(255,255,255,.18)", fontSize: 9,
        letterSpacing: "0.25em", textTransform: "uppercase",
        fontWeight: 700, fontFamily: "monospace",
      }}>
        Fetching Showtimes
      </p>
    </div>
  );

  if (!loading && theatres.length === 0) return (
    <div style={{
      minHeight: "100vh", background: "#080810", color: "#fff",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16, fontFamily: "inherit",
    }}>
      <Ticket size={48} color="rgba(139,92,246,.3)" />
      <h2 style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,.5)", margin: 0 }}>
        No shows available
      </h2>
      <button onClick={() => navigate(-1)} style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 24px", borderRadius: 99,
        background: "rgba(124,58,237,.2)", border: "1px solid rgba(124,58,237,.3)",
        color: "#a78bfa", fontWeight: 800, fontSize: 12,
        cursor: "pointer", fontFamily: "inherit",
      }}>
        <ChevronLeft size={14} /> Go Back
      </button>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#080810", color: "#fff",
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
      position: "relative", overflowX: "hidden",
    }}>
      <Ambient />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Hero Banner */}
        <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
          {movie?.poster ? (
            <>
              <img src={movie.poster} alt=""
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover",
                  filter: "blur(24px) brightness(0.25) saturate(0.6)",
                  transform: "scale(1.08)",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(8,8,16,.4), rgba(8,8,16,1))",
              }} />
            </>
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(124,58,237,.15), rgba(8,8,16,1))",
            }} />
          )}

          <motion.button
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
            onClick={() => navigate(-1)}
            style={{
              position: "absolute", top: 28, left: 32,
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 99,
              background: "rgba(255,255,255,.07)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}
          >
            <ChevronLeft size={14} /> Back
          </motion.button>

          <div style={{
            position: "absolute", bottom: 28, left: 32, right: 32,
            display: "flex", alignItems: "flex-end", gap: 20,
          }}>
            {movie?.poster && (
              <motion.img
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                src={movie.poster} alt={movie.title}
                style={{
                  width: 72, height: 104, objectFit: "cover", borderRadius: 14,
                  boxShadow: "0 16px 40px rgba(0,0,0,.7)",
                  border: "1px solid rgba(255,255,255,.1)", flexShrink: 0,
                }}
              />
            )}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }} style={{ marginBottom: 8 }}
              >
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 10px", borderRadius: 99,
                  background: "rgba(139,92,246,.2)", border: "1px solid rgba(139,92,246,.35)",
                  color: "#c4b5fd", fontSize: 9, fontWeight: 800,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                }}>
                  <Ticket size={9} /> Select Showtime
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: 30, fontWeight: 900, margin: "0 0 8px",
                  letterSpacing: "-0.04em",
                  background: "linear-gradient(135deg, #fff 50%, rgba(255,255,255,.5))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}
              >
                {movie?.title ?? "Select a Show"}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}
              >
                {movie?.genre && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.35)", fontSize: 11, fontWeight: 700 }}>
                    <Ticket size={11} color="#7c3aed" /> {movie.genre}
                  </span>
                )}
                {movie?.duration && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.35)", fontSize: 11, fontWeight: 700 }}>
                    <Clock size={11} color="#7c3aed" /> {movie.duration} min
                  </span>
                )}
                {movie?.rating && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.35)", fontSize: 11, fontWeight: 700 }}>
                    <Star size={11} fill="#7c3aed" color="#7c3aed" /> {movie.rating}
                  </span>
                )}
                <span style={{ color: "rgba(255,255,255,.2)", fontSize: 11, fontWeight: 700 }}>
                  {theatres.length} Theatre{theatres.length !== 1 ? "s" : ""} · {showsArray.length} Shows
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Date Strip */}
        <div style={{ padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {["Today", "Tomorrow", "Wed 19", "Thu 20", "Fri 21"].map((d, i) => (
              <motion.button key={d} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                style={{
                  flexShrink: 0, padding: "8px 18px", borderRadius: 99,
                  background: i === 0 ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,.04)",
                  border: i === 0 ? "none" : "1px solid rgba(255,255,255,.07)",
                  color: i === 0 ? "#fff" : "rgba(255,255,255,.3)",
                  fontWeight: 800, fontSize: 11, cursor: "pointer",
                  fontFamily: "inherit", letterSpacing: "0.04em",
                  boxShadow: i === 0 ? "0 8px 20px rgba(124,58,237,.4)" : "none",
                }}
              >{d}</motion.button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          padding: "14px 32px", display: "flex", gap: 20, alignItems: "center",
          flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,.04)",
        }}>
          {[
            { color: "#4ade80", icon: CheckCircle2, label: "Available" },
            { color: "#fbbf24", icon: Circle,       label: "Few Seats" },
            { color: "#f87171", icon: AlertCircle,  label: "Filling Fast" },
          ].map(({ color, icon: Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Icon size={11} color={color} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {label}
              </span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
            {Object.entries(periodAccent).map(([p, c]) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,.2)", fontWeight: 700, letterSpacing: "0.1em" }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Theatre List */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 32px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
          {theatres.map((theatre, idx) => (
            <TheatreCard
              key={theatre}
              theatre={theatre}
              shows={groupedShows[theatre]}
              amenities={AMENITY_POOLS[idx % AMENITY_POOLS.length]}
              index={idx}
              onSelect={(showId) => navigate(`/seats/${showId}`)}
            />
          ))}
        </div>

      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,.25); border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default Shows;