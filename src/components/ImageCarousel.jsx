import { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ImageGalleryModal from "./ImageGalleryModal";

export default function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  if (!images.length) return null;

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full">

      {/* MAIN IMAGE */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
        <img
          src={images[current]}
          onClick={() => setOpen(true)}
          alt="property"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
        />

        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {current + 1} / {images.length}
        </div>  

        {/* LEFT ARROW */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <LeftOutlined />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <RightOutlined />
        </button>
      </div>

      <ImageGalleryModal
        open={open}
        onClose={() => setOpen(false)}
        images={images}
        startIndex={current}
      />

      {/* THUMBNAILS */}
      <div className="flex gap-2 mt-3 overflow-x-auto">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setCurrent(i)}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
              current === i
                ? "border-black"
                : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}