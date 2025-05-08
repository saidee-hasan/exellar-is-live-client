import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch, FiCheck, FiCopy, FiArrowRight, FiUser, FiPhone, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [whatsappLink, setWhatsappLink] = useState("");
  const [orderId, setOrderId] = useState("");
  const {user} = useAuth();

  const wrapperRef = useRef(null);
  const selectBtnRef = useRef(null);
  const formRef = useRef(null);
  const orderIdRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Generate unique order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${timestamp}-${randomNum}`;
  };

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Generate WhatsApp link when form is submitted
  useEffect(() => {
    if (showConfirmation) {
      const message = `আমার এজেন্ট একাউন্ট এক্টিভেট করুন:\n\nঅর্ডার আইডি: ${orderId}\nনাম: ${name}\nনম্বর: ${number}\nদেশ: ${selectedCountry}\nটাকার পরিমাণ: ${amount}\nপেমেন্ট মেথড: ${selectedPaymentOption}\nট্রানজেকশন নাম্বার: ${senderNumber}`;
      const encodedMessage = encodeURIComponent(message);
      setWhatsappLink(`https://wa.me/8801402050768?text=${encodedMessage}`);
    }
  }, [showConfirmation, orderId, name, number, selectedCountry, amount, selectedPaymentOption, senderNumber]);

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

  const copyOrderId = () => {
    if (orderIdRef.current) {
      navigator.clipboard.writeText(orderId)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy order ID:', err);
        });
    }
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
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
  
    const data = {
      orderId: newOrderId,
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
          setShowConfetti(true);
          
          const submitBtn = document.getElementById('submitBtn');
          if (submitBtn) {
            submitBtn.style.display = 'none';
          }

          formRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 3000);
      })
      .catch(error => {
        console.error('Payment failed:', error);
        setIsSubmitting(false);
        setIsFormFrozen(false);
      });
  };

  const resetForm = () => {
    setSelectedCountry("সাইট সিলেক্ট করুন");
    setName("");
    setNumber("");
    setAmount("");
    setSenderNumber("");
    setSelectedPaymentOption("");
    setIsFormFrozen(false);
    setShowConfirmation(false);
    setShowConfetti(false);
    setOrderId("");
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.style.display = 'block';
    }
  };

  const isSubmitEnabled = checkFormCompletion();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 pt-8 pb-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30"></div>
        <div className="absolute top-20 left-10 w-60 h-60 rounded-full bg-purple-200/20 filter blur-3xl animate-float1"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-indigo-200/20 filter blur-3xl animate-float2"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-blue-200/20 filter blur-2xl animate-float3"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-pink-200/20 filter blur-3xl animate-float4"></div>
      </div>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
          colors={['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']}
        />
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <a 
          href={whatsappLink || "https://wa.me/8801402050768"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
        >
          <FaWhatsapp className="text-2xl" />
        </a>
      </div>

      {/* Real-time Clock */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-sm font-medium text-indigo-700 border border-indigo-100 z-10">
        {currentTime.toLocaleTimeString()}
      </div>

      {/* Banner Image with Animated Border */}
      <div className="relative w-full max-w-md h-48 rounded-t-xl mx-auto overflow-hidden shadow-lg z-10">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url('${bannerData?.imageUrl || "https://i.postimg.cc/5tFXFDLV/Thumbnail-2.jpg"}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 border-4 border-transparent animate-border-pulse rounded-t-xl pointer-events-none"></div>
      </div>

      {/* Form Container with Glass Morphism Effect */}
      <div 
        ref={formRef}
        className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-b-xl shadow-xl flex flex-col justify-center mx-auto border border-white/20 relative overflow-hidden z-10"
      >
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-400/10 rounded-full filter blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/10 rounded-full filter blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-center mb-6 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              এজেন্ট সাইন আপ
            </h2>

   <Link
      to="/order"
      className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
    >
      Order Status
    </Link>
          </div>
          
          <form id="myForm" onSubmit={handleSubmit}>
            {/* Country Select Dropdown with Floating Label */}
            <div className="mb-5 relative">
              <div className={`relative ${isWrapperActive ? "z-20" : ""}`} ref={wrapperRef}>
                <div 
                  className={`flex items-center justify-between h-12 px-4 text-sm bg-white rounded-lg border-2 cursor-pointer transition-all ${
                    isWrapperActive ? "border-indigo-500 shadow-md" : "border-gray-200 hover:border-indigo-400"
                  }`}
                  onClick={() => setIsWrapperActive(!isWrapperActive)}
                >
                  <span className={`truncate ${selectedCountry !== "সাইট সিলেক্ট করুন" ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                    {selectedCountry}
                  </span>
                  <FiChevronDown 
                    className={`text-lg text-gray-500 transition-transform duration-200 ${
                      isWrapperActive ? "transform rotate-180 text-indigo-600" : ""
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
                      className="w-full h-10 text-sm pl-10 pr-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all"
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
                              ? "bg-indigo-50 text-indigo-600 font-medium" 
                              : "hover:bg-gray-50 hover:text-indigo-600"
                          }`}
                          onClick={() => updateName(country)}
                        >
                          {country}
                          {country === selectedCountry && (
                            <FiCheck className="ml-auto text-indigo-600" />
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

            {/* Name Input with Icon */}
            <div className="mb-5 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="আপনার নাম লিখুন"
                  className="w-full h-12 pl-10 pr-4 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isFormFrozen}
                />
              </div>
            </div>

            {/* Number Input with Icon */}
            <div className="mb-5 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম্বার</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="number"
                  name="number"
                  placeholder="আপনার নাম্বার লিখুন"
                  className="w-full h-12 pl-10 pr-4 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                  disabled={isFormFrozen}
                />
              </div>
            </div>

            {/* Payment Notice with Animated Background */}
            <div className="mb-4 p-3 rounded-lg border border-indigo-100 relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-30 animate-gradient-x"></div>
              <p className="relative text-sm text-indigo-600 font-medium z-10">
                {bannerData?.description1 || "এজেন্ট একাউন্ট নিশ্চিত করতে অবশ্যই ১ হাজার টাকা অগ্রিম পেমেন্ট করতে হবে"}
              </p>
            </div>

            {/* Payment Options - Card Style */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">পেমেন্ট অপশন</label>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {["বিকাশ", "নগদ", "রকেট"].map((option) => (
                  <div
                    key={option}
                    className={`relative h-14 rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all p-1 border-2 ${
                      selectedPaymentOption === option
                        ? "bg-white border-indigo-500 shadow-md transform scale-105"
                        : "bg-gray-100 border-gray-200 hover:bg-gray-50 hover:border-indigo-300"
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
                      <div className="absolute top-1 right-1 z-20 w-5 h-5 flex items-center justify-center bg-indigo-500 rounded-full shadow-sm">
                        <FiCheck className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedPaymentOption && (
                <div className="mt-5 animate-fadeIn">
                  <div className="flex items-center mb-3">
                    <FiCreditCard className="text-indigo-600 mr-2" />
                    <p className="text-indigo-600 font-bold">
                      এই নাম্বারে অবশ্যই পেমেন্ট করবেন
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between w-full h-12 bg-white text-indigo-600 text-lg font-bold rounded-lg p-3 mb-4 border-2 border-indigo-200 shadow-sm">
                    <span>01402050768</span>
                    <button
                      type="button"
                      className={`flex items-center px-3 py-1 ml-2 rounded-lg cursor-pointer transition-all ${
                        copied 
                          ? "bg-green-100 text-green-700" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                      onClick={copyPhoneNumber}
                      disabled={isFormFrozen}
                    >
                      {copied ? (
                        <>
                          <FiCheck className="mr-1" /> 
                        </>
                      ) : (
                        <>
                          <FiCopy className="mr-1" /> 
                        </>
                      )}
                    </button>
                  </div>

                  {/* Amount Input with Icon */}
                  <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">টাকার পরিমাণ</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all"
                        placeholder="কতো টাকা পাঠিয়েছেন?"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={isFormFrozen}
                      />
                    </div>
                  </div>

                  {/* Sender Number Input with Icon */}
                  <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">পেমেন্টকারী নাম্বার</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all"
                        placeholder="কোন নাম্বার থেকে পাঠিয়েছেন?"
                        id="sender-number"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        disabled={isFormFrozen}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button with Ripple Effect */}
            {isSubmitEnabled && !showConfirmation && (
              <button
                id="submitBtn"
                type="submit"
                className={`w-full h-12 text-sm font-medium text-white rounded-lg relative overflow-hidden ${
                  isSubmitting 
                    ? "bg-indigo-600 cursor-wait" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                } transition-all duration-300 transform hover:scale-[1.01] ripple`}
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
                    <FiArrowRight className="ml-2 animate-bounce-horizontal" />
                  </span>
                )}
              </button>
            )}

            {/* Confirmation Message with Action Buttons */}
            {showConfirmation && (
              <div className="animate-fadeIn p-4 mt-4 text-center bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200 backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                
                {/* Order ID with Copy Button */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-indigo-700 mb-2">অর্ডার আইডি</h3>
                  <div className="flex items-center justify-between w-full h-12 bg-white text-indigo-600 text-lg font-bold rounded-lg p-3 mb-2 border-2 border-indigo-200 shadow-sm">
                    <span ref={orderIdRef}>{orderId}</span>
                    <button
                      type="button"
                      className={`flex items-center px-3 py-1 ml-2 rounded-lg cursor-pointer transition-all ${
                        copied 
                          ? "bg-green-100 text-green-700" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                      onClick={copyOrderId}
                    >
                      {copied ? (
                        <>
                          <FiCheck className="mr-1" /> 
                        </>
                      ) : (
                        <>
                          <FiCopy className="mr-1" /> 
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="text-green-700 font-medium mb-4">
                  {bannerData?.description2 || "ধন্যবাদ আপনাকে, আপনার সকল তথ্য সঠিকভাবে সাবমিট করা হয়েছে। আপনি ৫-১০ মিনিটের মধ্যে আপনার হোয়াটসঅ্যাপ নাম্বারে এজেন্ট এর এক্সেস দেওয়া হবে"}
                </p>
                
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    নতুন অর্ডার করুন
                  </button>
               
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 30px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, -20px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes float3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float4 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 10px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-float1 {
          animation: float1 15s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 18s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 12s ease-in-out infinite;
        }
        .animate-float4 {
          animation: float4 20s ease-in-out infinite;
        }
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
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes border-pulse {
          0% { border-color: rgba(99, 102, 241, 0.3); }
          50% { border-color: rgba(99, 102, 241, 0.8); }
          100% { border-color: rgba(99, 102, 241, 0.3); }
        }
        .animate-border-pulse {
          animation: border-pulse 2s infinite;
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s infinite;
        }
        .ripple {
          position: relative;
          overflow: hidden;
        }
        .ripple:after {
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform .5s, opacity 1s;
        }
        .ripple:active:after {
          transform: scale(0, 0);
          opacity: .3;
          transition: 0s;
        }
      `}</style>
    </div>
  );
};

export default Home;