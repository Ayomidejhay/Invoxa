// import React from 'react'

// export default function Footer() {
//   return (
//     <div>
//          <footer className="bg-white/40  px-6 py-12">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
//           <div>
//             <h1 className="text-2xl font-bold text-dark">
//               Inv<span className="text-deepgreen">oxa</span>
//             </h1>
//             <p className="">
//               Focus on growth. <br /> <span className="text-deepgreen">We handle the invoices.</span>
//             </p>
//           </div>

//           <div>
//             <h4 className="font-semibold mb-3">Product</h4>
//             <ul className="space-y-2 text-[#D1D5DB]">
//               <li>Features</li>
//               <li>Pricing</li>
//               <li>About</li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-semibold mb-3">Company</h4>
//             <ul className="space-y-2 text-[#D1D5DB]">
//               <li>Contact</li>
//               <li>Privacy Policy</li>
//               <li>Terms</li>
//             </ul>
//           </div>
//         </div>

//         <div className="text-center text-[#E5E7EB] mt-10 text-sm">
//           © {new Date().getFullYear()} Invoxa. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   )
// }

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-dark text-slate-600 dark:text-white/70 border-t border-slate-200 dark:border-zinc-800/40 px-6 py-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white transition-colors">
            Inv<span className="text-deepgreen dark:text-lightgreen">oxa</span>
          </h1>
          <p className="mt-2">
            Focus on growth. <br />
            <span className="text-deepgreen dark:text-lightgreen">We handle the invoices.</span>
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-dark dark:text-white mb-3">Product</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/#features" className="hover:text-dark dark:hover:text-white transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-dark dark:hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-dark dark:hover:text-white transition-colors">
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-dark dark:text-white mb-3">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="mailto:hello@invoxa.app" className="hover:text-dark dark:hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-slate-400 dark:text-white/50 mt-10 text-sm">
        © {new Date().getFullYear()} Invoxa. All rights reserved.
      </div>
    </footer>
  );
}
