"use client";;
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { WFormInput, WSelectAuto } from "./Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { addProgram, editProgram } from "../../app/programs/func";
import { showMessage } from "./CusToast";
import { useCookies } from "react-cookie";
import { categoryMap } from "../../app/data/branding";

function AddPrograms({ close, edit ,fetchPrograms,root}: { close: any; edit: any,fetchPrograms:any,root:any }) {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["access"]);
  const [loading, setLoading] = useState(false);

  const categories = Object.keys(categoryMap);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Program Name Required"),
    limit: Yup.string().required("Participants Limit Required"),
    category: Yup.string().required("category Required"),
  });
  console.log(cookies.access.jamiaNo);
  
  const formik = useFormik({
    initialValues: {
      name: "",
      group: false,
      stage: false,
      limit: "",
      members:"",
      category: "",
      team:cookies?.access?.teamId,
    },

    onSubmit: async (values: any) => {
      setLoading(true);
      try {
        if (edit) {
          const resp = await editProgram(edit.id, values,root);
          if (resp) {
            showMessage("Program updated successfully","success")
            fetchPrograms()
            close()
          } else {
            showMessage("Failed to update details","error")
            console.log("Error updating details");
          }
        } else {
          const resp = await addProgram(values,root);
          if (resp) {
            showMessage("Program added successfully","success")
            fetchPrograms()
            close()
          } else {
            showMessage("Failed to add details","error")
            console.log("Error adding details");
          }
        }
      } catch (error: any) {
        showMessage("An error occurred. Please try again later.","error")
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
        name: edit.name,
        group: edit.isGroup == "1",
        stage: edit.isStage == "1",
        limit: edit.limit,
        members:edit.members,
        category: edit.category,
        campus:cookies?.access?.jamiaNo
      });
    }
  }, [edit]);

const options = categories.map((cls:any) => {
  return { value: cls, label:cls };
});


  return (
    <Modal close={close} edit={edit}>
      <form className="flex flex-col gap-3 w-80" onSubmit={formik.handleSubmit}>
        <h6 className="font-bold text-2xl mb-3 w-full text-center">
          {edit ? `Edit ${edit.name}` : "Add Program"}
        </h6>
        <WFormInput formik={formik} name="name" placeHolder="Program Name" />

        <div className="flex items-center bg-primary-50 rounded-xl p-2 px-3">
          <label className="label cursor-pointer flex gap-3">
            <input
              type="checkbox"
              onChange={(e) => formik.setFieldValue("stage", e.target.checked)}
              checked={formik.values.stage}
              className="checkbox border-primary-600 [--chkbg:theme(colors.primary.600)] [--chkfg:white]"
            />
            Stage Item
          </label>
        </div>
        <div className="flex items-center bg-primary-50 rounded-xl p-2 px-3">
          <label className="label cursor-pointer flex gap-3">
            <input
              type="checkbox"
              onChange={(e) => formik.setFieldValue("group", e.target.checked)}
              checked={formik.values.group}
              className="checkbox border-primary-600 [--chkbg:theme(colors.primary.600)] [--chkfg:white]"
            />
            Group Item
          </label>
        </div>
        
        <WFormInput
          formik={formik}
          name="limit"
          placeHolder="Participants Limit"
          type="number"
        />
        {formik.values.group && <WFormInput
          formik={formik}
          name="members"
          placeHolder="Group Members Limit"
          type="number"
        />}
        <WSelectAuto
          reload
          formik={formik}
          name="category"
          label=""
          options={options}
          placeHolder="Academic Class"
        />
        {/* <select
          // required
          onChange={formik.handleChange}
          value={formik.values.category}
          className="rounded-lg border focus:outline py-3 px-3 border-primary-300"
        >
          <option value="" disabled>
            Catogory
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select> */}
        <button
          type="submit"
          className="bg-gradient-to-r from-primary-400 to-primary-600 text-white p-3 rounded-xl mt-3 font-semibold flex justify-center"
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
              Proccessing...
            </>
          ) : edit ? (
            "Edit Programs"
          ) : (
            "Add Programs"
          )}
        </button>
      </form>
    </Modal>
  );
}

export default AddPrograms;
