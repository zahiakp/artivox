import { useEffect } from "react";
import Swal, { SweetAlertOptions } from "sweetalert2";

export const showMessage = (msg = '', type = '') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
            popup: 'toast-custom',
        },
    } as SweetAlertOptions);

    toast.fire({
        icon: type,
        title: msg,
        padding: '13px 20px',
    } as SweetAlertOptions);
};

const CusToast = () => {
    useEffect(() => {
        const styles = `
        .toast-custom {
            background: #2B3F5C !important;
            border-radius: 12px;
            color: white;
            margin-bottom: 40px;
        }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Cleanup styles on component unmount
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    return null; // This component is just for adding styles
};

export default CusToast;
