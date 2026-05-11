


import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Search, MapPin } from 'lucide-react'; 
import { useDispatch, useSelector } from "react-redux"; 
import { setCity, setSearchQuery } from "../Redux/locationSlice"; 

const Navbar = () => {
  const dispatch = useDispatch();
      // const { movies } = useSelector((state) => state.movies);
      const searchQuery = useSelector((state) => state.location.searchQuery);




  // ***Using Redux state for city instead of local useState
  const city = useSelector((state) => state.location.city);
  
  // const [input, setInput] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  const handleInput = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };
//**search movie from navbar */


// const filterMovieData=movies.filter((item)=>{
//   return item.title.toLowerCase().includes(input?.toLowerCase())||item.description.toLowerCase().includes(input?.toLowerCase())
// })
// console.log("filterMovieData",filterMovieData)  
// **
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const detectedCity = data.address.city || data.address.town || data.address.state;
        
        // Dispatch to Redux so all components (Movies.js, etc.) see the change
        dispatch(setCity(detectedCity));
      } catch (error) {
        console.error("Location error:", error);
        dispatch(setCity("Location Error"));
      } finally {
        setIsDetecting(false);
      }
    });
  };

  return (
    <div className="flex justify-around items-center h-20 bg-white shadow-sm border-b border-violet-100 px-4">
      {/* Logo Section */}
      <div className="flex items-center h-full">
        <img className="h-12 w-auto object-contain cursor-pointer" src={logo} alt="CineBook Logo" />
      </div>

      {/* Search Bar - Aesthetic Update */}
      <div className="group w-1/3 h-11 rounded-full bg-violet-50 border border-violet-100 flex items-center px-4 transition-all focus-within:border-violet-400 focus-within:bg-white focus-within:shadow-md">
        <Search className="text-violet-400 group-focus-within:text-violet-600 cursor-pointer" size={18}/>
        <input
          className="w-full h-full px-3 outline-none bg-transparent font-sans text-sm text-slate-700 placeholder:text-slate-400"
          type="search"
          value={searchQuery}
          placeholder="Search for movies, events, plays..."
          onChange={handleInput}
        />
      </div>

      {/* Right Side Items */}
      <div className="flex items-center gap-8">
        {/* Central Location Dropdown */}
        <div className="flex items-center text-violet-700 gap-1 group">
          <MapPin size={16} className="text-violet-500" />
          <select 
            className="bg-transparent border-none outline-none font-semibold text-sm cursor-pointer hover:text-violet-900 transition-colors"
            onChange={(e) => e.target.value === "detect" ? detectLocation() : dispatch(setCity(e.target.value))}
            value={city}
          >
            <option value={city}>{isDetecting ? "Detecting..." : city}</option>
            <option value="detect" className="font-bold text-violet-600">📍 Detect My Location</option>
            <option disabled className="text-slate-300">──────────</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {/* Professional Sign In Button */}
        <button className="bg-violet-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 active:scale-95">
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Navbar;