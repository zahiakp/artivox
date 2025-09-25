import React, { useRef, useState, useEffect } from "react";
import { TbCaptureFilled } from "react-icons/tb";
import Webcam from "react-webcam";
import { Html5Qrcode } from "html5-qrcode";
import { BsArrowRepeat } from "react-icons/bs";
import { report } from "../../app/utils/report";
import { showMessage } from "./CusToast";
import IconMenuApps from "../icon/menu/icon-menu-apps";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Modal from "./Modal";
import { ChangeParticipantStatus } from "../../app/programs/func";
import { useRouter } from "next/navigation";
import { decodeId } from "./decode";
// Extend the Html5Qrcode module
declare module "html5-qrcode" {
  interface Html5QrcodeFullConfig {
    aspectRatio?: number;
    disableFlip?: boolean;
  }
}

const CameraCapture = ({
  participants,
  close,
  program,
  setParticipants,
  partEndpoint,
}: any) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const qrCodeRegionRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!error) {
  //     const qrCodeRegion = qrCodeRegionRef.current;
  //     if (!qrCodeRegion) return;

  //     const html5QrCode = new Html5Qrcode(qrCodeRegion.id);
  //     let isScanning = false;

  //     const onScanSuccess = (decodedText: string) => {
  //       console.log("Decoded text:", decodedText);
  //       setScanResult(decodedText);

  //       if (isScanning) {
  //         html5QrCode
  //           .stop()
  //           .then(() => {
  //             console.log("Scanner stopped successfully.");
  //             isScanning = false;
  //           })
  //           .catch((err) => console.error("Error stopping scanner:", err));
  //       }
  //     };

  //     const onScanError = (error: string) => {
  //       console.warn("Error scanning:", error);
  //     };
  //     if (!isScanning) {
  //       html5QrCode
  //         .start(
  //           { facingMode: "environment" },
  //           {
  //             fps: 10,
  //             qrbox: { width: 200, height: 200 },
  //           },
  //           onScanSuccess,
  //           onScanError
  //         )
  //         .then(() => {
  //           isScanning = true;
  //           console.log("Scanner started successfully.");
  //         })
  //         .catch((err) => console.error("Error starting scanner:", err));
  //     }

  //     return () => {
  //       if (isScanning) {
  //         html5QrCode
  //           .stop()
  //           .then(() => console.log("Scanner stopped successfully on cleanup."))
  //           .catch((err) =>
  //             console.error("Error stopping scanner on cleanup:", err)
  //           );
  //       }
  //     };
  //   }
  // }, [error]);
  // useEffect(() => {
  //   if (scanResult) {
  //     setLoading(true);
  //   }
  // }, [scanResult]);

  // console.log(scanResult);

  // --------------------------------------------
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanner, setScanner] = useState<any>(null);
  const [studentId, setStudentId] = useState("");
  const [fail, setFail] = useState(false);
  const [result, setResult] = useState<any>(null);

  const afterScan = async () => {
    console.log(result);

    try {
      const participant = participants.find((item: any) =>
        program.isGroup > 0
          ? item.student.split(",").some((id: string) => id === decodeId(result))
          : item.student === decodeId(result)
      );
    
      if (!participant) {
        throw new Error(`${decodeId(result)} is not found in participants list`);
      }
    
      if (participant.status === "reported") {
        throw new Error(`Participant already reported`);
      }
    
      const response = await ChangeParticipantStatus(
        participant.id,
        "reported",
        partEndpoint
      );
    
      if (response.success) {
        setParticipants((prevParticipants: any) =>
          prevParticipants.map((item: any) =>
            item.id === participant.id
              ? { ...item, status: "reported" }
              : item
          )
        );
        // router.refresh();
        showMessage(`Participant successfully reported`, "success");
        close(false);
      } else {
        throw new Error(`Participant report failed`);
      }
    } catch (error: any) {
      setResult(null);
      showMessage(error.message, "error");
      // close(false)
    }
    
  };

  useEffect(() => {
    if (result) {
      afterScan();
    }
  }, [result]);

  return (
    <Modal close={close}>
      <div className="h-[500]">
        <BarcodeScannerComponent
          width={500}
          height={500}
          stopStream={false}
          onUpdate={(err: any, result: any) => {
            if (result) {
              setResult(result.text);
            }
          }}
        />
      </div>
      <button
        onClick={() => close(false)}
        className={`text-lg p-2 w-full mt-3 bg-gradient-to-tr from-zinc-400 to-zinc-600 shadow-md rounded-lg text-white`}
        disabled={loading}
      >
        {loading ? "Reporting..." : "Close"}
      </button>
    </Modal>
  );
};

export default CameraCapture;
