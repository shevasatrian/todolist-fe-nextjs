import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaCrop, FaCheck, FaTimes } from "react-icons/fa";

const ImageCropper = ({ photo, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = setCrop;
  const onZoomChange = (e) => setZoom(e.target.value);

  const onCropCompleteHandler = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropDone = () => {
    onCropComplete(croppedAreaPixels);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-4/5 h-96 bg-white rounded-lg shadow-lg overflow-hidden">
        <Cropper
          image={URL.createObjectURL(photo)}
          crop={crop}
          zoom={zoom}
          aspect={1} // Rasio 1:1
          onCropChange={onCropChange}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteHandler}
        />
      </div>

      <div className="flex flex-col mt-4 space-y-4">
        {/* Zoom control */}
        <div className="flex items-center space-x-4">
          <label className="text-white">Zoom</label>
          <input 
            type="range"
            min="1"
            max="8"
            step="0.001"
            value={zoom}
            onChange={onZoomChange}
            className="w-64 md:w-80"
            />
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={handleCropDone}
        >
          <FaCheck className="mr-2" /> Done
        </button>
        <button
          className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          onClick={onCancel}
        >
          <FaTimes className="mr-2" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
