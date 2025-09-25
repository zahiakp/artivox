"use client";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdNoEncryptionGmailerrorred } from "react-icons/md";

function page() {
  const [back, setBack] = useState(false);
  return (
   <div className="flex flex-col justify-center items-center w-full text-lg h-full">
      <MdNoEncryptionGmailerrorred className="text-green-600 mb-5 text-6xl" />
      Unauthorized Page..!
      <a href="/" className="p-2 px-4 rounded-lg bg-green-500 mt-4 text-white duration-500"
        onMouseOver={() => setBack(!back && true)}
      >{back ? <FaArrowLeftLong /> : "Go to Back"}</a>
    </div>
  );
}

export default page;
