// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMovies } from "../Redux/movieSlice";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { DatabaseZap } from "lucide-react";
// import {
//   Ticket,
//   Star,
//   Clock,
//   Sparkles,
//   Wand2,
//   RefreshCw,
//   LayoutGrid,
//   Flame,
//   Heart,
//   Zap,
// } from "lucide-react";
// import Navbar from "./Navbar";
// import MovieCarousel from "./MovieCarousel";
// // const itemPerPage=10;
// const Movies = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 📍 Pulling from our new Redux Location Slice
//   const city = useSelector((state) => state.location.city);
//   const { movies, loading } = useSelector((state) => state.movies);

//   const searchQuery = useSelector((state) => state.location.searchQuery);
//   const [aiPick, setAiPick] = useState(null);
//   const [isThinking, setIsThinking] = useState(false);
//   const [activeFilter, setActiveFilter] = useState("All");

//   useEffect(() => {
//     dispatch(fetchMovies());
//   }, [dispatch]);

//   const handleAiSuggest = () => {
//     setIsThinking(true);
//     setTimeout(() => {
//       // Suggest from existing movies
//       const random = movies[Math.floor(Math.random() * movies.length)];
//       setAiPick(random);
//       setIsThinking(false);
//     }, 1200);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
//   };

//   const itemVariants = {
//     hidden: { y: 30, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
//     },
//   };
//   const filteredMovies = movies.filter((movie) => {
//     // 1. Ensure movie and its properties exist (prevents crashes)
//     if (!movie) return false;

//     // 2. SEARCH FILTER (Case-insensitive + check for undefined)
//     // If no search query, everything matches.
//     const searchSafe = searchQuery || "";
//     const matchesSearch =
//       movie.title?.toLowerCase().includes(searchSafe.toLowerCase()) ||
//       movie.description?.toLowerCase().includes(searchSafe.toLowerCase());

//     // 3. GENRE FILTER (Case-insensitive)
//     const filterSafe = activeFilter || "All";
//     const matchesGenre =
//       filterSafe === "All" ||
//       movie.genre?.toLowerCase() === filterSafe.toLowerCase();

//     // 4. CITY FILTER (Keep it simple for now)
//     // Only filter if a specific city is selected.
//     const isCitySelected =
//       city && city !== "Select Location" && city !== "Location Error";

//     // Temporarily set to true to see if movies appear,
//     // or use your language logic:
//     const matchesCity =
//       !isCitySelected ||
//       (city === "Mumbai"
//         ? movie.language === "Hindi"
//         : city === "Delhi"
//           ? movie.language === "Hindi"
//           : true); // default true so we don't block all movies

//     return matchesSearch && matchesGenre && matchesCity;
//   });
//   console.log("filteredMovies", filteredMovies);
//   console.log("movies", movies);
//   console.log("Check Array:", Array.isArray(movies), "Length:", movies?.length);
//   if (loading)
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-white">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full"
//         />
//         <p className="mt-4 text-slate-400 font-medium tracking-[0.2em] uppercase text-[10px]">
//           Syncing Cinema
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen  selection:bg-violet-100 pb-20 font-sans">
//       <Navbar />
//       <div className="bg-violet-50">
//         <div className="px-6 py-2">
//           <MovieCarousel />
//         </div>

//         <main className="max-w-7xl mx-auto px-8">
//           {/* ✨ AI Recommendation Section ✨ */}
//           <motion.section
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             className="my-12 p-10 rounded-[3.5rem] bg-linear-to-br from-violet-700 via-violet-600 to-indigo-800 text-white  overflow-hidden shadow-[0_30px_60px_-15px_rgba(109,40,217,0.3)]"
//           >
//             <div className=" top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

//             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
//               <div className="text-center lg:text-left flex-1">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md mb-4 border border-white/10">
//                   <Sparkles size={14} className="text-cyan-300" />
//                   <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-100">
//                     AI Personal Assistant
//                   </span>
//                 </div>
//                 <h2 className="text-4xl font-bold mb-4 tracking-tight">
//                   Need a <span className="text-cyan-300">perfect</span> pick?
//                 </h2>
//                 <p className="text-violet-100/80 font-light text-base max-w-sm mb-8 leading-relaxed">
//                   Our neural engine filters through 100+ shows to match your
//                   unique vibe in{" "}
//                   <span className="font-bold text-white uppercase tracking-wider">
//                     {city}
//                   </span>
//                   .
//                 </p>

