import React, { useState, useEffect } from "react";

const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
      title: "Inception",
      description: "Your mind is the scene of the crime. Experience the dream within a dream.",
    },
    {
      url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
      title: "Interstellar",
      description: "Mankind was born on Earth. It was never meant to die here.",
    },
    {
      url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
      title: "The Dark Knight",
      description: "Why so serious? The legend ends in Gotham City.",
    },
    {
      url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2037&auto=format&fit=crop",
      title: "Spider-Man: Across the Multiverse",
      description: "Anyone can wear the mask. It's how you wear it that counts.",
    },
    {
      url: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1935&auto=format&fit=crop",
      title: "Avatar: The Way of Water",
      description: "Return to Pandora. The ocean is calling.",
    }
  ];

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    // <div className="relative p-10  w-full h-[400px] overflow-hidden group bg-black">
    //   {/* Background Image with Violet Overlay */}
    //   <div
    //     style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
    //     className="w-full rounded-4xl h-full bg-center bg-cover duration-700 ease-in-out transition-all"
    //   >
    //     {/* Violet Gradient Overlay for Aesthetic Theme */}
    //     <div className="absolute inset-0 bg-gradient-to-r from-violet-950/80 via-violet-900/40 to-transparent"></div>
    //   </div>

    //   {/* Content Overlay */}
    //   <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24 text-violet-100">
    //     <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
    //       {slides[currentIndex].title}
    //     </h2>
    //     <p className="text-lg md:text-xl max-w-xl text-cyan-50/80 mb-8 font-light italic">
    //       "{slides[currentIndex].description}"
    //     </p>
        
    //     <div className="flex gap-4">
    //       <button className="bg-violet-600 cursor-pointer hover:bg-violet-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)] active:scale-95">
    //         Book Now
    //       </button>
    //       <button className="backdrop-blur-md cursor-pointer bg-white/10 border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-all">
    //         Watch Trailer
    //       </button>
    //     </div>
    //   </div>

    //   {/* Dot Indicators */}
    //   <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
    //     {slides.map((_, index) => (
    //       <div
    //         key={index}
    //         onClick={() => setCurrentIndex(index)}
    //         className={`h-2 rounded-full transition-all cursor-pointer ${
    //           currentIndex === index ? "w-8 bg-cyan-400" : "w-2 bg-white/50"
    //         }`}
    //       ></div>
    //     ))}
    //   </div>
    // </div>


    <div className="grid w-full h-[400px] p-4 rounded-2xl overflow-hidden  bg-violet-900">
      {/* 1. THE IMAGE (Layer 0) */}
      <div 
        className="col-start-1 rounded-4xl row-start-1 w-full h-full bg-cover bg-no-repeat bg-center transition-all duration-1000 ease-in-out "
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      >
        {/* Violet Gradient Overlay */}
        <div className="w-full h-full bg-linear-to-r from-violet-950/90 via-violet-900/30 to-transparent" />
      </div>

      {/* 2. THE CONTENT (Layer 1) */}
      <div className="col-start-1 row-start-1 flex flex-col justify-center px-12 md:px-24 text-violet-100 self-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-xl">
          {slides[currentIndex].title}
        </h2>
        <p className="text-lg md:text-xl max-w-lg text-violet-100/70 mb-8 font-light  italic">
          {slides[currentIndex].description}
        </p>
        <div className="flex gap-4">
          <button className="bg-violet-600 cursor-pointer hover:bg-violet-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95">
            Book Now
          </button>
          <button className="bg-white/10 cursor-pointer backdrop-blur-md border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all">
            Watch Trailer
          </button>
        </div>
      </div>

      {/* 3. THE DOTS (Layer 2) */}
      <div className="col-start-1 row-start-1 flex justify-center items-end pb-8 gap-2 pointer-events-none">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all pointer-events-auto cursor-pointer ${
              currentIndex === index ? "w-8 bg-cyan-400" : "w-2 bg-white/40"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;