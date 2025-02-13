import { animate, motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { FC, RefObject, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import WaveForm from "./WaveForm";
import RotationText from "./RotationText";
type SongWidgetProps = {
  song: {
    id: string;
    title: string;
    artist: string;
    image: string;
  };
  orderedSongs: string[];
  emitSwipe: (direction: "left" | "right") => void;
  leaning: "left" | "right" | null;
  setLeaning: (leaning: "left" | "right" | null) => void;
  volume: number;
  previousOrderedSongs: string[];
};

const SongWidget: FC<SongWidgetProps> = ({
  song,
  orderedSongs,
  emitSwipe,
  leaning,
  setLeaning,
  volume,
  previousOrderedSongs,
}) => {
  const rank = orderedSongs.indexOf(song.id);
  const ref = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(true);

  const dragOffset = useMotionValue(0);
  const dragRotation = useTransform(dragOffset, [-200, 200], [-5, 5]);
  const affectedRotation = useMotionValue(0);

  useEffect(() => {
    setIsActive(rank === orderedSongs.length - 1);
    setIsNext(rank === orderedSongs.length - 2);
    setIsLast(rank === 0);
  }, [rank, orderedSongs.length]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isActive) {
      if (audio.readyState >= 2) {
        audio.play().then(() => setPaused(false)).catch((error) => {
          if (error.name === "AbortError") return; // Ignore AbortError
          console.error("Audio Playback Error:", error);
          setPaused(true);
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
      setPaused(true);
    }
  }, [isActive, song]);

  useEffect(() => {
    return () => {
      if (audioRef.current && !isActive) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (isLast && leaning === "right") animate(affectedRotation, -5);
    if (isNext && leaning === "left") animate(affectedRotation, 5);
    if (isDragging && leaning === null) animate(affectedRotation, 0);
  }, [leaning, isActive, isNext, isDragging]);

  const handleDrag = (_: unknown, info: PanInfo) => {
    setIsDragging(true);
    dragOffset.set(info.offset.x);
    setLeaning(info.offset.x > 100 ? "right" : info.offset.x < -100 ? "left" : null);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setTimeout(() => setIsDragging(false), 500);
    animate(dragOffset, 0, { type: "spring", stiffness: 300, damping: 30 });
    
    if (info.offset.x > 100) emitSwipe("right");
    else if (info.offset.x < -100) emitSwipe("left");
    else setLeaning(null);
  };

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (paused) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play error:", error);
      });
      setPaused(false);
    } else {
      audioRef.current.pause();
      setPaused(true);
    }
  }, [paused]);

  return (
    <motion.div
      ref={ref}
      className="absolute flex size-48 cursor-grab items-center justify-center overflow-hidden rounded-[42px] active:cursor-grabbing"
      drag="x"
      dragMomentum
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      style={{ rotate: isDragging ? dragRotation : affectedRotation, zIndex: rank }}
    >
      <div>
        <Image
          src={song.image}
          alt={`${song.title} by ${song.artist}`}
          className={cn(
            "pointer-event-none h-full w-full object-cover transition-opacity duration-150",
            !isActive && "opacity-50"
          )}
          width={300}
          height={300}
        />
        <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent">
          <div className="absolute bottom-0 left-0 flex w-full items-center justify-start gap-2 p-4">
            <WaveForm active={isActive} audioRef={audioRef as RefObject<HTMLAudioElement>} paused={paused} setPaused={setPaused} />
            <div className="relative flex w-full flex-col items-start justify-center pr-5 -translate-x-2">
              <RotationText className="gap-none" text={song.title} />
              <RotationText text={song.artist} className="w-full truncate text-xs font-normal text-zinc-300" />
            </div>
            <button onClick={togglePlay} className="bg-white text-black px-2 py-1 rounded-md">
              {paused ? "▶ Play" : "⏸ Pause"}
            </button>
          </div>
        </div>
        <audio className="hidden" ref={audioRef} src={`/api/audio?id=${song.id}`} loop />
      </div>
    </motion.div>
  );
};

export default SongWidget;