//                 <button
//                   onClick={handleAiSuggest}
//                   disabled={isThinking}
//                   className="bg-white text-violet-700 px-10 py-4 rounded-full font-extrabold text-sm flex items-center gap-3 hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
//                 >
//                   {isThinking ? (
//                     <RefreshCw className="animate-spin" size={18} />
//                   ) : (
//                     <Wand2 size={18} />
//                   )}
//                   {isThinking ? "Thinking..." : "Magic Suggestion"}
//                 </button>
//               </div>

//               <AnimatePresence mode="wait">
//                 {aiPick && !isThinking && (
//                   <motion.div
//                     key={aiPick._id}
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     onClick={() => navigate(`/shows/${aiPick._id}`)}
//                     className="bg-white/10 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/20 flex gap-6 items-center cursor-pointer hover:bg-white/15 transition-all w-full lg:max-w-md shadow-2xl"
//                   >
//                     <img
//                       src={aiPick.poster}
//                       className="w-24 h-36 rounded-2xl object-cover shadow-2xl border border-white/10"
//                       alt="Pick"
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className=" text-black text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
//                           <Star size={10} fill="black" /> {aiPick.rating}
//                         </span>
//                       </div>
//                       <h3 className="font-bold text-xl text-white mb-2">
//                         {aiPick.title}
//                       </h3>
//                       <p className="text-xs text-violet-100 line-clamp-3 font-light leading-relaxed mb-3">
//                         {aiPick.description}
//                       </p>
//                       <span className="text-[10px] font-bold text-cyan-300 underline underline-offset-4">
//                         BOOK IN {city.toUpperCase()} NOW
//                       </span>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.section>

//           {/* 🎭 Trendy Filter Bar */}
//           <div className="mb-10  flex flex-wrap gap-4 items-center justify-center md:justify-start">
//             <FilterChip
//               icon={<LayoutGrid size={14} />}
//               label="All"
//               active={activeFilter === "All"}
//               onClick={() => setActiveFilter("All")}
//             />
//             <FilterChip
//               icon={<Flame size={14} />}
//               label="Trending"
//               active={activeFilter === "Trending"}
//               onClick={() => setActiveFilter("Trending")}
//             />
//             <FilterChip
//               icon={<Zap size={14} />}
//               label="Action"
//               active={activeFilter === "Action"}
//               onClick={() => setActiveFilter("Action")}
//             />
//             <FilterChip
//               icon={<Heart size={14} />}
//               label="Romance"
//               active={activeFilter === "Romance"}
//               onClick={() => setActiveFilter("Romance")}
//             />
//           </div>

//           {/* 🎥 Standard Grid Header */}
//           <div className="mb-14 flex flex-col md:flex-row justify-between items-baseline gap-4">
//             <motion.div
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//             >
//               <h1 className="text-4xl font-light text-slate-900 tracking-tight">
//                 Showing in{" "}
//                 <span className="font-bold text-violet-600">{city}</span>
//               </h1>
//             </motion.div>
//             <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
//               <span className="text-violet-600">Premium Experiences</span>
//               <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
//               <span>Exclusives</span>
//             </div>
//           </div>

//           {filteredMovies?.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="col-span-full  min-h-125 flex flex-col items-center justify-center overflow-hidden rounded-[4rem] bg-slate-950 mt-10 shadow-2xl shadow-violet-900/20"
//             >
//               {/* 🌌 Background "Nebula" Glows */}
//               <motion.div
//                 animate={{
//                   scale: [1, 1.5, 1],
//                   opacity: [0.3, 0.6, 0.3],
//                   rotate: [0, 90, 0],
//                 }}
//                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//                 className=" top-[-20%] left-[-10%] w-[80%] h-[80%] bg-violet-600/20 blur-[120px] rounded-full"
//               />
//               <motion.div
//                 animate={{
//                   scale: [1.2, 1, 1.2],
//                   opacity: [0.2, 0.4, 0.2],
//                   rotate: [0, -90, 0],
//                 }}
//                 transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
//                 className=" bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-cyan-500/10 blur-[100px] rounded-full"
//               />

