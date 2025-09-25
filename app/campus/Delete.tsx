"use client";

import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteAccess, deleteTeam, getAccessbyJamiaNo} from "./func";
import { showMessage } from "../../components/common/CusToast";


 const  DeleteItem = ({ id,fetchCampuses,root }: { id: any,fetchCampuses:any,root:any }) => {
  const router = useRouter();
  
  
  return (
    <button
  onClick={async () => {
    // Confirm deletion
    if (confirm(`Are you sure you want to delete "${id.id}"?`)) {
      try {
        // Get access ID by jamiaNo
        const accessIdResponse = await getAccessbyJamiaNo(id.jamiaNo);
        const accessId = accessIdResponse?.data?.id;

        // Check if accessId is valid
        if (!accessId) {
          toast.error("Access ID not found.");
          return;
        }

        // Delete access
        const deleteAccessResponse = await deleteAccess(accessId);
        if (!deleteAccessResponse) {
          // showMessage("Team Deleted successfully", "success");
          return;
        }

        // Delete campus
        const deleteCampusResponse = await deleteTeam(id.id,root);
        if (deleteCampusResponse) {
          showMessage("Team Deleted successfully","success")
          // router.refresh();
          fetchCampuses()
        } else {
          showMessage("Campus Deleting failed.","error");
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error("Error during deletion:", error);
        showMessage("Something went wrong during deletion.", "error");
      }
    } else {
      showMessage("Deletion canceled.", "info");
    }
  }}
  className="text-red-500 bg-red-50 rounded-md p-2"
>
  <MdDeleteOutline className="text-lg cursor-pointer" />
</button>
  );
};

export default DeleteItem;
