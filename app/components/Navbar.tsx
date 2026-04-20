// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import React, { useState } from "react";

// export default function Navbar() {
//   const navLinks = [
//     { label: "Home", href: "/" },
//     { label: "About", href: "/about" },
//   ];

//   const pathname = usePathname();
//   const isActive = (href: string) => pathname === href;

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const toggleSidebar = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   const sidebarVariants = {
//     open: { x: 0 },
//     closed: { x: "100%" },
//   };
//   const overlayVariants = {
//     open: { opacity: 1 },
//     closed: { opacity: 0 },
//   };
//   return (
//     <div>
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20 relative">
//           {/* Logo */}
//           <div className="shrink-0">
//             <h1 className="text-3xl font-bold text-dark">
//               Inv<span className="text-deepgreen">oxa</span>
//             </h1>
//           </div>

//           <div className="absolute left-1/2 -translate-x-1/2">
//             <div className="hidden md:flex items-center space-x-8 ">
//               {navLinks.map((link) => {
//                 const isActive =
//                   pathname.startsWith(link.href) &&
//                   (link.href !== "/" || pathname === "/");

//                 return (
//                   <div key={link.href} className="relative group">
//                     <Link
//                       href={link.href}
//                       className={`relative text-[16px] leading-5  transition-colors duration-200 ${
//                         isActive ? "font-bold" : ""
//                       }
//               after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full
//               after:bg-darkgreen after:scale-x-0 group-hover:after:scale-x-100 after:origin-left
//               after:transition-transform after:duration-300`}
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       {link.label}
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="items-center gap-[10px] flex">
//             {/* md:flex */}
//             <div className="  gap-4">
//               {/* Login Button */}
//               <Link href="/">
//                 <button className="w-[106px] h-[44px] text-[1rem] border border-deepgreen font-semibold bg-transparent text-deepgreen  flex items-center justify-center transition-all duration-300 hover:bg-deepgreen hover:text-light hover:shadow-md hover:-translate-y-1">
//                   Login
//                 </button>
//               </Link>

//               {/* Sign Up Button */}
//               <Link href="/">
//                 <button className="w-[106px] h-[44px] text-[1rem] border border-dark font-semibold text-light bg-dark  flex items-center justify-center transition-all duration-300 hover:bg-transparent hover:text-dark hover:shadow-md hover:-translate-y-1">
//                   Sign Up
//                 </button>
//               </Link>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={toggleSidebar}
//               className="cursor-pointer md:hidden text-white"
//             >
//               <Image src="/menu.png" alt="menu" width={24} height={24} />
//             </button>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiMenu, HiX } from "react-icons/hi";

// export default function Navbar() {
//   const navLinks = [
//     { label: "Home", href: "/" },
//     { label: "About", href: "/about" },

//   ];

//   const pathname = usePathname();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const toggleSidebar = () => setMobileMenuOpen(!mobileMenuOpen);

//   // Detect scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) setScrolled(true);
//       else setScrolled(false);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <motion.header
//       animate={{
//         y: scrolled ? -2 : 0,
//       }}
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         scrolled
//           ? "bg-white/90 backdrop-blur-md shadow-lg"
//           : "bg-white/50 backdrop-blur-sm"
//       }`}
//     >
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20 relative">
//           {/* Left: Desktop nav links */}
//           <motion.div
//             className={`hidden md:flex gap-8`}
//             animate={{ gap: scrolled ? 6 : 8 }}
//             transition={{ duration: 0.3 }}
//           >
//             {navLinks.slice(0, 2).map((link) => {
//               const isActive = pathname.startsWith(link.href);
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`relative text-[16px] font-medium transition-all ${
//                     isActive ? "text-deepgreen font-bold" : "text-dark"
//                   } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-deepgreen after:scale-x-0 group-hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300`}
//                 >
//                   {link.label}
//                 </Link>
//               );
//             })}
//           </motion.div>

//           {/* Center: Logo */}
//           <motion.div
//             className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
//             animate={{ scale: scrolled ? 0.9 : 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <h1 className="text-3xl font-bold text-dark">
//               Inv<span className="text-deepgreen">oxa</span>
//             </h1>
//           </motion.div>

//           {/* Right: Desktop nav links & buttons */}
//           <motion.div
//             className="hidden md:flex items-center gap-6"
//             animate={{ gap: scrolled ? 4 : 6 }}
//             transition={{ duration: 0.3 }}
//           >
//             {navLinks.slice(2).map((link) => {
//               const isActive = pathname.startsWith(link.href);
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`relative text-[16px] font-medium transition-all ${
//                     isActive ? "text-deepgreen font-bold" : "text-dark"
//                   } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-deepgreen after:scale-x-0 group-hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300`}
//                 >
//                   {link.label}
//                 </Link>
//               );
//             })}

