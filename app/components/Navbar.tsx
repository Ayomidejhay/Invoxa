

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiMenu, HiX } from "react-icons/hi";

// export default function Navbar() {
//   const navLinks = [
//     { label: "Home", href: "/" },
//     { label: "Features", href: "#features" },
//     { label: "Pricing", href: "#pricing" },
//   ];

//   const pathname = usePathname();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const toggleSidebar = () => setMobileMenuOpen(!mobileMenuOpen);

//   const isActive = (href: string) =>
//     pathname === href || pathname.startsWith(href);

//   // Detect scroll for glass effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <motion.header
//       className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-md ${
//         scrolled ? "bg-white/70 shadow-lg" : "bg-white/40"
//       }`}
//       animate={{ y: scrolled ? -2 : 0 }}
//     >
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <motion.div
//             className="shrink-0"
//             animate={{ scale: scrolled ? 0.95 : 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <h1 className="text-2xl font-bold text-dark">
//               Inv<span className="text-deepgreen">oxa</span>
//             </h1>
//           </motion.div>

//           {/* Desktop Links */}
//           <motion.div
//             className="hidden md:flex space-x-6"
//             animate={{ gap: scrolled ? 4 : 6 }}
//             transition={{ duration: 0.3 }}
//           >
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`font-medium transition-colors duration-200 hover:text-deepgreen ${
//                   isActive(link.href) ? "text-deepgreen" : "text-dark"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </motion.div>

//           {/* Buttons & Mobile Menu */}
//           <div className="flex items-center gap-4">
//             {/* Desktop Buttons */}
//             <div className="hidden md:flex gap-2">
//               {/* <Link href="/">
//                 <button className="px-4 py-2 border border-deepgreen text-deepgreen font-semibold hover:bg-deepgreen hover:text-light transition">
//                   Login
//                 </button>
//               </Link> */}
//               <Link href="/signup">
//                 <button className="px-4 py-2 border border-light bg-deepgreen text-light font-semibold hover:bg-transparent hover:text-deepgreen hover:border-deepgreen transition">
//                   Sign Up
//                 </button>
//               </Link>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden focus:outline-none"
//               onClick={toggleSidebar}
//             >
//               {mobileMenuOpen ? <></>: <HiMenu size={28} />}
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <>
//             {/* Overlay */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.4 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-white z-40"
//               onClick={toggleSidebar}
//             />

//             {/* Sliding Sidebar */}
//             {/* Sliding Sidebar */}
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="fixed top-0 right-0 w-full h-full bg-white backdrop-blur-md shadow-lg z-50 flex flex-col p-6"
//             >
//               {/* Header */}
//               <div className="flex justify-between items-center mb-8">
//                 <button onClick={toggleSidebar}>
//                   <HiX size={28} />
//                 </button>
//               </div>

//               {/* Links with staggered fade-in */}
//               <motion.div
//                 className="flex flex-col gap-6"
//                 initial="hidden"
//                 animate="visible"
//                 variants={{
//                   visible: {
//                     transition: {
//                       staggerChildren: 0.1,
//                     },
//                   },
//                 }}
//               >
//                 {navLinks.map((link, index) => (
//                   <motion.div
//                     key={link.href}
//                     variants={{
//                       hidden: { opacity: 0, x: 50 },
//                       visible: { opacity: 1, x: 0 },
//                     }}
//                     transition={{ duration: 0.3, delay: index * 0.05 }}
//                   >
//                     <Link
//                       href={link.href}
//                       className={`text-lg font-medium hover:text-deepgreen ${
//                         isActive(link.href) ? "text-deepgreen" : "text-dark"
//                       }`}
//                       onClick={toggleSidebar}
//                     >
//                       {link.label}
//                     </Link>
//                   </motion.div>
//                 ))}
//               </motion.div>

//               {/* Buttons */}
//               <div className="mt-auto flex flex-col gap-4">
//                 {/* <Link href="/">
//                   <button className="w-full px-4 py-2 border border-deepgreen text-deepgreen font-semibold hover:bg-deepgreen hover:text-light transition">
//                     Login
//                   </button>
//                 </Link> */}
//                 <Link href="/signup">
//                   <button className="w-full px-4 py-2 border border-light bg-deepgreen text-light font-semibold hover:bg-transparent hover:text-deepgreen transition">
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

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
          Inv<span className="text-green-600">oxa</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                pathname === link.href ? "text-green-600" : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-green-600 transition">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-green-600 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-gray-700"
          aria-label="Open menu"
        >
          <HiMenu size={24} />
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <HiX size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-gray-900 hover:text-green-600"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-8 border-t flex flex-col gap-4">
                <Link href="/login" className="text-lg font-medium text-gray-600">Log in</Link>
                <Link href="/signup" className="w-full py-4 rounded-xl bg-green-600 text-white text-center font-semibold text-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}