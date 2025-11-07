import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { TbExchange } from "react-icons/tb";
import { toPng } from "html-to-image";
import LDRloader from "./LDRloader";
import { categoryMap } from "../../app/data/branding";

function PosterCanvas({ close, data }: { close: any; data: any }) {
  const elementRef: any = useRef(null);
  const [image, setImage] = useState<any>();
  const [frame, setFrame] = useState<any>();
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { program, result } = data;
  console.log("data", data);

  const temp: any = [
    {
      frame: "1",
      data: [{ theme: "dark", image: "/results/result 01.png" }],
    },
    {
      frame: "2",
      data: [{ theme: "dark", image: "/results/result 02.png" }],
    },
    {
      frame: "3",
      data: [{ theme: "dark", image: "/results/result 03.png" }],
    },
  ];

  function getNextFrame(currentFrame: any, frames: any[]) {
    let currentIndex = frames.findIndex(
      (f) => f === currentFrame || f.frame === currentFrame?.frame
    );
    let nextIndex = (currentIndex + 1) % frames.length;
    return frames[nextIndex];
  }

  const getRandomImage = (imagesArray: any[]) => {
    const randomIndex = Math.floor(Math.random() * imagesArray.length);
    return imagesArray[randomIndex];
  };

  // Initial frame setup
  useEffect(() => {
    setFrame(temp[0]);
  }, []);

  // When frame changes, pick new image + set loading
  useEffect(() => {
    if (frame) {
      // setLoading(true);
      setImage(getRandomImage(frame.data));
    }
  }, [frame]);

  const handleNextFrame = () => {
    setFrame((prev: any) => getNextFrame(prev, temp));
  };

  const htmlToImageConvert = () => {
    setDownloading(true);
    toPng(elementRef.current, {
      cacheBust: false,
      pixelRatio: 4,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${program.category + "_" + program.name.toLowerCase()}.jpg`;
        link.href = dataUrl;
        link.click();
        setDownloading(false);
      })
      .catch((err) => {
        console.error(err);
        setDownloading(false);
      });
  };

  // Frame renderer
  const renderFrameContent = () => {
    if (!frame) return null;

    if (frame.frame === "1") {
      return (
        <>
          <div className="absolute top-[110px] left-[60px]">
            <h6 className="text-[18px] font-bold leading-[10px] mb-5 mt-7 w-40  text-yellow-400">
              <p className="text-[12px] font-normal mb-1">
                BOYS
              </p>
              <span className="text-2xl text-white leading-6 barlow-condensed font-normal uppercase">
                {program.name}
              </span>
            </h6>
          </div>
            <p className="absolute top-[107px] left-[233px] text-xl w-16 font-bold text-center text-zinc-950">{program.order || ""}</p>
          <div className="ml-[35px] absolute  top-[180px] left-[30px] mt-[45px] gap-[6px] flex flex-col">
            {result.filter((rank: any) => rank.rank < 4).map((pro: any) => (
                <div key={pro.rank} className="flex items-center gap-2 w-50">
                  <p className={` text-2xl text-yellow-500 tracking-tighter barlow-condensed`}>
                    0{pro.rank}
                    </p>
                     <div className={`${image?.theme === "dark" ? "text-white" : ""} translate-y-[1px]`}>
                    <h6 className="text-[15px] font-semibold barlow-condensed w-50 leading-[16px]">
                      {pro.student.toUpperCase()}
                    </h6>
                    <p className="text-[9px] w-50 text-red-300 leading-[13px]">
                      {pro.campus}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </>
      );
    }


    if (frame.frame === "2") {
      return (
        <>
          <div className="absolute top-[100px] left-[200px]">
            <h6 className="text-[18px] font-bold leading-[10px] mb-5 mt-7 w-40  text-yellow-400">
              <p className="text-[12px] font-normal mb-1">
                BOYS
              </p>
              <span className="text-2xl text-white leading-6 barlow-condensed font-normal uppercase">
                {program.name}
              </span>
            </h6>
          </div>
            <p className="absolute top-[118px] left-[116px] text-xl w-16 font-bold text-center text-zinc-950">{program.order || ""}</p>
          <div className="ml-[35px] absolute  top-[180px] left-[170px] mt-[45px] gap-[6px] flex flex-col">
            {result.filter((rank: any) => rank.rank < 4).map((pro: any) => (
                <div key={pro.rank} className="flex items-center gap-2 w-50">
                  <p className={` text-2xl text-yellow-500 tracking-tighter barlow-condensed`}>
                    0{pro.rank}
                    </p>
                     <div className={`${image?.theme === "dark" ? "text-white" : ""} translate-y-[1px]`}>
                    <h6 className="text-[15px] font-semibold barlow-condensed w-50 leading-[16px]">
                      {pro.student.toUpperCase()}
                    </h6>
                    <p className="text-[9px] w-50 text-zinc-400 leading-[13px]">
                      {pro.campus}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </>
      );
    }

     if (frame.frame === "3") {
      return (
        <>
          <div className="absolute top-[230px] left-[60px]">
            <h6 className="text-[18px] font-bold leading-[10px] mb-5 mt-7 w-36 text-red-600">
              <p className="text-[12px] font-normal mb-1">
                BOYS
              </p>
              <span className="text-2xl text-zinc-950 leading-6 barlow-condensed font-normal uppercase">
                {program.name}
              </span>
            </h6>
          </div>
            <p className="absolute top-[198px] left-[112px] text-xl w-16 font-bold text-center text-white">{program.order || ""}</p>
          <div className="ml-[35px] absolute  top-[180px] left-[180px] mt-[45px] gap-[6px] flex flex-col">
            {result.filter((rank: any) => rank.rank < 4).map((pro: any) => (
                <div key={pro.rank} className="flex items-center gap-2 w-50">
                  <p className={` text-2xl text-red-600 tracking-tighter barlow-condensed`}>
                    0{pro.rank}
                    </p>
                     <div className={`${image?.theme === "dark" ? "text-zinc-950" : ""} translate-y-[1px]`}>
                    <h6 className="text-[15px] font-semibold barlow-condensed w-50 leading-[16px]">
                      {pro.student.toUpperCase()}
                    </h6>
                    <p className="text-[9px] w-50 text-zinc-600 leading-[13px]">
                      {pro.campus}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <Modal close={close} className="w-fit">
      <div className="my-5 p-5 py-2 font-semibold rounded-lg bg-primary-100 text-primary-600">
        frame {frame?.frame}
      </div>
      {loading ? (
        <div className="h-[450px] rounded-xl w-[450px] flex items-center justify-center bg-primary-50/50 border border-primary-400">
          <LDRloader />
        </div>
      ) : (
        <div ref={elementRef} className="w-fit">
          <div className="relative w-fit" style={{ aspectRatio: "1/1" }}>
            <img
              src={image?.image}
              alt="Random"
              className="h-[450px] w-[450px]"
              onLoad={() => setLoading(false)}
            />
            {renderFrameContent()}
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-5 justify-center">
        <button
          className="flex items-center shadow-lg gap-1 justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 p-3 px-4 text-white group"
          onClick={handleNextFrame}
        >
          <TbExchange className="group-active:rotate-180 duration-300" />
          Frame
        </button>
        <button
          disabled={downloading || loading}
          onClick={htmlToImageConvert}
          className="flex items-center shadow-lg disabled:opacity-30 disabled:cursor-not-allowed justify-center gap-2 rounded-lg bg-gradient-to-br from-green-400 to-green-600 duration-500 p-3 px-4 text-white"
        >
          {downloading ? "..." : "Download"}
        </button>
      </div>
    </Modal>
  );
}

export default PosterCanvas;