//             <Link href="/">
//               <button className="w-24 h-10 border border-deepgreen font-semibold bg-transparent text-deepgreen flex items-center justify-center transition-all duration-300 hover:bg-deepgreen hover:text-light hover:shadow-lg hover:-translate-y-1">
//                 Sign Up
//               </button>
//             </Link>
//             {/* <Link href="/">
//               <button className="w-24 h-10 border border-dark font-semibold bg-dark text-light flex items-center justify-center transition-all duration-300 hover:bg-transparent hover:text-dark hover:shadow-lg hover:-translate-y-1">
//                 Sign Up
//               </button>
//             </Link> */}
//           </motion.div>

//           {/* Mobile Menu Button */}

//           <button className="md:hidden z-50 focus:outline-none" onClick={toggleSidebar}>
//   {mobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
// </button>
//         </div>
//       </nav>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <>
//             {/* Overlay */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.5 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black z-40"
//               onClick={toggleSidebar}
//             />

//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="fixed top-0 right-0 w-72 h-full bg-white/90 backdrop-blur-md shadow-lg z-50 flex flex-col p-6"
//             >
//               {/* Header */}
//               <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-2xl font-bold text-dark">
//                   Inv<span className="text-deepgreen">oxa</span>
//                 </h1>
//                 <button onClick={toggleSidebar}>
//   {mobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
// </button>
//               </div>

//               {/* Links */}
//               <div className="flex flex-col gap-6">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className={`text-lg font-medium ${
//                       pathname.startsWith(link.href)
//                         ? "text-deepgreen"
//                         : "text-dark"
//                     }`}
//                     onClick={toggleSidebar}
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>

//               {/* Buttons */}
//               <div className="mt-auto flex flex-col gap-4">
//                 <Link href="/">
//                   <button className="w-full h-12 border border-deepgreen font-semibold bg-transparent text-deepgreen flex items-center justify-center transition-all duration-300 hover:bg-deepgreen hover:text-light hover:shadow-lg hover:-translate-y-1">
//                     Login
//                   </button>
//                 </Link>
//                 <Link href="/">
//                   <button className="w-full h-12 border border-dark font-semibold bg-dark text-light flex items-center justify-center transition-all duration-300 hover:bg-transparent hover:text-dark hover:shadow-lg hover:-translate-y-1">
//                     Sign Up
//                   </button>
//                 </Link>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </motion.header>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => setMobileMenuOpen(!mobileMenuOpen);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  // Detect scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled ? "bg-white/70 shadow-lg" : "bg-white/40"
      }`}
      animate={{ y: scrolled ? -2 : 0 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="shrink-0"
            animate={{ scale: scrolled ? 0.95 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-dark">
              Inv<span className="text-deepgreen">oxa</span>
            </h1>
          </motion.div>

          {/* Desktop Links */}
          <motion.div
            className="hidden md:flex space-x-6"
            animate={{ gap: scrolled ? 4 : 6 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors duration-200 hover:text-deepgreen ${
                  isActive(link.href) ? "text-deepgreen" : "text-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>

          {/* Buttons & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-2">
              {/* <Link href="/">
                <button className="px-4 py-2 border border-deepgreen text-deepgreen font-semibold hover:bg-deepgreen hover:text-light transition">
                  Login
                </button>
              </Link> */}
              <Link href="/signup">
                <button className="px-4 py-2 border border-light bg-deepgreen text-light font-semibold hover:bg-transparent hover:text-deepgreen hover:border-deepgreen transition">
                  Sign Up
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleSidebar}
            >
              {mobileMenuOpen ? <></>: <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 "
              onClick={toggleSidebar}
            />

            {/* Sliding Sidebar */}
            {/* Sliding Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-70 h-full bg-white/70 backdrop-blur-md shadow-lg z-50 flex flex-col p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <button onClick={toggleSidebar}>
                  <HiX size={28} />
                </button>
              </div>

              {/* Links with staggered fade-in */}
              <motion.div
                className="flex flex-col gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: 50 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`text-lg font-medium hover:text-deepgreen ${
                        isActive(link.href) ? "text-deepgreen" : "text-dark"
                      }`}
                      onClick={toggleSidebar}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Buttons */}
              <div className="mt-auto flex flex-col gap-4">
                {/* <Link href="/">
                  <button className="w-full px-4 py-2 border border-deepgreen text-deepgreen font-semibold hover:bg-deepgreen hover:text-light transition">
                    Login
                  </button>
                </Link> */}
                <Link href="/signup">
                  <button className="w-full px-4 py-2 border border-light bg-deepgreen text-light font-semibold hover:bg-transparent hover:text-deepgreen transition">
                    Sign Up
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
