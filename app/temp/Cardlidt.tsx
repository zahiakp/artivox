"use client";
import React, { useEffect, useRef, useState } from "react";
import { qr } from "../utils/qr";
import { useCookies } from "react-cookie";
import html2canvas from "html2canvas";
import Card from "../../components/common/Card";
import { brandName } from "../data/branding";

function page() {
  const [cookies] = useCookies();
  const [campus, setCampus] = useState();
  const [categories, setCategories] = useState();
  const [cardData,setCardData]=useState<any>()
  useEffect(() => {
    setCampus(cookies[`${brandName}-access`]?.name || "");
    setCategories(cookies[`${brandName}-access`]?.categories || []);
  }, []);
  const formRef:any = useRef(null);
  function handleSubmit(e:any) {
    e.preventDefault();
    const name = formRef.current.name.value;
    const jamiaNo = formRef.current.jamiaNo.value;
    const campus = formRef.current.campus.value;
    const category = formRef.current.category.value;
     setCardData({name,jamiaNo,campus,category})

   
  }
  return (
    <div className="h-full">
      {/* {qr.map((item,index)=>(
        <Card item={item} key={index}/>
      ))} */}
       <Card data={""}/> 
       {/* :  <div className=" my-2 lg:w-1/3 md:2/3 w-full  bg-zinc-100 shadow-md px-4 rounded-md py-3 ">
        <h2 className="text-3xl font-bold text-center mb-2">ID Card</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit} ref={formRef}>
          <input type="text" placeholder="jamiaNo" name="jamiaNo" required/>
          <input type="text" placeholder="name" name="name" required/>
          <select name="category" id="category" className="h-10 rounded-md" required>
            <option value="">Category</option>
            {categories?.map((cat) => (
              <option value={cat.label}>{cat.label}</option>
            ))}
          </select>
          <input type="text" name="campus" readOnly value={campus} required/>
          <button className="bg-green-600 hover:opacity-90 active:scale-90 px-3 py-2 w-max text-white rounded-md mx-auto">
            GET ID
          </button>
        </form>
      </div> */}
      
     
    </div>
  );
}

export default page;