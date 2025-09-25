import { showMessage } from "./CusToast";
import { useRouter } from "next/navigation";
import { UpdateProgramStatus } from "../../app/programs/func";
import { useCookies } from "react-cookie";
import { useState } from "react";

function Confirm({
  close,
  type,
  program,fetch
}: {
  close: any;
  type: any;
  program: any;fetch:any
}) {
  const router = useRouter();
  const [cookies] = useCookies(["access"]);
const [userRole, setUserRole] = useState(cookies?.access?.role);
  const proEndpoint = (userRole === "admin" || userRole === "campus"||userRole==='report'||userRole==='announce') ? "programs" : (userRole === "zoneAdmin" || userRole === "zonecampus") ? "zoneprograms" :(userRole === "campusAdmin" || userRole === "Group") ? "campusprograms" : "";
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-xl text-center">
          Are you confirm to {type} &#39;{program.name}&#39;
        </h3>
        <div className="modal-action">
          <form method="dialog">
            <div className="grid grid-cols-2 items-center gap-3">
              <button
                className="btn  bg-gradient-to-r from-red-400 to-red-600 md:w-56 text-white shadow-lg hover:shadow-none duration-300"
                onClick={() => close()}
              >
                Close
              </button>
              <button
                className="btn shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 md:w-56 w-36 text-white hover:shadow-none duration-300"
                onClick={async () => {
                  try {
                    const resp = await UpdateProgramStatus(program.id, type,proEndpoint);
                    if (resp) {
                      // router.refresh();
                      showMessage(
                        `${program.name} status changed successfully`,
                        "success"
                      );
                      close();
                      fetch && fetch()
                    } else {
                      showMessage(`Error updating status`, "error");
                      console.log("Error updating status");
                    }
                  } catch (error: any) {
                    console.log(error);
                    showMessage(`${error.message}`, "error");
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default Confirm;
