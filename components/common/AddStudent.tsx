import { useEffect, useState } from "react";
import Modal from "./Modal";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { WFormInput, WSelectAuto } from "./Form";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { addStudent, CheckJamiaIds, editStudent } from "../../app/students/func";
import { showMessage } from "./CusToast";
import { brandName, categoryMap } from "../../app/data/branding";

function AddStudent({
  close,
  edit,
  adminEdit,fetch
}: {
  close: any;
  edit: any;
  adminEdit?: any;fetch:any
}) {
  const router = useRouter();
  const [name, setName] = useState(adminEdit?.name || edit?.name || "");
  const [jamiaNo, setJamiaNo] = useState(
    adminEdit?.jamiaNo || edit?.jamiaNo || ""
  );
  const [category, setCategory] = useState(
    adminEdit?.category || edit?.category || ""
  );
  const [cookies] = useCookies([`${brandName}-access`]);
  const {campus,groupId,campusId,role} = cookies[`${brandName}-access`];
  const [loading, setLoading] = useState(false);
  const categories = adminEdit
    ? adminEdit.categories
    : cookies[`${brandName}-access`]?.categories;
    const validationSchema = Yup.object().shape({
    name: Yup.string().required("Program Name Required"),
    jamiaNo: Yup.string().required("jamiaNo Required"),
    category: Yup.string().required("category Required"),
  });
console.log(cookies[`${brandName}-access`]);

const statusOptions = Object.keys(categoryMap).map((key) => ({ value: key, label: categoryMap[key] }));


  const formik = useFormik({
    initialValues: {
      name: "",
      jamiaNo: "",
      campus: role=='Group'? campus : campusId,
      group: groupId,
      category: "",
    },



    onSubmit: async (values: any) => {
      setLoading(true);
      try {
        if (edit) {
          let JamiaIds;
          if(values.jamiaNo !== edit.jamiaNo){
            JamiaIds = await CheckJamiaIds(values.jamiaNo);
          }else{
            JamiaIds={count:0}
          }
          if (JamiaIds.count>0) {
            console.log(`partId ${values.jamiaNo} is taken`);
            showMessage(`partId ${values.jamiaNo} is already added`,"error")
          } else {
          const resp = await editStudent(edit.id, values);
          if (resp) {
            showMessage("Student updated successfully","success")
            fetch()
            close()
          } else {
            showMessage("Failed to update details","error")
            console.log("Error updating details");
          }
        }
        } else {
          const JamiaIds = await CheckJamiaIds(values.jamiaNo);
          console.log("JamiaIds",JamiaIds);
          
        if (JamiaIds.count>0) {
          console.log(`Participant ${values.jamiaNo} is taken`);
          showMessage(`Participant ${values.jamiaNo} is already added`,"error")
        } else {
          const resp = await addStudent(values);
          if (resp) {
            showMessage("Student added successfully","success")
            fetch()
            close()
          } else {
            showMessage("Failed to add details","error")
            console.log("Error adding details");
          }
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
      jamiaNo: edit.jamiaNo,
      campus: role=='Group'? campus : campusId,
      group: groupId,
      category: edit.category,
      });
    }
  }, [edit]);
  return (
    <Modal close={close} edit={edit}>
      <form
        action=""
        className="flex flex-col gap-3 md:w-80"
        onSubmit={formik.handleSubmit}
      >
        <h6 className="font-bold text-2xl mb-3 w-full text-center">
          {edit ? "Edit Student" : "Add Student"}
        </h6>
        <WFormInput formik={formik} name="name" placeHolder="Student Name" />
        <WFormInput formik={formik} name="jamiaNo" placeHolder="Participant Id" disabled={edit}/>
        <WSelectAuto
          formik={formik}
          name="category"
          label="category"
          options={statusOptions.filter((item:any)=>categories.split(",").includes(item.value)).map((cls: any) => {
            return { value: cls.value, label: cls.label };
          })}
          placeHolder="Category"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-primary-400 to-primary-600 text-white p-3 rounded-xl font-semibold flex justify-center items-center"
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
          ) : adminEdit || edit ? (
            "Edit Student"
          ) : (
            "Add Student"
          )}
        </button>
      </form>
    </Modal>
  );
}

export default AddStudent;
