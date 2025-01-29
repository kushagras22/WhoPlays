"use client"
import Slider from "@madzadev/image-slider";
import "@madzadev/image-slider/dist/index.css";
import { motion } from "framer-motion"
import { container, children } from "./animations";

const images = [
  { url: "/assets/images/img1.jpg" },
  { url: "/assets/images/img2.jpg" },
  { url: "/assets/images/img3.jpg" },
  { url: "/assets/images/img4.jpg" },
  { url: "/assets/images/img5.jpg" },
  { url: "/assets/images/img6.jpg" },
  { url: "/assets/images/img7.jpg" },
  { url: "/assets/images/img8.jpg" },
  { url: "/assets/images/img9.jpg" },
  { url: "/assets/images/img10.jpg" },
  { url: "/assets/images/img11.jpg" },
  { url: "/assets/images/img12.jpg" },
  { url: "/assets/images/img13.jpg" },
  { url: "/assets/images/img14.jpg" },
  { url: "/assets/images/img15.jpg" },
  { url: "/assets/images/img16.jpg" },
  { url: "/assets/images/img17.jpg" },
  { url: "/assets/images/img18.jpg" },
  { url: "/assets/images/img19.jpg" },
  { url: "/assets/images/img20.jpg" },
  { url: "/assets/images/img21.jpg" },
  { url: "/assets/images/img22.jpg" },
  { url: "/assets/images/img23.jpg" },
  { url: "/assets/images/img24.jpg" },
  { url: "/assets/images/img25.jpg" },
];

const Carousel = () => {
  return (
    <>
    <Slider 
    className="sm:object-cover sm:h-1/2 w-full rounded-lg"
    imageList={images} width={1000} height={1200} />
     <motion.div
            variants={container}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-center truncate gap-1 font-semibold text-2xl text-black *:opacity-0 *"
        >
            <motion.span variants={children}>Binge watch my favourite photos while listening your favourite music 😊 </motion.span>
           
        
        </motion.div>
    </>
    
)
} 

export default Carousel