//               {/* 🛰️ Floating AI Scanner Interface */}
//               <div className="relative z-10 flex flex-col items-center">
//                 <div className="relative group mb-10">
//                   {/* Rotating Outer Ring */}
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{
//                       duration: 8,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                     className="absolute -inset-6 border-2 border-dashed border-violet-500/30 rounded-full"
//                   />

//                   {/* Pulsing Core */}
//                   <motion.div
//                     animate={{ scale: [1, 1.1, 1] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                     className="relative bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl shadow-violet-500/40"
//                   >
//                     <Sparkles
//                       size={56}
//                       className="text-violet-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]"
//                     />
//                   </motion.div>
//                 </div>

//                 {/* 📡 Text Content */}
//                 <div className="text-center px-6">
//                   <motion.h3
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     className="text-3xl font-black text-white tracking-tighter mb-4"
//                   >
//                     DATALINK{" "}
//                     <span className="text-violet-500 underline decoration-cyan-400">
//                       SEVERED
//                     </span>
//                   </motion.h3>

//                   <motion.p
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.1 }}
//                     className="text-slate-400 text-sm max-w-sm mx-auto font-light leading-relaxed mb-10"
//                   >
//                     Our neural network scanned every theater in{" "}
//                     <span className="text-white font-bold">{city}</span> but
//                     couldn't detect any{" "}
//                     <span className="text-cyan-400 font-mono font-bold">
//                       [{activeFilter}]
//                     </span>{" "}
//                     frequency.
//                   </motion.p>

//                   {/* ⚡ Glitchy Reboot Button */}
//                   <motion.button
//                     whileHover={{
//                       scale: 1.05,
//                       boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
//                     }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setActiveFilter("All")}
//                     className="group relative px-10 py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden"
//                   >
//                     <span className="relative z-10 flex items-center gap-2">
//                       <RefreshCw
//                         size={16}
//                         className="group-hover:rotate-180 transition-transform duration-500"
//                       />
//                       Re-Initialize Search
//                     </span>
//                     <div className="absolute inset-0 bg-linear-to-r from-violet-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </motion.button>
//                 </div>
//               </div>

//               {/* 🎞️ Decorative Particles (CSS Only) */}
//               <div className=" inset-0 pointer-events-none opacity-30">
//                 {[...Array(20)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: [0, 1, 0], y: -100 }}
//                     transition={{
//                       duration: Math.random() * 5 + 2,
//                       repeat: Infinity,
//                       delay: Math.random() * 5,
//                     }}
//                     className="absolute w-1 h-1 bg-white rounded-full"
//                     style={{
//                       left: `${Math.random() * 100}%`,
//                       top: `${Math.random() * 100}%`,
//                     }}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           ) : (
//             // <div className="text-center rounded-4xl  flex justify-center items-center h-auto bg-linear-to-br from-violet-700 via-violet-600 to-indigo-800 text-white  overflow-hidden shadow-[0_30px_60px_-15px_rgba(109,40,217,0.3)]">

//             //     <h2 className="text-4xl font-bold">
//             //      NO <span className="text-cyan-300"> DATA<DatabaseZap />  </span> TO DISPLAY IN  <span className="font-bold text-cyan-300 uppercase tracking-wider">
//             //         {city}
//             //       </span>
//             //     </h2>

//             //   </div>
//             <div className=" grid grid-cols-12  bg-violet-50">
//               <div className="col-span-3 text-violet-600 font-bold text-4xl font-stretch-110% underline">
//                 Filters
//               </div>

//               <div className=" col-span-9  gap-5">
//                 <motion.div
//                   variants={containerVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className=" grid grid-cols-4 gap-x-12 gap-y-20"
//                 >
//                   {filteredMovies.map((movie) => (
//                     <motion.div
//                       key={movie._id}
//                       variants={itemVariants}
//                       whileHover={{ y: -15 }}
//                       onClick={() => navigate(`/shows/${movie._id}`)}
//                       className="group cursor-pointer rounded-2xl "
//                     >



                     

//                       <div className="flex rounded-2xl aspect-2/3 overflow-hidden bg-violet-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_30px_60px_-20px_rgba(124,58,237,0.3)] transition-all duration-500 p-4">
//                         <div className="flex-1 flex flex-col ">
//                           <motion.img
//                             src={movie.poster}
//                             alt={movie.title}
//                             className="flex-1 rounded-2xl object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-700"
//                           />

                        
//                           <div className="bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 mt-[-1px] -mb-4 pb-4 grow" />

                        
//                           <div className="-mt-20 grow" />
//                         </div>

                  
//                         <div className=" bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl border border-white/50 ml-auto self-start z-10">
//                           <Star
//                             size={12}
//                             className="fill-violet-600 text-violet-600"
//                           />
//                           <span className="text-[11px] font-black text-slate-800">
//                             {movie.rating}
//                           </span>
//                         </div>
//                       </div>

