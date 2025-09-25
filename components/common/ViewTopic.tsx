import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { IoIosArrowDropdownCircle, IoMdAddCircle } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { showMessage } from "./CusToast";
import { addStudent, editStudent } from "../../app/students/func";
import { useFormik } from "formik";
import * as Yup from "yup";
import { WSelectAuto } from "./Form";
import { addTopics, editTopics } from "../../app/topics/func";
import { MdDelete } from "react-icons/md";
import { DeleteTopic } from "../../app/topics/DeleteTopic";

export function ViewTopic({close, view ,fetch}:{close:any,view:any,fetch:any}) {
  const [loading, setLoading] = useState(false);
  const { program,topics } = view;
  const [drop,setDrop]= useState<any>();
  console.log("view",view);
  console.log(fetch);
  
  
  // const [topics, setTopics] = useState(edit ? edit.map((item:any)=>item.topic): [""])
  // const [lang,setLang]=useState(edit ? edit[0].lang  :'')

//   const validationSchema = Yup.object().shape({
//     lang: Yup.string().required("language Required"),
//     topics: Yup.array().of(Yup.string().required("Topic Required")).min(1, "At least one topic is required"),
//   });
// const formik = useFormik({
//    initialValues: {
//      program: edit? program.id : data.program.id,
//      lang: "",
//      topics:[''],
//    },
//    onSubmit: async (values: any) => {
//      setLoading(true);
//      try {
//       if (edit) {
//         await Promise.all(
//           values.topics.map(async (topic: any, i: number) => {
//             if (topics[i]) {
//               await editTopics(topics[i].id, { ...values, topic });
//               console.log("Updated:", topics[i].id, { ...values, topic });
//             }
//           })
//         );
//         if (values.topics.length > topics.length) {
//           const newTopics = values.topics.slice(topics.length);
//           await Promise.all(
//             newTopics.map(async (topic: any) => {
//               await addTopics({ ...values, topic });
//               console.log("Added:", { ...values, topic });
//             })
//           );
//         }
    
//         showMessage("Topics updated successfully", "success");
//       } else {
//         // Add new topics
//         await Promise.all(
//           values.topics.map(async (topic: any) => {
//             await addTopics({ ...values, topic });
//             console.log("Added:", { ...values, topic });
//           })
//         );
    
//         showMessage("Topics added successfully", "success");
//       }
    
//       // Refresh data and close modal after all operations are completed
//       fetch();
//       close();
//     } catch (error: any) {
//       showMessage("An error occurred. Please try again later.", "error");
//       console.error("Error:", error.message);
//     } finally {
//       setLoading(false);
//     }
    
//    },
//    validationSchema: validationSchema,
//  });
//   useEffect(() => {
//       if (edit) {
//         formik.setValues({
//         program: program.id,
//         lang: topics[0]?.lang || "",
//         topics: topics.map((topic: any) => topic.topic),
//         });
//       }
//     }, [edit]);
  // const handleSubmit = async (event:any) => {
  //   event.preventDefault();
  //   setLoading(true);

  //   const formData = {
  //     topics,programId:program.id,lang,edit:edit?.map((item:any)=>item.id)
  //   };
    

  //   try {
  //     const response = await fetch("/api/topics/update", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ ...formData }),
  //     });
  //     const status = await response.json();

  //     if (!status.success) {
  //       throw new Error(
  //          "Failed updating Topic"
  //       );
  //     } else {
  //       showMessage("Topic updated successfully.","success")
  //       close(false);
  //       fetch()
  //     }
  //   } catch (error:any) {
  //     return showMessage(`${error.message}`,"error")
  //   }
  // };

  return (
    <Modal close={close} className="max-w-80">
      <div className="flex flex-col gap-3">
        <h6 className="font-bold text-2xl mb-3 w-full text-center">
          {program.name}
        </h6>
        <div className="grid grid-cols-1 gap-2">
            {topics.map((topic:any,i:number)=>(
                <div className="p-3 flex flex-col items-center min-w-60 bg-zinc-100 rounded-xl transition-all duration-300" key={i}>
                  <div className="flex w-full items-center">
                    <p className="flex-1 line-clamp-1">{topic.topic}</p>
                    <DeleteTopic close={close} fetchPrograms={fetch} id={topic.id} />
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
