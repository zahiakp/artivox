"use client";

import { useRouter } from "next/navigation";
import { deleteProgram } from "./func";
import IconTrashLines from "../../components/icon/icon-trash-lines";
import { showMessage } from "../../components/common/CusToast";


 const  DeleteItem = ({ id,root,fetchPrograms }: { id: any,root:any ,fetchPrograms:any}) => {
  const router = useRouter();
  
  
  return (
    <button
  onClick={async () => {
    // Confirm deletion
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      try {
        
        const deleteCampusResponse = await deleteProgram(id,root);
        if (deleteCampusResponse) {
          showMessage("Program Deleted successfully","success");
          // router.refresh();
          fetchPrograms()
        } else {
          showMessage("Program Deleting failed.","error");
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
  className="text-red-500 bg-red-50 rounded-md p-2"
>
  <IconTrashLines className="text-lg cursor-pointer" />
</button>
  );
};

export default DeleteItem;
