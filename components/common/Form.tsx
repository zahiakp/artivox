import { Select } from "antd";
import { useState } from "react";
import { InputMask } from 'primereact/inputmask';
import { TbReload } from "react-icons/tb";

export const WFormInput = ({
  label,
  formik,
  name,
  type,
  placeHolder,disabled
}: {
  label?: string;
  formik: any;
  name: string;
  type?: string;
  placeHolder: string;disabled?:boolean
}) => {
  return (
    <div className=" flex flex-col">
      <label className="j-label ">{label}</label>
      <input
      disabled={disabled}
        type={type ?? "text"}
        className={`w-input ${formik.errors[name] && formik.touched[name] ? "focus:outline-red-500 border-red-500":"border-gray-300"}`}
        placeholder={placeHolder}
        onChange={formik.handleChange}
        value={formik.values[name]}
        name={name}
      />
      {formik.errors[name] && formik.touched[name] && (
        <div className="text-red-600 text-xs mt-2">{formik.errors[name]}</div>
      )}
    </div>
  );
};


// export function FormUpload({
//   formik,
//   name,
//   label,aspects,
//   data,path
// }: {
//   add_url?: any;
//   formik: any;
//   placeholder: string;
//   name: string;
//   label: string;aspects?:any,
//   data?:any,path?:any
// }) {
//   const formik_image = formik.values.image;
//   const [view, setView] = useState(false);
//   const [img, setImg] = useState<any>(null);
//   return (
//     <>
//       <div className="grid gap-2">
//         <div
//           className={`w-full rounded-lg border ${
//             formik.errors[name] && formik.touched[name]
//               ? "bg-red-100 border-red-500"
//               : "bg-white border-zinc-900"
//           }  flex flex-col items-center justify-center group `}
//         >
//           {data ? (
//           <img src={`${ROOT_URL}/uploads/${path}/${formik_image}`} className="h-full w-full rounded-lg" alt="Existing" />
//         ) : formik.values.image ? (
//           <img src={URL.createObjectURL(formik.values[name])} className="h-full w-full rounded-lg" alt="Preview" />
//         ) :  (
//           <BiSolidImageAdd className="text-8xl opacity-50 h-64" />
//         )}

//           <div></div>
//         </div>
//         <button
//           type="button"
//           onClick={() => setView(true)}
//           className={`w-full bg-zinc-900 text-white text-md font-semibold p-2 rounded-md`}
//         >
//           {img || formik_image ? "Change Image" : "Select Image"}
//         </button>
//       </div>
//       {view && (
//         <ImageCrop
//         aspects={aspects}
//           close={() => setView(false)}
//           formik={formik}
//           name={name}
//           img={setImg}
//         />
//       )}
//     </>
//   );
// }



export const WTextarea = ({
  label,
  formik,
  name,
  type,
  placeHolder,
}: {
  label: string;
  formik: any;
  name: string;
  type?: string;
  placeHolder: string;
}) => {
  return (
    <div className="mb-2">
      <label className="j-label">{label}</label>
      <textarea 
        className={`j-input border-2 h-36 resize-none ${formik.errors[name] && formik.touched[name] ? "focus:outline-red-500 border-red-500":"border-gray-300"}`}
        placeholder={placeHolder}
        onChange={formik.handleChange}
        value={formik.values[name]}
        name={name}
      />
      {formik.errors[name] && formik.touched[name] && (
        <div className="text-red-600 text-xs mt-2">{formik.errors[name]}</div>
      )}
    </div>
  );
};


export const WFormInputMask = ({
  label,
  formik,
  name,
  type,
  placeHolder,mask
}: {
  label: string;
  formik: any;
  name: string;
  type?: string;
  placeHolder: string;mask:string
}) => {
  return (
    <div className="mb-2">
      <label className="j-label">{label}</label>
      <InputMask value={formik.values[name]} onChange={(e:any) => formik.setFieldValue(name, e.target.value)} mask={mask} placeholder={placeHolder} />
      {formik.errors[name] && formik.touched[name] && (
        <div className="text-red-600 text-xs mt-2">{formik.errors[name]}</div>
      )}
    </div>
  );
};
// Assuming you are using the reload icon from react-icons

export const WSelectAuto = ({
  label,
  formik,
  name,
  placeHolder,
  options,
  reload,
}: {
  label: string;
  formik: any;
  name: string;
  placeHolder: string;
  options: any;
  reload?: boolean; // Optional reload prop to display the reload button
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-2 relative">
      <label className="w-label">{label}</label>
      <Select
        bordered={false}
        className={`w-full my-2 border rounded-lg  ${
          isFocused
            ? 'border-primary-500'
            : formik.touched[name] && formik.errors[name]
            ? 'border-red-500'
            : 'border-gray-300'
        } cursor-pointer h-fit`}
        showSearch
        placeholder={placeHolder}
        size="large"
        filterOption={(input:any, option:any) => {
          const opt = option as { label: string; value: string };
          return opt.label.toLowerCase().includes(input.toLowerCase());
        }}
        value={ options?.find((option:any) => option.id === formik.values[name]) || formik.values[name] }
        onChange={(value:any) => formik.setFieldValue(name, value)} // Set Formik's value
        options={options} // Pass in options for the select
        onFocus={() => setIsFocused(true)} // Set focus state on focus
        onBlur={() => setIsFocused(false)} // Reset focus state on blur
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-600 text-xs mt-2">
          {formik.errors[name]} {/* Show validation error */}
        </div>
      )}
      {/* Conditionally render reload button */}
      {/* {reload && (
        <button tabIndex={-1}
          type="button"
          onClick={() => formik.setFieldValue(name, '')} // Reset the specific field value
          className="absolute right-8 top-10 bg-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-white"
        >
          <TbReload className="text-lg" />
        </button>
      )} */}
    </div>
  );
};



export const WFileUpload = ({
  label,
  formik,
  name, accept,
}: {
  label: string;
  formik: any;
  name: string; accept?:string,
}) => {
  return (
    <div className="mb-3">
      <label className="j-label">{label}</label>
      <input  accept={accept}
        type="file"
        className="j-input"
        onChange={formik.handleChange
        }
        value={formik.values[name]}
        name={name}
      />
      {formik.errors[name] && formik.touched[name] && (
        <div className="text-red-600 text-xs mt-2">{formik.errors[name]}</div>
      )}
    </div>
  );
};


export const WFormSelect = ({
  label,
  formik,
  name,
  options,
  placeHolder,
}: {
  label: string;
  formik: any;
  name: string;
  options: any;
  placeHolder: string;
}) => {
  return (
    <div className="mb-2">
      <label className="j-label">{label}</label>
      <select
        name={name}
        className="j-input"
        // placeholder={placeHolder}
        onChange={formik.handleChange}
        value={formik.values[name]}
      >
        <option value="" disabled>{placeHolder}</option>
        {options}
      </select>
      {formik.errors[name] && formik.touched[name] && (
        <div className="text-red-600 text-xs mt-2">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export const WCheckbox = ({
  label,
  formik,
  name,
}: {
  label: string;
  formik: any;
  name: string;
}) => {
  return (
    <div className="form-control my-1">
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          // checked={formik.values[name]}
          // value={formik.values[name]}
          onChange={formik.handleChange}
          className="checkbox border-emerald-500 [--chkbg:theme(colors.emerald.500)] [--chk:white] mr-3"
        />
        <span className="">{label}</span>
      </label>
    </div>
  );
};
