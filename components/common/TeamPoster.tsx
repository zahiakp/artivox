import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';
import { TbExchange } from 'react-icons/tb';
import Modal from './Modal';

function TeamPoster({ close, data }:{close:any, data:any}){
    const {result,after} = data;
     const elementRef:any = useRef(null);
      const [image,setImage]=useState<any>()
      const [ad,setAd] = useState()
      const getRandomImage = (imagesArray: string[]) => {
        const randomIndex = Math.floor(Math.random() * imagesArray.length);
        return imagesArray[randomIndex];
      };
      useEffect(()=>{
        setImage(getRandomImage(temp))
        // setAd(getRandomImage(ads))
      },[])
      const htmlToImageConvert = () => {
        toPng(elementRef.current, { 
          cacheBust: false, 
          pixelRatio: 2 // Adjust for higher quality; 2x, 3x, or more
        })
          .then((dataUrl:any) => {
            const link = document.createElement("a");
            link.download = `${data.name}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err:any) => {
            console.error(err);
          });
      };
      const temp:any = ["grp-result.jpg","grp-result 2.jpg","grp-result 3.jpg",];
    return (
        <Modal close={close} className="w-fit">
        <div ref={elementRef} className="w-fit"><div
          className="relative w-fit"
          style={{ aspectRatio: "1/1" }}
          
        >
          <img
            src={image}
            alt="Random"
            className="h-[450px] w-[450px]"
          />
          <div className="absolute top-[170px] left-[110px]">
            <p
              className={`meow-script-regular mb-4  ml-36 mt-9 -translate-x-16 ${image == 'grp-result.jpg' ? 'text-zinc-200':"text-zinc-800"}
              `}
            >
              After
              <span
                className={`text-3xl text-primary-400 font-semibold ml-2 font-bebasNeue ${image == 'grp-result.jpg' && 'text-rose-400'} ${
                  data.category == "subjunior"
                    ? "text-blue-500"
                    : data.category == "junior"
                    ? "text-red-500"
                    : data.category == 'premier' ? 'text-yellow-200' :data.category == 'minor' ? 'text-green-600':''
                }`}
              >
                {String(after).padStart(2, '0')}
              </span>
            </p>
            {/* <h6 className={`text-[18px] font-bold leading-[20px] mb-8 text-red-700 w-40 ${image == 'result1.jpg' && 'text-yellow-200'}`}>
              <p className={`text-[14px] font-normal  uppercase ${image == 'result1.jpg' ? 'text-white':"text-zinc-800"} `}>{program.category}</p>
              {program.name}
            </h6> */}
            {result.map((pro:any, index:number) => (
              <>
                <div className="flex items-center justify-between gap-[4px]">
                  <div className={`${image == 'grp-result.jpg' && 'text-yellow-200'} translate-y-[1px]`}>
                    <h6 className="font-medium text-[14px] leading-[16px] ">
                      {pro.group.toUpperCase()}
                    </h6>
                  </div>
                  <p className={`font-bold ${image == 'grp-result.jpg' ? 'text-white':"text-red-500"}  text-[17px] translate-y-[1px]`}>{pro.points}</p>
                </div>
              </>
            ))}
  
            {/* {data.second?.map((item:any, index:number) => (
              <>
                <div className="flex items-center gap-2">
                  <p className={`font-teko text-[20px] ${data.category == 'premier' && 'text-white'} rounded-md p-[1px] px-2`}>
                    2
                  </p>
                  <div className={`${data.category == 'premier' && 'text-white'} translate-y-[1px]`}>
                    <h6 className="font-bold text-[15px] w-50 leading-[16px]">
                      {item.studentName?.toUpperCase()}
                    </h6>
                    <p className="text-[12px] w-50 leading-[13px]">
                      {item.short.toUpperCase()}
                    </p>
                  </div>
                </div>
                <hr className={`${data.category == 'premier' && 'opacity-[20%]'} my-2 opacity-70`} />
              </>
            ))}
  
            {data.third?.map((item:any, index:number) => (
              <>
                <div className="flex items-center gap-2">
                  <p className={`font-teko text-[20px] ${data.category == 'premier' && 'text-white'} rounded-md p-[1px] px-2`}>
                    3
                  </p>
                  <div className={`${data.category == 'premier' && 'text-white'} translate-y-[1px]`}>
                    <h6 className="font-bold text-[15px] w-50 leading-[16px]">
                      {item.studentName.toUpperCase()}
                    </h6>
                    <p className="text-[12px] w-50 leading-[13px]">
                      {item.short.toUpperCase()}
                    </p>
                  </div>
                </div>
                <hr className={`${data.category == 'premier' && 'opacity-[20%]'} my-2 opacity-70`} />
              </>
            ))} */}
          </div>
        </div>
        {/* <div ><img src={ad} alt="ad" className="w-[450px]"/></div> */}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-5">
          {/* <button className="flex items-center gap-2 rounded-lg bg-primary-500 p-2 px-4 text-white">
            <HiOutlineRefresh />
            Layout
          </button> */}
          <button className="flex items-center shadow-lg justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 p-3 px-4 text-white group" onClick={()=>{
            setImage(getRandomImage(temp))
          }}>
            <TbExchange className="group-active:rotate-180 duration-300"/>
            Background
          </button>
          {/* <button className="flex items-center gap-2 rounded-lg bg-primary-500 p-2 px-4 text-white group" onClick={()=>{
            setAd(getRandomImage(ads))
          }}>
            <TbExchange className="group-active:rotate-180 duration-300"/>
            Ad
          </button> */}
          <button
            onClick={htmlToImageConvert}
            className="flex items-center shadow-lg justify-center gap-2 rounded-lg bg-gradient-to-br from-green-400 to-green-600 duration-500 p-3 px-4 text-white"
          >
            Download
          </button>
        </div>
      </Modal>
    );
};

export default TeamPoster;