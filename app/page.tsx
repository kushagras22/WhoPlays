import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Carousel from "@/demos/CarouselImages/Carousel"
import MusicWidget from "@/demos/MusicWidget"
import { AnimatePresence } from "framer-motion"

const Home = () => {
    return (
       <main className="container flex min-h-svh mx-auto flex-col max-w-md items-center justify-between gap-10 py-10 ">
        <AnimatePresence>
            <Header/>
            <MusicWidget/>
            <Carousel/>
            <Footer/>
        </AnimatePresence>
        
       </main>
    )
}

export default Home