//                       {/* <div className="flex  rounded-2xll aspect-2/3 overflow-hidden  bg-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_30px_60px_-20px_rgba(124,58,237,0.3)] transition-all duration-500">
//                         <motion.img
//                           src={movie.poster}
//                           alt={movie.title}
//                           className="w-full h-full rounded-2xl object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-700"
//                         />

//                         <div className=" inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

//                         <div className="m-[-60px] top-6 right-6 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl border border-white/50">
//                           <Star
//                             size={12}
//                             className="fill-violet-600 text-violet-600"
//                           />
//                           <span className="text-[11px] font-black text-slate-800">
//                             {movie.rating}
//                           </span>
//                         </div>
//                       </div> */}

//                       <div className="mt-8 space-y-2 px-4 text-center">
//                         <h2 className="text-lg font-bold text-slate-800 group-hover:text-violet-600 transition-colors truncate tracking-tight">
//                           {movie.title}
//                         </h2>
//                         <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 uppercase tracking-widest font-black">
//                           <span className="flex items-center gap-1.5">
//                             <Ticket size={14} className="text-violet-400" />{" "}
//                             {movie.genre}
//                           </span>
//                           <span className="w-1.5 h-1.5 bg-slate-100 rounded-full" />
//                           <span className="flex items-center gap-1.5">
//                             <Clock size={14} className="text-violet-400" />{" "}
//                             {movie.duration}
//                           </span>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// // Helper Component for Filter Chips
// const FilterChip = ({ icon, label, active, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
//       active
//         ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
//         : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
//     }`}
//   >
//     {icon}
//     {label}
//   </button>
// );

// export default Movies;




import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../Redux/movieSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket, Star, Clock, Sparkles, Wand2, RefreshCw,
  LayoutGrid, Flame, Heart, Zap, MapPin, ChevronRight,
  Play, TrendingUp, Eye,
} from "lucide-react";
import Navbar from "./Navbar";
import MovieCarousel from "./MovieCarousel";

/* ─── Design Tokens ──────────────────────────────────────────── */
const FILTERS = [
  { label: "All",      icon: LayoutGrid, accent: "#a78bfa" },
  { label: "Trending", icon: TrendingUp,  accent: "#f472b6" },
  { label: "Action",   icon: Zap,         accent: "#fb923c" },
  { label: "Romance",  icon: Heart,       accent: "#f87171" },
];

/* ─── Subtle animated background grid ───────────────────────── */
const GridBackground = () => (
  <div
    aria-hidden
    style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(139,92,246,.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,.04) 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
    }}
  />
);

/* ─── Floating orbs ──────────────────────────────────────────── */
const Orb = ({ style }) => (
  <motion.div
    aria-hidden
    animate={{ y: [0, -24, 0], scale: [1, 1.08, 1] }}
    transition={{ duration: 9 + Math.random() * 6, repeat: Infinity, ease: "easeInOut" }}
    style={{
      position: "fixed", borderRadius: "50%", filter: "blur(80px)",
      pointerEvents: "none", zIndex: 0, ...style,
    }}
  />
);

/* ─── Glass pill badge ───────────────────────────────────────── */
const Pill = ({ children, color = "#a78bfa" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px", borderRadius: 99,
    background: `${color}22`, border: `1px solid ${color}44`,
    color, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
    textTransform: "uppercase",
  }}>
    {children}
  </span>
);

/* ─── Filter Chip ─────────────────────────────────────────────── */
const FilterChip = ({ icon: Icon, label, active, accent, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "9px 20px", borderRadius: 99,
      border: active ? `1.5px solid ${accent}` : "1.5px solid rgba(255,255,255,.08)",
      background: active
        ? `linear-gradient(135deg, ${accent}33, ${accent}18)`
        : "rgba(255,255,255,.04)",
      color: active ? accent : "rgba(255,255,255,.4)",
      fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
      cursor: "pointer", backdropFilter: "blur(12px)",
      boxShadow: active ? `0 0 20px ${accent}44` : "none",
      transition: "all 0.25s ease", fontFamily: "inherit",
    }}
  >
    <Icon size={13} />
    {label}
  </motion.button>
);

