import React from "react";
import Modal from "./Modal";

function ResultCard({ close, data}: { close: any; data: any}) {
  const {program,result} = data;
  console.log(result);
  

  return (
    <Modal close={close}>
      <div className="flex flex-col gap-3 md:w-fit max-h-[80%]">
        <div className="flex items-center justify-between -m-10 bg-violet-100 p-10 pb-7 pr-20">
       <div className="flex flex-col items-start justify-between"><p className="uppercase">{program.category}</p>
        <h6 className="font-bold text-3xl w-[70%] text-left uppercase">
          {program.name}
        </h6></div> 
        <div className="flex items-baseline gap-2"><p className="">#result</p>
        <h6 className="font-bold text-8xl w-full text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-700 mt-4">
        {program.order&&program.order}
        </h6></div>
        
        </div>
        <div className="h-5 rounded-lg gap-2 px-3 pr-4 text-white flex bg-gradient-to-r from-pink-400 to-violet-500 mt-4"> 
            </div>
        <div className="flex flex-col gap-3">
        <table className="table">
                          <thead>
                            <tr>
                              <th>Place</th>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Team</th>
                              <th>Grade</th>
                              <th>Point</th>
                            </tr>
                          </thead>
                          <tbody>
                          {result.map((item:any,i:number)=>(
                          <tr key={i} className={`text-[15px] py-2 ${!["1", "2", "3"].includes(item.rank) && "bg-gray-100"}`}>
                                  <th className={``}>
                                    <div className={`rounded-full p-2 text-white flex items-center justify-center h-7 w-7 ${item.rank == "1"? "bg-yellow-600":item.rank=="2"?"bg-gray-600":item.rank=="3"?"bg-orange-600":""}`}>
                                                                    
                                                                {["1", "2", "3"].includes(item.rank)&&item.rank}</div>
                                    </th>
                                  <td className="">{item.code}</td>
                                  <td className="font-bold uppercase">{item.student}</td>
                                  <td className="">{item.campus}</td>
                                  <td className={`font-bold ${item.grade=="N/A"&&"text-red-500"}`}>{item.grade=="N/A"?"No":item.grade}</td>
                                  <td>{item.point}</td>
                                </tr>))}
                          </tbody>
                          </table>
        </div>
      </div>
    </Modal>
  );
}

export default ResultCard;
