import { showMessage } from "./CusToast";

function DeleteItem( close:any, collectionName:any,props:any ) {
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box min-h-40">
        <h3 className="font-bold text-xl text-center">
          Are you confirm to Delete &#39;{props.name}&#39;
        </h3>
        <div className="modal-action">
          <form method="dialog">
            <div className="flex items-center">
              <button className="btn mr-5 md:w-56" onClick={() => close()}>
                Close
              </button>
              <button
                className="btn btn-error md:w-56 w-36 text-white"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/delete", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        collectionName,
                        id: props.id || props.jamiaNo,
                      }),
                    });
                    const status=await response.json()
                    if (!status.success) {
                      throw new Error("Deleting failed.");
                      
                    } else {
                      return showMessage(`${collectionName} deleted successfully`,"success");
                    }
                  } catch (error:any) {
                    console.log(error);
                    showMessage(`${error.message}`,"error");
                  }
                }}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default DeleteItem;
