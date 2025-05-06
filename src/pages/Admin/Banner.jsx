import React, { useState } from 'react';
import { FiUpload, FiEdit2, FiX, FiCheck } from 'react-icons/fi';

function Banner() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [descriptions, setDescriptions] = useState({
    main: 'Welcome to Our College',
    secondary: 'Where Excellence Meets Opportunity'
  });
  const [editing, setEditing] = useState({
    main: false,
    secondary: false
  });
  const [tempText, setTempText] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setImage(file);
    
    // Create preview URL
    setImageUrl(URL.createObjectURL(file));

    // In a real implementation, you would upload to ImgBB here
    // For demo purposes, we'll just simulate a successful upload
    setTimeout(() => {
      setUploading(false);
      // setImageUrl('https://i.ibb.co/...'); // This would be the actual ImgBB URL
    }, 1500);
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl('');
  };

  const startEditing = (field) => {
    setTempText(descriptions[field]);
    setEditing({ ...editing, [field]: true });
  };

  const saveEdit = (field) => {
    setDescriptions({ ...descriptions, [field]: tempText });
    setEditing({ ...editing, [field]: false });
  };

  const cancelEdit = (field) => {
    setEditing({ ...editing, [field]: false });
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg">
      {/* Image Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow-md transition-all"
            >
              <FiX size={18} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <label className="cursor-pointer flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-3 hover:bg-white/30 transition-all">
                <FiUpload size={28} />
              </div>
              <span className="text-lg font-medium">Upload Banner Image</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="mt-4 text-sm bg-white/10 px-3 py-1 rounded-full">
                Uploading...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        {editing.main ? (
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="flex-1 bg-white/90 text-3xl font-bold text-gray-800 px-3 py-1 rounded"
              autoFocus
            />
            <button 
              onClick={() => saveEdit('main')}
              className="ml-2 bg-green-500 text-white p-1 rounded"
            >
              <FiCheck size={20} />
            </button>
            <button 
              onClick={() => cancelEdit('main')}
              className="ml-1 bg-red-500 text-white p-1 rounded"
            >
              <FiX size={20} />
            </button>
          </div>
        ) : (
          <div className="group relative">
            <h1 className="text-3xl font-bold text-white mb-1">
              {descriptions.main}
            </h1>
            <button
              onClick={() => startEditing('main')}
              className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white p-1 rounded"
            >
              <FiEdit2 size={16} />
            </button>
          </div>
        )}

        {editing.secondary ? (
          <div className="flex items-center">
            <input
              type="text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="flex-1 bg-white/90 text-lg text-gray-800 px-2 py-1 rounded"
              autoFocus
            />
            <button 
              onClick={() => saveEdit('secondary')}
              className="ml-2 bg-green-500 text-white p-1 rounded"
            >
              <FiCheck size={18} />
            </button>
            <button 
              onClick={() => cancelEdit('secondary')}
              className="ml-1 bg-red-500 text-white p-1 rounded"
            >
              <FiX size={18} />
            </button>
          </div>
        ) : (
          <div className="group relative">
            <p className="text-lg text-white/90">
              {descriptions.secondary}
            </p>
            <button
              onClick={() => startEditing('secondary')}
              className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white p-1 rounded"
            >
              <FiEdit2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Info Boxes (College Data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-1">Established</h3>
          <p className="text-blue-600">1965</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-semibold text-green-800 mb-1">Students</h3>
          <p className="text-green-600">5,000+</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-1">Courses</h3>
          <p className="text-purple-600">120+ Programs</p>
        </div>
      </div>
    </div>
  );
}

export default Banner;