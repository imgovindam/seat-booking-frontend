// import React from "react";

// import { useEffect } from "react";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useDispatch , useSelector} from "react-redux";
// // featchSeats from "../Redux/seatSlice";
// import { fetchSeats,bookSeat,unbookSeat } from "../Redux/seatSlice";

// const GetSeat = () => {
//   const [seats, setSeat] = useState([]);
//   const dispatch = useDispatch();
// const { seats, loading } = useSelector((state) => state.seats);

//   const handleToggleSeatBookUnbook = (id, isBooked) => {
//     if (isBooked) {
//       unBookSeat(id);
//     } else {
//       handleBook(id);
//     }
//   };

// useEffect(() => {
//   dispatch(fetchSeats());
// }, []);

//   const fetchSeats = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/api/seats");
//       const data = await response.json();
//       setSeat(data.seats);
//     } catch (err) {
//       toast.error("Error fetching seats:", err);
//     }
//   };

//   //   useEffect(() => {
//   //    fetchSeats();
//   // }, []);

//   async function handleBook(id) {
//     try {
//       const response = await fetch("http://localhost:8000/api/seats/book", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({ seatId: id }),
//         // Body: { seatId: id },
//       });

//       const data = await response.json();
//       // console.log(data);
//       toast.success(data.message);
//       fetchSeats();
//     } catch (err) {
//       toast.error("Error booking seat:", err);
//     }
//   }

//   const unBookSeat = async (id) => {
//     try {
//       const response = await fetch("http://localhost:8000/api/seats/unbook", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ seatId: id }),
//       });
//       const data = await response.json();
//       toast.success(data.message);
//       fetchSeats();
//     } catch (err) {
//       toast.error("Error unbooking seat:", err);
//     }
//   };

//   //   const seatUnbook=async(id)=>{
//   //     try{
//   // const response=await fetch("http://localhost:8000/api/seats/unbook",{
//   //   method:"patch",{
//   //     headers:{
//   //       "content-Type":"application/json"
//   //     },
//   //     body:JSON.stringify({seatId:id})
//   //   });
//   //   const data=await response.json()
//   //   toast.success(data.message);
//   //   fetchSeats();

//   //     }catch(err){
//   // toast.error("Error unbooking seat:",err);
//   //     }

//   //   }
//   // }

//   // console.log(seats);
//   return (
//     // <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 60px)", gap: "10px" }}>
//     <div className="grid grid-cols-3 gap-4 p-10">
//       <Toaster position="top-center" reverseOrder={false} />
//       {seats.map((seat) => (
//         <div className="flex justify-center items-center">
//           <button
//             onClick={() => handleToggleSeatBookUnbook(seat._id, seat.isBooked)}
//             className={`p-8 rounded-3xl border-2 cursor-pointer text-amber-900 flex justify-center items-center
//     ${seat.isBooked ? "bg-gray-400" : "bg-orange-400 hover:bg-orange-600"}
//   `}
//           >
//             {seat.row}-{seat.col}
//           </button>

//         </div>
//       ))}
//     </div>
//   );
// };

// export default GetSeat;

import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeats, bookSeat, unbookSeat } from "../Redux/seatSlice";

const GetSeat = () => {
  const dispatch = useDispatch();
  const { seats, loading } = useSelector((state) => state.seats);

  useEffect(() => {
    dispatch(fetchSeats());
  }, [dispatch]);

  const handleToggle = async (id, isBooked) => {
    if (isBooked) {
      await dispatch(unbookSeat(id));
      toast.success("Seat unbooked");
    } else {
      await dispatch(bookSeat(id));
      toast.success("Seat booked");
    }
    dispatch(fetchSeats());
  };

  if (loading) return <p>Loading seats...</p>;

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold underline text-center p-5">
          Seat Booking System
        </h1>
        {/* <div><img src=""/></div> */}

        <div className="p-5">
          <p className="bg-gray-400 border h-6 flex items-center justify-center rounded-2xl hover:bg-amber-300 cursor-pointer">SCREEN</p>
          {/* <p className="text-center text-lg">Click on a seat to book or unbook it.</p> */}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 p-10">
        <Toaster position="top-center" reverseOrder={false} />
        {seats.map((seat) => (
          <div className="flex justify-center items-center">
            <button
              onClick={() => handleToggle(seat._id, seat.isBooked)}
              className={`p-8 rounded-3xl border-2 cursor-pointer text-white flex justify-center items-center
    ${seat.isBooked ? "bg-[#FF0000]" : "bg-[#000080] hover:bg-[#0000CD]"}
  `}
            >
              {seat.row}-{seat.col}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetSeat;
