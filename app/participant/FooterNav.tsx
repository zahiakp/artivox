import React from 'react'
import { FaRegUserCircle } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';
import { TbSmartHome } from 'react-icons/tb';

function FooterNav() {
    const NAV_ITEMS = [
  { name: 'Home', href: '#' , icon: <TbSmartHome />},
  { name: 'Results', href: '/results' , icon:<FaListCheck />},
  { name: 'Profile', href: '#' , icon:<FaRegUserCircle />
},
];
  return (
    <footer className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 h-16">
                {NAV_ITEMS.map((item:any,i:number) => (
                    <a key={i} href={`/participant${item.href}`} className="flex flex-col text-xs items-center gap-1 justify-center text-gray-700 hover:text-blue-500 font-medium">
                    <span className='text-2xl'>{item.icon} </span>
                    {item.name}
                    </a>
                    ))}
              </div>
            </div>
          </footer>
  )
}

export default FooterNav
