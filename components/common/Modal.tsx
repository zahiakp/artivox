"use client"
import { IoMdClose } from "react-icons/io";

function Modal({children,close,edit,className}:{children:any;close:any;edit?:any;className?:any}) {
    return (
      <div className="fixed w-full h-screen bg-zinc-900/50 bg-opacity-70 top-0 left-0 flex justify-center items-center z-20">
          <div className="relative w-[90%] md:w-fit md:min-w-[400px] sm:min-w-9/12 md:min-w-1/4  rounded-xl bg-white shadow-md p-10 max-h-[700px] overflow-y-auto">
          <IoMdClose className="absolute z-10 right-7 top-7 p-1 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 duration-300 rounded-lg text-3xl cursor-pointer" onClick={()=>edit ? close() : close(false)}/>
  {children}
          </div>
      </div>
    )
  }
  
  export default Modal
  