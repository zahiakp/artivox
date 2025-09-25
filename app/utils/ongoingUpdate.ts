import { toast } from "react-toastify";

export const ongoingUpdate=async(participant:any,program:any,type:any,setParticipants:any,setLoading:any)=>{
    try {
        setLoading(true);
        const response = await fetch("/api/programList/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            participant,
            program
          }),
        });
        const status = await response.json();
        if (status.success) {
            const data=status.data.filter((item:any)=>item.student!='' &&item.code!=null )
            setParticipants(data)
          return toast.success(
            `${participant.student} status changed successfully`,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1000,
              
            } 
          );
        } else {
          throw new Error(`${participant.student} status changing failed`);
        }
      } catch (error:any) {
        console.log(error);
        return toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      } finally {
        setLoading(false);
      }
}