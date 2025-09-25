import { toast } from "react-toastify";

export const report = async (participant:any, setLoading:any, close:any, program:any,setParticipants:any) => {
  try {
    setLoading(true);
    const response = await fetch("/api/programList/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "reported",
        participant,
        program,
      }),
    });
    const status = await response.json();
    if (status.success) {
        setParticipants(status.data.filter((item:any)=>item.student!==''&&item.status=='not reported'))
      return toast.success(
        `${participant.student} status changed successfully`,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          onClose: () => {
            close(false);
          },
        }
      );
    } else {
      throw new Error(`${participant.student} status changing failed`);
    }
  } catch (error:any) {
    return toast.error(error.message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });
  } finally {
    setLoading(false);
  }
};
