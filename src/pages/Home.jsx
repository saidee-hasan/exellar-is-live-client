import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch, FiCheck, FiCopy, FiArrowRight } from 'react-icons/fi';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Home = () => {
  const [countries] = useState([
    "Afghanistan", "Algeria", "Argentina", "Australia", "Bangladesh", "Belgium", "Bhutan",
    "Brazil", "Canada", "China", "Denmark", "Ethiopia", "Finland", "France", "Germany",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Italy", "Japan", "Malaysia",
    "Maldives", "Mexico", "Morocco", "Nepal", "Netherlands", "Nigeria", "Norway", "Pakistan",
    "Peru", "Russia", "Romania", "South Africa", "Spain", "Sri Lanka", "Sweden", "Switzerland",
    "Thailand", "Turkey", "Uganda", "Ukraine", "United States", "United Kingdom", "Vietnam"
  ]);

  const [selectedCountry, setSelectedCountry] = useState("সাইট সিলেক্ট করুন");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [isWrapperActive, setIsWrapperActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormFrozen, setIsFormFrozen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [copied, setCopied] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const {user} = useAuth();

  const wrapperRef = useRef(null);
  const selectBtnRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Fetch banner data
  useEffect(() => {
    axiosPublic.get('/banner')
      .then(response => {
        if (response.data && response.data.length > 0) {
          setBannerData(response.data[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching banner data:', error);
      });
  }, [axiosPublic]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsWrapperActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = countries.filter(country =>
        country.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchTerm, countries]);

  const updateName = (country) => {
    setSelectedCountry(country);
    setSearchTerm("");
    setIsWrapperActive(false);
  };

  const selectOption = (option) => {
    setSelectedPaymentOption(option);
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("01402050768")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('কপি করতে সমস্যা হয়েছে!', err);
      });
  };

  const checkFormCompletion = () => {
    return (
      selectedCountry !== "সাইট সিলেক্ট করুন" &&
      name &&
      number &&
      amount &&
      senderNumber &&
      selectedPaymentOption
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkFormCompletion()) return;
  
    setIsSubmitting(true);
    setIsFormFrozen(true);
  
    const data = {
      country: selectedCountry,
      name: name,
      number: number,
      amount: amount,
      senderNumber: senderNumber,
      paymentMethod: selectedPaymentOption,
      status: "pending",
      email: user?.email      
    };
  
    axiosPublic.post('/payment', data)
      .then(response => {
        console.log('Payment successful:', response.data);
  
        setTimeout(() => {
          setIsSubmitting(false);
          setShowConfirmation(true);
          
          const submitBtn = document.getElementById('submitBtn');
          if (submitBtn) {
            submitBtn.style.display = 'none';
          }
        }, 3000);
      })
      .catch(error => {
        console.error('Payment failed:', error);
        setIsSubmitting(false);
        setIsFormFrozen(false);
      });
  };
  
  const isSubmitEnabled = checkFormCompletion();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-8 pb-12 px-4">
      {/* Banner Image */}
      <div 
        className="w-full max-w-md h-48 bg-cover bg-center rounded-t-xl mx-auto shadow-md transition-all duration-300 hover:shadow-lg"
        style={{ 
          backgroundImage: `url('${bannerData?.imageUrl || "https://i.postimg.cc/5tFXFDLV/Thumbnail-2.jpg"}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Form Container */}
      <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-b-xl shadow-lg flex flex-col justify-center mx-auto border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-center mb-6 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            এজেন্ট সাইন আপ
          </h2>
         
        </div>
        
        <form id="myForm" onSubmit={handleSubmit}>
          {/* Country Select Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">সিলেক্ট দেশ</label>
            <div className={`relative ${isWrapperActive ? "z-10" : ""}`} ref={wrapperRef}>
              <div 
                className={`flex items-center justify-between h-12 px-4 text-sm bg-white rounded-lg border-2 cursor-pointer transition-all ${
                  isWrapperActive ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-blue-400"
                }`}
                onClick={() => setIsWrapperActive(!isWrapperActive)}
              >
                <span className={`truncate ${selectedCountry !== "সাইট সিলেক্ট করুন" ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                  {selectedCountry}
                </span>
                <FiChevronDown 
                  className={`text-lg text-gray-500 transition-transform duration-200 ${
                    isWrapperActive ? "transform rotate-180 text-blue-600" : ""
                  }`} 
                />
              </div>
              
              <div className={`${isWrapperActive ? "animate-fadeIn" : "hidden"} absolute w-full mt-1 p-3 bg-white rounded-lg shadow-xl border border-gray-100`}>
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    spellCheck="false"
                    type="text"
                    placeholder="Search"
                    className="w-full h-10 text-sm pl-10 pr-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <li
                        key={country}
                        className={`flex items-center h-10 px-3 text-sm cursor-pointer rounded transition-all ${
                          country === selectedCountry 
                            ? "bg-blue-50 text-blue-600 font-medium" 
                            : "hover:bg-gray-50 hover:text-blue-600"
                        }`}
                        onClick={() => updateName(country)}
                      >
                        {country}
                        {country === selectedCountry && (
                          <FiCheck className="ml-auto text-blue-600" />
                        )}
                      </li>
                    ))
                  ) : (
                    <p className="py-2 text-gray-500 text-center">দুঃখিত! সাইট খুজে পাওয়া যাচ্ছে না</p>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="আপনার নাম লিখুন"
              className="w-full h-12 px-4 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isFormFrozen}
            />
          </div>

          {/* Number Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম্বার</label>
            <input
              type="number"
              id="number"
              name="number"
              placeholder="আপনার নাম্বার লিখুন"
              className="w-full h-12 px-4 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              disabled={isFormFrozen}
            />
          </div>

          <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">
              {bannerData?.description1 || "এজেন্ট একাউন্ট নিশ্চিত করতে অবশ্যই ১ হাজার টাকা অগ্রিম পেমেন্ট করতে হবে"}
            </p>
          </div>

          {/* Payment Options - Gray by Default, White when Selected */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">পেমেন্ট অপশন</label>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {["বিকাশ", "নগদ", "রকেট"].map((option) => (
                <div
                  key={option}
                  className={`relative h-14 rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all p-1 border-2 ${
                    selectedPaymentOption === option
                      ? "bg-white border-blue-500 shadow-md"
                      : "bg-gray-600 border-gray-300 hover:bg-gray-100 opacity-50"
                  }`}
                  onClick={() => !isFormFrozen && selectOption(option)}
                >
                  <img 
                    src={
                      option === "বিকাশ" 
                        ? "https://i.postimg.cc/8CkmVGx1/images-22.jpg" 
                        : option === "নগদ" 
                          ? "https://i.postimg.cc/tTM1wGGm/images-2.png" 
                          : "https://i.postimg.cc/5NR15Qtw/images-23.jpg"
                    }
                    alt={option}
                    className={`w-full h-full rounded-lg object-contain p-1 transition-all ${
                      selectedPaymentOption === option 
                        ? "opacity-100" 
                        : "opacity-70 hover:opacity-90"
                    }`}
                  />
                  
                  {selectedPaymentOption === option && (
                    <div className="absolute top-1 right-1 z-20 w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full shadow-sm">
                      <FiCheck className="text-white text-xs" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedPaymentOption && (
              <div className="mt-5 animate-fadeIn">
                <p className="text-blue-600 font-bold mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  এই নাম্বারে অবশ্যই পেমেন্ট করবেন
                </p>
                
                <div className="flex items-center justify-between w-full h-12 bg-white text-blue-600 text-lg font-bold rounded-lg p-3 mb-4 border-2 border-blue-200 shadow-sm">
                  <span>01402050768</span>
                  <button
                    type="button"
                    className={`flex items-center px-3 py-1 ml-2 rounded-lg cursor-pointer transition-all ${
                      copied 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onClick={copyPhoneNumber}
                    disabled={isFormFrozen}
                  >
                    {copied ? (
                      <>
                        <FiCheck className="mr-1" /> কপি হয়েছে
                      </>
                    ) : (
                      <>
                        <FiCopy className="mr-1" /> কপি করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">টাকার পরিমাণ</label>
                  <input
                    type="number"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all"
                    placeholder="কতো টাকা পাঠিয়েছেন?"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isFormFrozen}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">পেমেন্টকারী নাম্বার</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all"
                    placeholder="কোন নাম্বার থেকে পাঠিয়েছেন?"
                    id="sender-number"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    disabled={isFormFrozen}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {isSubmitEnabled && !showConfirmation && (
            <button
              id="submitBtn"
              type="submit"
              className={`w-full h-12 text-sm font-medium text-white rounded-lg relative overflow-hidden ${
                isSubmitting 
                  ? "bg-blue-600 cursor-wait" 
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg"
              } transition-all duration-300 transform hover:scale-[1.01]`}
              disabled={!isSubmitEnabled || isFormFrozen}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  সকল তথ্য সাবমিট করা হচ্ছে
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  সাবমিট করুন
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              )}
            </button>
          )}

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="animate-fadeIn p-4 mt-4 text-center bg-green-50/80 rounded-lg border border-green-200 backdrop-blur-sm">
              <svg className="w-6 h-6 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="text-green-700 font-medium">
                {bannerData?.description2 || "ধন্যবাদ আপনাকে, আপনার সকল তথ্য সঠিকভাবে সাবমিট করা হয়েছে। আপনি ৫-১০ মিনিটের মধ্যে আপনার হোয়াটসঅ্যাপ নাম্বারে এজেন্ট এর এক্সেস দেওয়া হবে"}
              </p>
            </div>
          )}
        </form>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;