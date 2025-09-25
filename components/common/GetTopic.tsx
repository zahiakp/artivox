import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { IoMdAddCircle } from "react-icons/io";
import ParticipantForm from "./ParticipantForm";
import { TbUserScan } from "react-icons/tb";
import CameraCapture from "./CameraCapture";
import { assignCode } from "../../app/utils/assignCode";
import { ongoingUpdate } from "../../app/utils/ongoingUpdate";

function GetTopic({ close, data }:{close:any, data:any}) {
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState(false);
  // const { topic,index } = data;
  const [participant, setParticipant] = useState(data.participant);
  
  console.log("topic",data);
  
  return (
    <Modal close={close} >
      <div
        className="flex flex-col gap-3 mt-10"
        >
          
            {/* {data && <h6 className="font-bold">Topic: {1}</h6>} */}
    <p className={`text-xl font-semibold ${data.lang}`}>{data.topic}</p>
            
          
        
       
        
      </div>
      
    </Modal>
  );
}

export default GetTopic;
