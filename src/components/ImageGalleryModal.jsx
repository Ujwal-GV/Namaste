import { Modal } from "antd";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function ImageGalleryModal({ open, onClose, images = [], startIndex = 0 }) {
  const [current, setCurrent] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);

  const next = () => {
    setLoaded(false);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setLoaded(false);
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Swipe support
  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width="100%"
      style={{ top: 5 }}
      bodyStyle={{ padding: 0, height: "90vh", background: "gray" }}
    >
      <div
        {...handlers}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* BLUR PLACEHOLDER */}
        <img
          src={images[current]}
          className={`absolute w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* MAIN IMAGE */}
        <img
          src={images[current]}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`max-h-full max-w-full object-contain transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* LEFT */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full"
        >
          <LeftOutlined />
        </button>

        {/* RIGHT */}
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full"
        >
          <RightOutlined />
        </button>

        {/* COUNTER */}
        <div className="absolute bottom-5 right-5 text-white bg-black/50 px-3 py-1 rounded">
          {current + 1} / {images.length}
        </div>
      </div>
    </Modal>
  );
}