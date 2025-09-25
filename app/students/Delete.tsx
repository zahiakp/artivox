"use client";

import { useRouter } from "next/navigation";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { LuFileEdit } from "react-icons/lu";
import { deleteStudent } from "./func";
import { showMessage } from "../../components/common/CusToast";


 const  DeleteItem = ({ id, fetchAllStudents}: { id: any, fetchAllStudents:any}) => {
  const router = useRouter();
  
  
  return (
    <button
  onClick={async () => {
    // Confirm deletion
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      try {
        
        const deleteCampusResponse = await deleteStudent(id);
        if (deleteCampusResponse) {
          showMessage("Student Deleted successfully","success");
          // router.refresh();
          fetchAllStudents();
        } else {
          showMessage("Student Deleting failed","error");
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error("Error during deletion:", error);
        showMessage("Something went wrong during deletion","error");
      }
    } else {
      showMessage("Deletion canceled","error");
    }
  }}
  className="text-red-500 bg-red-50 rounded-md p-2"
>
  <MdDeleteOutline className="text-lg cursor-pointer" />
</button>
  );
};

export default DeleteItem;
