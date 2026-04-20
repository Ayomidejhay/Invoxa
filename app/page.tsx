import Image from "next/image";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import MainHome from "./components/Home";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <div>
      <Navbar />
      <MainHome />
      <Footer />
    </div>
  );
}
