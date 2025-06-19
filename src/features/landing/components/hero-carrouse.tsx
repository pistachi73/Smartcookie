"use client";
import Image from "next/image";
import { useState } from "react";

export const HeroCarrousel = () => {
  const images = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ];
  return (
    <div className="py-12">
      <div className="absolute left-0 flex gap-4">
        {images.map((image) => (
          <Card key={image} image={image} />
        ))}
      </div>
    </div>
  );
};

const Card = ({ image }: { image: string }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  return (
    <div className="size-30 bg-red-500 relative overflow-hidden rounded-xl flex justify-center items-center">
      {showOverlay && (
        <div className="absolute inset-0 z-10 flex justify-center items-center">
          <div className="absolute pointer-events-none bg-black/50" />
          <h1>hello</h1>
        </div>
      )}
      <Image src={image} alt="hero" className="object-cover" fill />
    </div>
  );
};
