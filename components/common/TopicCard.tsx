import { useState } from "react";
import Modal from "./Modal";
import { IoIosArrowDropdownCircle } from "react-icons/io";

export function TopicCard({close, view ,fetch}:{close:any,view:any,fetch:any}) {
  const [loading, setLoading] = useState(false);
  const { program,topics } = view;
  const [drop,setDrop]= useState<any>();

  return (
    <Modal close={close} className="">
      <div className="flex flex-col gap-3 max-w-80">
        <h6 className="font-bold text-2xl mb-3 w-full text-center">
          {program.name}
        </h6>
        <div className="grid grid-cols-1 gap-2">
            {topics.map((topic:any,i:number)=>(
                <div className="p-3 flex flex-col items-center min-w-60 bg-zinc-100 rounded-xl transition-all duration-300" key={i}>
                  <div className="flex w-full items-center">
                    <p className="flex-1 line-clamp-1">{topic.topic}</p>
                    <div  className="p-2 ml-2 rounded-lg bg-primary-100"><IoIosArrowDropdownCircle onClick={()=>setDrop(drop==i?!drop:i)} className={`${drop==i&& 'rotate-180 '}duration-300 text-primary-500 text-xl`}/></div>
                  </div>
                  <div className={`overflow-hidden w-full transition-all duration-300 ${drop==i ? 'max-h-40' : 'max-h-0'}`}>
                    <p className="text-2xl w-full border-t border-zinc-400 mt-2 p-3">{topic.topic}</p>
                  </div>
                </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}
