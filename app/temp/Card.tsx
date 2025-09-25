// // components/Card.js
// import React from 'react';
// import QRCode from 'react-qr-code';

// const Card = ({ item }:any) => {
//   return (
//     <div
//       className="bg-white h-[321.25984252px] w-[207.87401575px] flex flex-col items-center relative overflow-hidden border border-white"
//       style={{ aspectRatio: "207.87401575/321.25984252" }}
//       key={item.jamiaNo}
//     >
//       <img
//         src="qr-card.jpg"
//         alt=""
//         className="absolute top-0 h-full right-0 left-0"
//       />
//       <div className="absolute top-1/2 -translate-y-[100px]">
//         <div
//           className="w-[127px] mx-auto p-1 my-4"
//           style={{ aspectRatio: "1/1" }}
//         >
//           <QRCode
//             size={350}
//             style={{ height: "auto", maxWidth: "100%", width: "100%" }}
//             value={item.jamiaNo}
//             viewBox="0 0 50 50"
//           />
//         </div>

//         <div className="text-center my-2 px-5 text-lg mt-3 font-semibold p-1 rounded-xl bg-orange-300/50">
//           <h4>{item.jamiaNo}</h4>
//         </div>
//         <div className="text-center mt-1 font-semibold">
//           <h4>{item.campus}</h4>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;