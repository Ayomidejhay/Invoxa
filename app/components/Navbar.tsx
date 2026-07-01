// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { HiMenu, HiX } from "react-icons/hi";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Features", href: "#features" },
//   { label: "Pricing", href: "#pricing" },
// ];

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm py-3"
//           : "bg-transparent py-5"
//       }`}
//     >
//       <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
//           Inv<span className="text-green-600">oxa</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-8">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className={`text-sm font-medium transition-colors hover:text-green-600 ${
//                 pathname === link.href ? "text-green-600" : "text-gray-600"
//               }`}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </div>

//         {/* Desktop CTA */}
//         <div className="hidden md:flex items-center gap-4">
//           <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-green-600 transition">
//             Log in
//           </Link>
//           <Link
//             href="/signup"
//             className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-green-600 transition-all duration-300"
//           >
//             Get Started
//           </Link>
//         </div>

//         {/* Mobile Toggle */}
//         <button
//           onClick={() => setIsMobileMenuOpen(true)}
//           className="md:hidden p-2 text-gray-700"
//           aria-label="Open menu"
//         >
//           <HiMenu size={24} />
//         </button>
//       </nav>

//       {/* Mobile Menu Drawer */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, x: "100%" }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: "100%" }}
//             transition={{ type: "spring", damping: 25, stiffness: 200 }}
//             className="fixed inset-0 z-50 bg-white p-6 md:hidden"
//           >
//             <div className="flex justify-between items-center mb-12">
//               <span className="text-xl font-bold">Menu</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
//                 <HiX size={28} />
//               </button>
//             </div>
            
//             <div className="flex flex-col gap-6">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="text-2xl font-semibold text-gray-900 hover:text-green-600"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="pt-8 border-t flex flex-col gap-4">
//                 <Link href="/login" className="text-lg font-medium text-gray-600">Log in</Link>
//                 <Link href="/signup" className="w-full py-4 rounded-xl bg-green-600 text-white text-center font-semibold text-lg">
//                   Get Started
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
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
          ? "bg-white/80 backdrop-blur-lg border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-dark">
          Inv<span className="text-deepgreen">oxa</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-deepgreen ${
                pathname === link.href ? "text-deepgreen" : "text-gray-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-deepgreen transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-deepgreen text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-dark cursor-pointer"
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
              <span className="text-xl font-bold text-dark">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="cursor-pointer text-dark">
                <HiX size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-dark hover:text-deepgreen"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-8 border-t border-border flex flex-col gap-4">
                <Link href="/login" className="text-lg font-medium text-muted">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="w-full py-4 rounded-xl bg-deepgreen text-white text-center font-semibold text-lg"
                >
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
