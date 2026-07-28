// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Movies from "./pages/Movies";
// import Shows from "./pages/Shows";
// import Seats from "./pages/Seats";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Checkout from "./pages/Checkout";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
// <Route path="/checkout/:bookingId" element={<Checkout />} />
//         {/* Protected */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Movies />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/shows/:movieId"
//           element={
//             <ProtectedRoute>
//               <Shows />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/seats/:showId"
//           element={
//             <ProtectedRoute>
//               <Seats />
//             </ProtectedRoute>
//           }
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Login />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;



import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import Seats from "./pages/Seats";
import Payment from "./pages/Payment";
import BookingConfirmed from "./pages/BookingConfirmed";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout/:bookingId" element={<Checkout />} />
        <Route path="/payment/:showId" element={<Payment />} />
        <Route path="/booking-confirmed/:bookingId" element={<BookingConfirmed />} />
        
        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shows/:movieId"
          element={
            <ProtectedRoute>
              <Shows />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seats/:showId"
          element={
            <ProtectedRoute>
              <Seats />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;