/* ─── Movie Card ──────────────────────────────────────────────── */
const MovieCard = ({ movie, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={{ hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {/* Poster */}
      <div style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        aspectRatio: "2/3",
        boxShadow: hovered
          ? "0 30px 60px -10px rgba(139,92,246,.45), 0 0 0 1px rgba(139,92,246,.3)"
          : "0 12px 32px -8px rgba(0,0,0,.5)",
        transition: "box-shadow 0.4s ease",
      }}>
        <img
        
        loading="lazy"
          src={movie.poster} alt={movie.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.6s ease, filter 0.6s ease",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            filter: hovered ? "brightness(1)" : "brightness(0.85) saturate(0.9)",
            
          }}
        />

        {/* Scanline overlay */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(transparent, transparent 3px, rgba(0,0,0,.04) 3px, rgba(0,0,0,.04) 4px)",
          mixBlendMode: "overlay",
        }} />

        {/* Bottom gradient */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 50%, transparent 100%)",
          opacity: hovered ? 1 : 0.6, transition: "opacity 0.4s",
        }} />

        {/* Rating badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 10, padding: "4px 8px",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <Star size={10} fill="#a78bfa" color="#a78bfa" />
          <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>{movie.rating}</span>
        </div>

        {/* Genre pill */}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Pill>{movie.genre}</Pill>
        </div>

        {/* Hover: Play button */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(139,92,246,.9)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 30px rgba(139,92,246,.7)",
              }}>
                <Play size={20} fill="white" color="white" style={{ marginLeft: 3 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom info on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "12px 14px",
              }}
            >
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: 10, lineHeight: 1.5, margin: 0,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {movie.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card footer */}
      <div style={{ marginTop: 14, padding: "0 4px" }}>
        <h2 style={{
          fontSize: 14, fontWeight: 800, color: hovered ? "#c4b5fd" : "rgba(255,255,255,.9)",
          margin: "0 0 6px", letterSpacing: "-0.01em",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "color 0.25s",
        }}>{movie.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <Clock size={10} color="#7c3aed" /> {movie.duration}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <Ticket size={10} color="#7c3aed" /> Book Now
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── AI Recommendation Card ─────────────────────────────────── */
const AiPickCard = ({ movie, city, onClick }) => (
  <motion.div
    key={movie._id}
    initial={{ opacity: 0, x: 30, scale: 0.95 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: -30, scale: 0.95 }}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    style={{
      display: "flex", gap: 20, alignItems: "center",
      background: "rgba(255,255,255,.06)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 24, padding: 20, cursor: "pointer",
      width: "100%", maxWidth: 400,
      boxShadow: "0 20px 50px rgba(0,0,0,.3)",
    }}
  >
    <div style={{ position: "relative", flexShrink: 0 }}>
      <img src={movie.poster} alt={movie.title}
        style={{ width: 80, height: 112, borderRadius: 14, objectFit: "cover",
          boxShadow: "0 8px 20px rgba(0,0,0,.4)" }}
      />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 14,
        border: "1px solid rgba(139,92,246,.3)",
      }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <Pill color="#67e8f9"><Sparkles size={9} /> AI Pick</Pill>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", margin: "0 0 6px",
        letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {movie.title}
      </h3>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,.5)", margin: "0 0 10px",
        display: "-webkit-box", WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
        {movie.description}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#67e8f9", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        <MapPin size={10} /> Book in {city} <ChevronRight size={10} />
      </div>
    </div>
  </motion.div>
);

