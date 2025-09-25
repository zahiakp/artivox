"use client";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { addAccess, addTeam, editAccess, editTeam, getAccessbyJamiaNo } from "../../app/campus/func";
import { WCheckbox, WFormInput } from "./Form";
import { showMessage } from "./CusToast";
import { useCookies } from "react-cookie";
import { categoryMap } from "../../app/data/branding";

function AddCampus({ close, edit ,fetchCampuses}: { close: any; edit: any ,fetchCampuses:any}) {
  const [cookies, setCookie, removeCookie] = useCookies(["access"]);
  const [role, setRole] = useState(cookies?.access?.role);
// useEffect(() => {
//     setRole(cookies?.access?.role);
//   }, []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    jamiaNo: Yup.string().required("Team Id Required"),
    name: Yup.string().required("Team Name Required"),
    shortname: Yup.string().required("Team Short Name Required"),
    strength: Yup.string().required("Team Strength Required"),
    password: Yup.string().required("Password Strength Required"),
  });

  const formik = useFormik({
    initialValues: {
      jamiaNo: "",
      name: "",
      shortname: "",
      strength: "",
      password: "",
      categories: Object.fromEntries(
  Object.keys(categoryMap).map(key => [key, false])
),
    },

    onSubmit: async (values: any) => {
      setLoading(true);
      const root = "campus";
      try {
        if (edit) {
          const accessId = await getAccessbyJamiaNo(edit.jamiaNo)
          const res = await editAccess(accessId?.data?.id, values,root);
          if (res) {
console.log(res);

            const resp = await editTeam(edit.id, values , selectedCategories);
            if (resp) {
              showMessage("Campus updated successfully","success")
              setTimeout(() => {
                // router.refresh();
                fetchCampuses()
                close(false);
              }, 1000);
            } else {
              showMessage("Failed to update details","error")
              console.log("Error updating details");
            }
          } else {
            showMessage("Failed to update details","error")
            console.log("Error updating details");
          }
        } else {
          
          const res = await addAccess(values,root);
          console.log(res);
          
          if (res.success) {
            const resp = await addTeam(values,selectedCategories);
            if (resp.success) {
              showMessage("Campus added successfully","success")
              setTimeout(() => {
                // router.refresh();
                fetchCampuses()
                close(false);
              }, 1000);
            } else {
              showMessage("Failed to add details","error")
              console.log("Error adding details");
            }
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

  const selectedCategories = Object.keys(formik.values.categories).filter(
    (key) => formik.values.categories[key]
  );

  useEffect(() => {
    if (edit) {
      // Create a new categories object based on the edit data
const categories = Object.fromEntries(
  Object.keys(categoryMap).map(key => [
    key,
    edit?.categories?.includes(key) || false
  ])
);

      formik.setValues({
        jamiaNo: edit?.jamiaNo,
        name: edit?.name,
        shortname: edit?.shortName,
        strength: edit?.strength,
        password: edit?.password,
        categories: categories,
      });
    }
  }, [edit]);
  return (
    <Modal close={close} edit={edit} className={"md:min-w-[700px"}>
      <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <h6 className="font-bold text-2xl mb-3 w-full text-center">
          {edit ? "Edit Team" : "Add Team"}
        </h6>
        <WFormInput formik={formik} name="name" placeHolder="Team Name" />
        <WFormInput
          formik={formik}
          name="shortname"
          placeHolder="Team Short Name"
        />
        <WFormInput formik={formik} name="jamiaNo" placeHolder="Team Id" disabled={edit}/>
        <WFormInput
          formik={formik}
          name="strength"
          placeHolder="Team Strength"
          type="number"
        />
        <WFormInput
          formik={formik}
          name="password"
          placeHolder="Password (Eg: rlf@22)"
        />
        <h6>Categories</h6>
        <div className="bg-primary-50 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 rounded-lg">
          {Object.keys(formik.values.categories).map((category: any) => (
            <div key={category}>
              <label className="flex items-center cursor-pointer select-none">
                <input
                  className="checkbox border-primary-500 [--chkbg:theme(colors.primary.500)] [--chk:white] mr-3"
                  type="checkbox"
                  name={`categories.${category}`}
                  checked={formik.values.categories[category]}
                  onChange={() => {
                    // Toggle the checkbox value
                    formik.setFieldValue(
                      `categories.${category}`,
                      !formik.values.categories[category]
                    );
                  }}
                />
                {category}
              </label>
            </div>
            // <WCheckbox key={category} formik={formik} name={`categories.${category}`} label={category}/>
            // <WCheckbox formik={formik} name="categories.premier" label="Premier"/>
            // <WCheckbox formik={formik} name="categories.subJunior" label="Sub Junior"/>
            // <WCheckbox formik={formik} name="categories.junior" label="Junior"/>
            // <WCheckbox formik={formik} name="categories.senior" label="Senior"/>
          ))}
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-primary-400 to-primary-600 text-white p-3 rounded-lg mt-3 font-semibold flex justify-center"
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
            "Edit Team"
          ) : (
            "Add Team"
          )}
        </button>
      </form>
    </Modal>
  );
}

export default AddCampus;
