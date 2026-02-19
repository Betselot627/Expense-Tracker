import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const ProfilePhotoSelector = ({ onPhotoSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onPhotoSelect(file); // Pass selected file to parent
    }
  };

  const handleDelete = () => {
    setPreview(null);
    onPhotoSelect(null); // Remove file in parent
  };

  return (
    <div className="flex flex-col items-center">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
          />
          {/* Delete button on bottom-right */}
          <button
            type="button"
            onClick={handleDelete}
            className="absolute -bottom-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition"
          >
            <Trash2 className="w-3 cursor-pointer h-3" />
          </button>
        </div>
      ) : (
        <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-purple-400 rounded-full cursor-pointer hover:bg-purple-50 transition">
          <span className="text-purple-500 text-center text-sm">
            Upload<br />Photo
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