/* ─── Empty State ─────────────────────────────────────────────── */
const EmptyState = ({ city, activeFilter, onReset }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    style={{
      minHeight: 480, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 24,
      borderRadius: 32, border: "1px solid rgba(139,92,246,.15)",
      background: "rgba(139,92,246,.04)", backdropFilter: "blur(8px)",
      padding: 48, textAlign: "center",
    }}
  >
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{
        width: 80, height: 80, borderRadius: "50%",
        border: "2px dashed rgba(139,92,246,.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Sparkles size={32} color="#7c3aed" />
    </motion.div>
    <div>
      <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
        No Signal Found
      </h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", maxWidth: 320, lineHeight: 1.6, margin: "0 auto 24px" }}>
        No <span style={{ color: "#c4b5fd", fontWeight: 700 }}>{activeFilter}</span> results in{" "}
        <span style={{ color: "#fff", fontWeight: 700 }}>{city}</span>.
      </p>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onReset}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 28px", borderRadius: 99,
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          color: "#fff", fontWeight: 800, fontSize: 12,
          border: "none", cursor: "pointer",
          boxShadow: "0 8px 24px rgba(124,58,237,.5)",
          letterSpacing: "0.06em", textTransform: "uppercase",
          fontFamily: "inherit",
        }}
      >
        <RefreshCw size={14} /> Reset Filters
      </motion.button>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Movies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const city = useSelector((state) => state.location.city);
  const { movies, loading } = useSelector((state) => state.movies);
  const searchQuery = useSelector((state) => state.location.searchQuery);

  const [aiPick, setAiPick] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => { dispatch(fetchMovies()); }, [dispatch]);

  const handleAiSuggest = () => {
    setIsThinking(true);
    setTimeout(() => {
      setAiPick(movies[Math.floor(Math.random() * movies.length)]);
      setIsThinking(false);
    }, 1200);
  };

  const filteredMovies = movies.filter((movie) => {
    if (!movie) return false;
    const searchSafe = searchQuery || "";
    const matchesSearch =
      movie.title?.toLowerCase().includes(searchSafe.toLowerCase()) ||
      movie.description?.toLowerCase().includes(searchSafe.toLowerCase());
    const filterSafe = activeFilter || "All";
    const matchesGenre =
      filterSafe === "All" ||
      movie.genre?.toLowerCase() === filterSafe.toLowerCase();
    const isCitySelected = city && city !== "Select Location" && city !== "Location Error";
    const matchesCity =
      !isCitySelected ||
      (city === "Mumbai" ? movie.language === "Hindi"
       : city === "Delhi" ? movie.language === "Hindi"
       : true);
    return matchesSearch && matchesGenre && matchesCity;
  });

  /* ── Loading ── */
  if (loading) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh",
      background: "#080810", gap: 16,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          width: 44, height: 44,
          border: "3px solid rgba(139,92,246,.2)",
          borderTop: "3px solid #7c3aed",
          borderRadius: "50%",
        }}
      />
      <p style={{ color: "rgba(255,255,255,.2)", fontSize: 10, letterSpacing: "0.25em",
        textTransform: "uppercase", fontWeight: 700, fontFamily: "monospace" }}>
        Initializing Cinema
      </p>
    </div>
  );

  /* ── Render ── */
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      color: "#fff",
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Background elements */}
      <GridBackground />
      <Orb style={{ top: "-10%", left: "-5%", width: 500, height: 500, background: "rgba(124,58,237,.12)" }} />
      <Orb style={{ top: "40%", right: "-8%", width: 400, height: 400, background: "rgba(79,70,229,.1)" }} />
      <Orb style={{ bottom: "10%", left: "20%", width: 300, height: 300, background: "rgba(236,72,153,.06)" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        {/* Carousel */}
        <div className="mx-5 my-5" >  
          <MovieCarousel />
        </div>

        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 80px" }}>

          {/* ── AI Section ─────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              margin: "48px 0",
              padding: "48px",
              borderRadius: 32,
              background: "linear-gradient(135deg, rgba(124,58,237,.25) 0%, rgba(79,70,229,.2) 50%, rgba(16,16,30,.8) 100%)",
              border: "1px solid rgba(139,92,246,.2)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 40px 80px -20px rgba(124,58,237,.25), inset 0 1px 0 rgba(255,255,255,.06)",
              position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "row", alignItems: "center",
              justifyContent: "space-between", gap: 40, flexWrap: "wrap",
            }}
          >
            {/* Corner decoration */}
            <div aria-hidden style={{
              position: "absolute", top: 0, right: 0,
              width: 300, height: 300, borderRadius: "0 0 0 100%",
              background: "radial-gradient(circle, rgba(139,92,246,.15), transparent 70%)",
            }} />

            {/* Left */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <Pill color="#67e8f9"><Sparkles size={10} /> Neural Engine</Pill>

              <h2 style={{
                fontSize: 40, fontWeight: 900, margin: "16px 0 12px",
                letterSpacing: "-0.04em", lineHeight: 1.1,
                background: "linear-gradient(135deg, #fff 40%, #c4b5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Find your<br /><span style={{ color: "#a78bfa", WebkitTextFillColor: "#a78bfa" }}>perfect film</span>
              </h2>

              <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.7, maxWidth: 320, marginBottom: 28 }}>
                Our AI scans 100+ shows to match your vibe in{" "}
                <span style={{ color: "#fff", fontWeight: 700 }}>{city}</span>.
              </p>

              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 16px 40px rgba(139,92,246,.5)" }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAiSuggest}
                disabled={isThinking}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "14px 32px", borderRadius: 99,
                  background: isThinking
                    ? "rgba(139,92,246,.3)"
                    : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff", fontWeight: 800, fontSize: 13,
                  border: isThinking ? "1px solid rgba(139,92,246,.3)" : "none",
                  cursor: isThinking ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 24px rgba(124,58,237,.4)",
                  letterSpacing: "0.02em",
                  transition: "all 0.3s ease",
                }}
              >
                {isThinking
                  ? <><RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> Scanning...</>
                  : <><Wand2 size={16} /> Suggest a Movie</>}
              </motion.button>
            </div>

            {/* Right: AI Pick */}
            <AnimatePresence mode="wait">
              {aiPick && !isThinking && (
                <AiPickCard
                  movie={aiPick}
                  city={city}
                  onClick={() => navigate(`/shows/${aiPick._id}`)}
                />
              )}
              {!aiPick && !isThinking && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 12, padding: "32px 48px",
                    border: "1.5px dashed rgba(139,92,246,.2)", borderRadius: 24,
                    color: "rgba(255,255,255,.2)",
                  }}
                >
                  <Eye size={28} color="rgba(139,92,246,.4)" />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Awaiting command…
                  </span>
                </motion.div>
              )}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 200 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2], scaleX: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      style={{
                        height: i === 1 ? 10 : 6, width: i === 1 ? 180 : 120,
                        borderRadius: 99, background: "rgba(139,92,246,.4)",
                      }}
                    />
                  ))}
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,.2)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6 }}>
                    Neural scan active
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* ── Section Header ─────────────────────────────── */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16,
          }}>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <p style={{ fontSize: 11, color: "rgba(139,92,246,.7)", fontWeight: 800,
                letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                Now Showing
              </p>
              <h1 style={{
                fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", margin: 0,
                background: "linear-gradient(135deg, #fff 50%, rgba(255,255,255,.4))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Films in <span style={{ WebkitTextFillColor: "#a78bfa" }}>{city}</span>
              </h1>
            </motion.div>

            <div style={{ color: "rgba(255,255,255,.2)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {filteredMovies.length} Titles Available
            </div>
          </div>

          {/* ── Filter Bar ─────────────────────────────────── */}
          <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <FilterChip
                key={f.label}
                icon={f.icon}
                label={f.label}
                active={activeFilter === f.label}
                accent={f.accent}
                onClick={() => setActiveFilter(f.label)}
              />
            ))}
          </div>

          {/* ── Movie Grid / Empty ──────────────────────────── */}
          {filteredMovies.length === 0 ? (
            <EmptyState city={city} activeFilter={activeFilter} onReset={() => setActiveFilter("All")} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 40, alignItems: "start" }}>

              {/* Sidebar Filters */}
              <div style={{
                position: "sticky", top: 100,
                background: "rgba(255,255,255,.03)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 24, padding: 24,
              }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,.2)", fontWeight: 800,
                  letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20, margin: "0 0 20px" }}>
                  Refine
                </p>
                {["All Ratings", "4.5+", "4.0+", "3.5+"].map(r => (
                  <div key={r} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,.04)",
                    cursor: "pointer", color: "rgba(255,255,255,.4)", fontSize: 12,
                    fontWeight: 700,
                  }}>
                    <span>{r}</span>
                    {r === "All Ratings" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />}
                  </div>
                ))}

                <p style={{ fontSize: 10, color: "rgba(255,255,255,.2)", fontWeight: 800,
                  letterSpacing: "0.2em", textTransform: "uppercase", margin: "24px 0 14px" }}>
                  Language
                </p>
                {["All", "Hindi", "English", "Tamil"].map(l => (
                  <div key={l} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,.04)",
                    cursor: "pointer", color: "rgba(255,255,255,.4)", fontSize: 12,
                    fontWeight: 700,
                  }}>
                    <span>{l}</span>
                    {l === "All" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
                initial="hidden"
                animate="visible"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "28px 20px",
                }}
              >
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onClick={() => navigate(`/shows/${movie._id}`)}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; background: #080810; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,.3); border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default Movies;