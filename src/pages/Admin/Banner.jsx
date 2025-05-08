import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiTrash2, FiImage, FiEdit2, FiClock } from 'react-icons/fi';

function Banner() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description1, setDescription1] = useState('');
  const [description2, setDescription2] = useState('');
  const [uploadURL, setUploadURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const axiosPublic = useAxiosPublic();

  // Fetch existing banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosPublic.get('/banner');
        setBanners(res.data);
      } catch (error) {
        toast.error('Failed to load banners');
        console.error('Fetch error:', error);
      }
    };
    fetchBanners();
  }, [axiosPublic]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image || !description1.trim() || !description2.trim()) {
      toast.error('Please fill in all fields and select an image.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    const API_KEY = '382aa7b1c33cc4718fe5b65b06557718';

    try {
      // Upload image to ImgBB
      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const imgData = await imgRes.json();
      if (!imgData.success) throw new Error('Image upload failed');

      // Save banner data to backend
      const bannerData = {
        imageUrl: imgData.data.url,
        description1,
        description2,
        timestamp: new Date().toISOString()
      };

      const dbRes = await axiosPublic.post('/banner', bannerData);
      
      // Update UI with animation
      setBanners([dbRes.data, ...banners]);
      setUploadURL(imgData.data.url);
      toast.success('Banner uploaded successfully!');
      
      // Reset form
      setImage(null);
      setPreview(null);
      setDescription1('');
      setDescription2('');
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      await axiosPublic.delete(`/banner/${id}`);
      setBanners(banners.filter(banner => banner._id !== id));
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Delete failed: ' + error.message);
      console.error('Delete error:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6"
    >
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-800 mb-2"
        >
          Banner Management
        </motion.h2>
        <p className="text-gray-500 text-lg">Upload and manage your promotional banners</p>
      </div>

      {/* Upload Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100"
      >
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiUpload className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">Upload New Banner</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label htmlFor="banner-upload" className="cursor-pointer">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="space-y-2">
                      <FiImage className="mx-auto text-gray-400 text-4xl" />
                      <p className="text-gray-500">Click to upload an image</p>
                      <p className="text-xs text-gray-400">Recommended size: 1200x400px</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            {/* Text Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                <textarea
                  value={description1}
                  onChange={(e) => setDescription1(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="2"
                  placeholder="Enter your main headline..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subheadline</label>
                <textarea
                  value={description2}
                  onChange={(e) => setDescription2(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="2"
                  placeholder="Enter supporting text..."
                />
              </div>
              
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} shadow-md hover:shadow-lg flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Upload Banner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Banners List */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <FiImage className="text-indigo-600 text-xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">Active Banners</h3>
          <span className="ml-auto bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-sm">
            {banners.length} {banners.length === 1 ? 'banner' : 'banners'}
          </span>
        </div>
        
        <AnimatePresence>
          {banners.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-50 rounded-2xl p-12 text-center"
            >
              <FiImage className="mx-auto text-gray-300 text-5xl mb-4" />
              <h4 className="text-xl font-medium text-gray-500 mb-2">No banners yet</h4>
              <p className="text-gray-400">Upload your first banner to get started</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={banner.imageUrl}
                      alt="Banner"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => deleteBanner(banner._id)}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="font-semibold text-lg mb-1 line-clamp-1">{banner.description1}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{banner.description2}</p>
                    
                    <div className="flex items-center text-gray-400 text-xs">
                      <FiClock className="mr-1" />
                      <span>{new Date(banner.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Banner;