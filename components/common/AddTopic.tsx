import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { IoMdAddCircle } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { showMessage } from "./CusToast";
import { addStudent, editStudent } from "../../app/students/func";
import { useFormik } from "formik";
import * as Yup from "yup";
import { WSelectAuto } from "./Form";
import { addTopics, editTopics } from "../../app/topics/func";

export function AddTopic({close, data ,fetch,edit}:{close:any,data:any,fetch:any,edit?:any}) {
  const [loading, setLoading] = useState(false);
  const { program,topics } = edit? edit:"";
  // const [topics, setTopics] = useState(edit ? edit.map((item:any)=>item.topic): [""])
  // const [lang,setLang]=useState(edit ? edit[0].lang  :'')

  const validationSchema = Yup.object().shape({
    lang: Yup.string().required("language Required"),
    topics: Yup.array().of(Yup.string().required("Topic Required")).min(1, "At least one topic is required"),
  });
const formik = useFormik({
   initialValues: {
     program: edit? program.id : data.id,
     lang: "",
     topics:[''],
   },
   onSubmit: async (values: any) => {
     setLoading(true);
     try {
      if (edit) {
        await Promise.all(
          values.topics.map(async (topic: any, i: number) => {
            if (topics[i]) {
              await editTopics(topics[i].id, { ...values, topic });
              console.log("Updated:", topics[i].id, { ...values, topic });
            }
          })
        );
        if (values.topics.length > topics.length) {
          const newTopics = values.topics.slice(topics.length);
          await Promise.all(
            newTopics.map(async (topic: any) => {
              await addTopics({ ...values, topic });
              console.log("Added:", { ...values, topic });
            })
          );
        }
    
        showMessage("Topics updated successfully", "success");
      } else {
        // Add new topics
        await Promise.all(
          values.topics.map(async (topic: any) => {
            await addTopics({ ...values, topic });
            console.log("Added:", { ...values, topic });
          })
        );
    
        showMessage("Topics added successfully", "success");
      }
    
      // Refresh data and close modal after all operations are completed
      fetch();
      close();
    } catch (error: any) {
      showMessage("An error occurred. Please try again later.", "error");
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
    
   },
   validationSchema: validationSchema,
 });
  useEffect(() => {
      if (edit) {
        formik.setValues({
        program: program.id,
        lang: topics[0]?.lang || "",
        topics: topics.map((topic: any) => topic.topic),
        });
      }
    }, [edit]);
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
    <Modal close={close} edit={edit} className="w-fix">
      <form action="" className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <h6 className="font-bold text-2xl mb-3 w-full text-center">
          {edit? program.name : data.name}
        </h6>
        <WSelectAuto
                  formik={formik}
                  name="lang"
                  label=""
                  options={['malayalam','english','arabic','urdu'].map((lang: any) => {
                    return { value: lang, label: lang.toUpperCase() };
                  })}
                  placeHolder="Language"
                />
        {formik.values.topics.map((item:any, index:number) => (
          <div className="relative group">
            {!edit&&<IoCloseCircle
              className={`absolute text-xl text-red-500 top-2 right-2 hidden ${formik.values.topics.length>1&&"group-hover:block"}  cursor-pointer`}
              onClick={() => {
                formik.setFieldValue("topics",formik.values.topics.filter((item:any, i:number) =>index != i))
              }}
            />}
            <textarea
              name={"topic" + index}
              
              id={"topic" + index}
              cols={40}
              rows={5}
              className="w-full p-2"
              value={item}
              onChange={(e) => {
                const updatedTopics = [...formik.values.topics]; // Access the current topics array
                updatedTopics[index] = e.target.value; // Update the specific index with the new value
                formik.setFieldValue("topics", updatedTopics); // Update the Formik field value
              }}              
              required
            ></textarea>
          </div>
        ))}
        <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-fit flex items-center gap-2 rounded-xl p-3 px-4 bg-gray-100"
          onClick={() => formik.setFieldValue("topics", [...formik.values.topics, ''])}
        >
          <IoMdAddCircle />
          Input Box
        </button>
        <button type="submit"
          className="bg-gradient-to-tr flex-1 from-primary-400 to-primary-600 text-white p-3 px-5 rounded-xl font-semibold flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>{" "}
              Adding...
            </>
          ) : edit?'Edit Topic': 'Add Topic'}
        </button></div>
      </form>
    </Modal>
  );
}
