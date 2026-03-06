// src/components/ImageModal.jsx
import { X } from "lucide-react";

const ImageModal = ({ isOpen, onClose, imageUrl, alt }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] animate-scaleIn">
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
