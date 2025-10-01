import { useCookies } from "react-cookie";
import React ,{useContext} from 'react'
import { useRouter } from "next/navigation";
import { brandName } from "../../app/data/branding";

function Logout({close}:{close:any}) {
    const router = useRouter()
    const [cookies,setCookie,removeCookie]=useCookies([`${brandName}-access`])
    const { role, categories } = cookies[`${brandName}-access`] || {};
  return (
    <dialog id="my_modal_1" className="modal modal-open">
  <div className="modal-box z-10">
    <h3 className="font-bold text-xl text-center text-black">Are you ready to logout</h3>
    <div className="modal-action">
      <form method="dialog">
        <div className='grid grid-cols-2 gap-3'><button className="btn shadow-lg hover:shadow-sm duration-300 bg-gradient-to-r from-red-400 to-red-600 mr-5 md:w-56 w-[90%] text-white" onClick={()=>close(false)}>Close</button>
        <button className="btn shadow-lg cursor-pointer hover:shadow-sm duration-300 bg-gradient-to-r from-green-400 to-green-600 md:w-56 w-36 text-white" onClick={()=>{
          removeCookie(`${brandName}-access`,{path:'/'});
        //   categories?.map(async (item: any) => {
        //   localStorage.removeItem(item.id)
        // });
          router.push('/login');

        }}>Logout</button></div>
      </form>
    </div>
  </div>
</dialog> 
  )
}

export default Logout
