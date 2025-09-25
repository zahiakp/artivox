"use client";

import { useRouter } from "next/navigation";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LuFileEdit } from "react-icons/lu";
import { deleteParticipant} from "./func";
import IconTrashLines from "../../components/icon/icon-trash-lines";
import { showMessage } from "../../components/common/CusToast";


 const  DeleteParticipant = ({ id, fetchPrograms,close,root}: { id: any ,fetchPrograms:any,close:any,root:any}) => {
  const router = useRouter();
  
  
  return (
    <button
  onClick={async () => {
    // Confirm deletion
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      try {
        
        const deleteCampusResponse = await deleteParticipant(id,root);
        if (deleteCampusResponse) {
          showMessage("participant Deleted successfully","success")
          // router.refresh();
          fetchPrograms()
          close(false)
        } else {
          showMessage("participant Deleting failed.","error");
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error("Error during deletion:", error);
        showMessage("Something went wrong during deletion.","error");
      }
    } else {
      showMessage("Deletion canceled.","error");
    }
  }}
  className="text-white p-2 rounded-lg shadow-lg bg-gradient-to-tr from-red-500 to-red-400"
>
  <IconTrashLines className=" cursor-pointer text-xl" />
</button>
  );
};

export default DeleteParticipant;
