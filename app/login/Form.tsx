// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCookies } from "react-cookie";
// import { IoMdEye, IoMdEyeOff } from "react-icons/io";
// import Image from "next/image";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { showMessage } from "../component/CusToast";
// import { LoginFunc } from "./func";


// function Form() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [cookies, setCookie] = useCookies(["access"]);
//   const [type, setType] = useState(false);

//   const validationSchema = Yup.object().shape({
//     username: Yup.string().required("Username Required"),
//     password: Yup.string().required("Password is required").min(5, "Password must be at least 5 characters"),
//   });
//   const formik = useFormik({
//     initialValues: {
//       username: "admin",
//       password:"admin",
//     },

//     onSubmit: async (values: any) => {
//       setLoading(true);
//       try {
//         const resp:any = await LoginFunc(values);
//         if (resp.success) {
//           console.log(resp.data);
          
//           setCookie("access", resp.data.role, { path: "/" });
//           router.push("/");
//         } else {
//           showMessage(resp.message, "error");
//           console.log(resp.message);
//         }
//       } catch (error: any) {
//         showMessage("An error occurred. Please try again later.", "error");
//         // toast.error("An error occurred. Please try again later.");
//         console.error("Error:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     ,
//     validationSchema: validationSchema,
//   });
//   return (
//     <div className="flex justify-center items-center h-full w-full">
//     <form
//       onSubmit={formik.handleSubmit}
//       className="bg-white p-10 rounded-3xl flex gap-5 overflow-hidden abq-card"
//     ><div className="w-44 bg-gradient-to-b from-pink-100 to-pink-300 flex items-center justify-center rounded-l-2xl -my-7 -ml-7"><div className="h-28 w-28 bg-pink-50 rounded-full flex items-center justify-center"><Image alt='' src={'/user-prof.webp'} priority width={50} height={50}/></div></div>
//       <div className="form-not flex flex-col items-center gap-3">
//         <h1 className="font-bold text-pink-600 text-xl bg-pink-100 p-2 rounded-xl w-full text-center">
//           Login
//         </h1>
//         <div>
//           {/* <input
//             className="input input-bordered w-full max-w-xs rounded-xl mt-3"
//             type="text"
//             placeholder="Username"
//             required
//             onChange={(e) => {
//               setUsername(e.target.value);
//             }}
//             value={username}
//           /> */}
//           <input
//       className={`input input-bordered w-full max-w-xs rounded-xl mt-3 ${formik.errors["username"] && formik.touched["username"] ? "focus:outline-red-500 border-red-500":"border-gray-300"}`}
//       placeholder="Username"
//       onChange={formik.handleChange}
//       value={formik.values.username}
//       name="username"
//     />
//         </div>

//         <div className="relative">
//           <input
//       className={`input  input-bordered w-full max-w-xs rounded-xl mt-3 ${formik.errors["password"] && formik.touched["password"] ? "focus:outline-red-500 border-red-500":"border-gray-300"}`}
//       type={type ? "text" : "password"}
//             placeholder="Password"
//             onChange={formik.handleChange}
//       value={formik.values.password}
//       name="password"

//           />
//           <button
//             className="absolute top-1/2 -translate-y-[4px] right-4 text-lg"
//             onClick={() => setType(!type)}
//             type="button"
//           >
//             {!type ? (
//               <IoMdEye className="text-gray-300" />
//             ) : (
//               <IoMdEyeOff className="text-pink-500" />
//             )}
//           </button>
//         </div>
//         <button
//           className="w-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl text-white font-bold p-3 flex justify-center items-center"
//           disabled={loading}
//           type="submit"
//         >
//           {loading ? (
//             <>
//               <svg
//                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>{" "}
//               Verifying...
//             </>
//           ) : (
//             "login"
//           )}
//         </button>
//       </div>
//     </form>
//     {/* <Form/> */}
//   </div>
//   )
// }

// export default Form
