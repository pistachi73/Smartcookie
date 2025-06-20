"use client";
import { animate, motion, useMotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

import "./hero-carrousel.css";

export const HeroCarrousel = () => {
  const images = [
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
    "/martina_teaching_1.png",
  ];

  const FAST_DURATION = 20;
  const SLOW_DURATION = 50;

  const [ref, { width }] = useMeasure();
  const xTranslation = useMotionValue(0);

  const [duration, setDuration] = useState(FAST_DURATION);

  useEffect(() => {
    const finalPos = -width / 2 - 8;
    const controls = animate(xTranslation, finalPos, {
      duration,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
      repeatType: "loop",
      repeatDelay: 0,
    });

    return () => controls.stop();
  }, [width, xTranslation, duration]);

  return (
    <div className="h-[20vw] w-full relative flex">
      <motion.div
        ref={ref}
        className="list absolute left-0 top-0 flex gap-2"
        style={{ x: xTranslation }}
        onHoverStart={() => setDuration(SLOW_DURATION)}
        onHoverEnd={() => setDuration(FAST_DURATION)}
      >
        {images.map((image) => (
          <Card key={image} image={image} />
        ))}
      </motion.div>
    </div>
  );
};

const Card = ({ image }: { image: string }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  return (
    <div
      className="bg-overlay  shadow-lg p-2 w-[calc(20vw)] aspect-square relative overflow-hidden rounded-xl flex justify-center items-center"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      <Image
        src={image}
        alt="hero"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 20vw, (max-width: 1200px) 20vw, 20vw"
      />
    </div>
  );
};
