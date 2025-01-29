import { animate, motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import {  FC, RefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {cn} from "@/utils";
import WaveForm from "./WaveForm";
import RotationText from "./RotationText";

const SongWidget : FC<SongWidgetProps> = ({
  song,
  orderedSongs,
  emitSwipe,
  leaning,
  setLeaning,
  volume,
  previousOrderedSongs
 
}) => {
  const rank = orderedSongs.indexOf(song.id);
  const previousRank = previousOrderedSongs.indexOf(song.id);

  const ref = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(false);

  const [isLast, setIsLast] = useState(false);

  const [isNext, setIsNext] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [paused, setPaused] = useState(false);

  const dragOffset = useMotionValue(0);
  const dragRotation = useTransform(dragOffset, [-200, 200], [-5, 5]);

  const affectedRotation = useMotionValue(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handledrag = (_ : unknown, info : PanInfo) => {
    setIsDragging(true);
    dragOffset.set(info.offset.x);
    if(info.offset.x > 100) {
      setLeaning("right");
    }
    else if(info.offset.x < -100) {
      setLeaning("left");
    }
    else {
      setLeaning(null);
    }
  }

  const handleDragEnd = (_ : unknown, info : PanInfo) => {
    setTimeout(() => {
      setIsDragging(false);
    }, 500)
    animate(dragOffset, 0, { type: "spring", stiffness: 300, damping: 30 });

    if(info.offset.x > 100) {
      emitSwipe("right");
    }
    else if(info.offset.x < -100) {
      emitSwipe("left");
    }
    else {
      setLeaning(null);
    }
  }

  useEffect(() => {
    if(audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if(!audioRef.current) {
      return
    }

    if(isActive) {
      audioRef.current.play().catch((error) => {
        if(error.name === "NotAllowedError") {
          setPaused(true);
    
      } else{
      console.log("Audio Playback Error", error);
    }
  })
}
else{
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
}

return () => {
  if(audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  }
  }, [isActive, song]);

  useEffect(() => {
    if(isLast && leaning === "right") {
      animate(affectedRotation, -5);
      animate(ref.current!, {x: -50})
    }

    if(isNext && leaning === "left") {
      animate(affectedRotation, 5);
      animate(ref.current!, {x: 50})
    }

    if(isDragging && leaning === null) {
      animate(affectedRotation, 0);
      animate(ref.current!, {x: 0});
    }
  }, [rank, leaning, isActive, isNext, isDragging]);


  useEffect(() => {
    setIsActive(rank === orderedSongs.length - 1);
    setIsNext(rank === orderedSongs.length - 2);
    setIsLast(rank === 0);
  }, [rank, orderedSongs.length]);

  return (
    <motion.div ref={ref} className='absolute flex size-48 cursor-grab items-center justify-center overflow-hidden rounded-[42px] active:cursor-grabbing'
      drag="x"
      dragMomentum
      dragConstraints={{top: 0, left: 0 ,right: 0, bottom: 0}}
      onDragEnd={handleDragEnd}
      onDrag={handledrag}
      style={{
        rotate: isDragging ? dragRotation : affectedRotation,
        zIndex: rank
      }}
      >
        <div>
          <Image src={song.image}
          alt={`${song.title} by ${song.artist}`}
          className={
            cn(
              "pointer-event-node h-full w-full object-cover transition-opacity duration-150",
              !isActive && "opacity-50"
            )
          }
          width={300}
          height={300}
          />
          <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent">
          <div className="absolute bottom-0 left-0 flex w-full items-center justify-start gap-2 p-4">
          
          <WaveForm 
          active={isActive}
          audioRef={audioRef as RefObject<HTMLAudioElement>}
          paused={paused}
          setPaused={setPaused}
          />

          <div
          className="relative flex w-full  flex-col items-start justify-center pr-5 -translate-x-2" 
          >
            <RotationText className="gap-none"
            text={song.title} />

            <RotationText 
            text={song.artist}
            className="w-full truncate text-xs font-normal text-zinc-300"
            /> 
          </div>
          </div>

          {/* Hidden Audio Element */}
          <audio className="hidden" ref={audioRef} src={`/api/audio?id=${song.id}`}
       
          loop
           />
          </div>

        
        </div>
    </motion.div>
  )
}

export default SongWidget;