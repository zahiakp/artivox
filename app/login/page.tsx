"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Image from "next/image";
import { showMessage } from "../../components/common/CusToast";
import { brandLogo, brandName } from "../data/branding";

function page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["access"]);
  const [type,setType]=useState(false)
  const handleLogin = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    // const q = query(
   

    try {
      const response=await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      
  
     
      if (result.success) {
        setCookie("access", result.data, { path: "/" });
              router.push("/");
      } else {
        throw new Error(result.message);
      }
    } catch (error:any) {
      setLoading(false)
      showMessage(error.message,"error")
      }
  };



  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <p className="text-3xl font-semibold text-primary-600 mb-10">{brandName || "Event Pro"}</p>
      <form
      onSubmit={handleLogin}
      className="bg-white p-10 rounded-3xl flex gap-5 overflow-hidden abq-card"
    ><div className="hidden w-44 bg-gradient-to-b from-primary-100 to-primary-300 md:flex items-center justify-center rounded-l-2xl -my-7 -ml-7">
      <div className="h-28 w-28 bg-primary-50 rounded-full flex items-center justify-center">
        <Image alt='' src={brandLogo || '/eventpro-logo.png'} width={90} height={90}/>
        </div>
        </div>
      <div className="form-not flex flex-col items-center gap-3">
        <h1 className="font-bold text-primary-600 text-xl bg-primary-100 p-2 rounded-lg w-full text-center">
          Login
        </h1>
        <div>
          <input
            className="input input-bordered w-full max-w-xs rounded-lg mt-3"
            type="text"
            placeholder="Username"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
        </div>

       <div className="relative">
          <input
            className="input input-bordered w-full max-w-xs rounded-lg"
            type={type?"text":"password"}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            className="absolute top-1/2 -translate-y-[8px] right-4 text-lg"
            onClick={() => setType(!type)}
            type="button"
          >
            {!type ? (
              <IoMdEye className="text-gray-300" />
            ) : (
              <IoMdEyeOff className="text-primary-500" />
            )}
          </button>
        </div>
        <button
          className="w-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg text-white font-bold p-3 flex justify-center items-center"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>{" "}
              Verifying...
            </>
          ) : (
            "login"
          )}
        </button>
      </div>
    </form>
    <p className="mt-8 text-gray-400 text-xs">event pro - v1.0</p>
    </div>
  );
}

export default page;
