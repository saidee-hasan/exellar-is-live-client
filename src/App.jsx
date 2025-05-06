import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch, FiCheck, FiCopy } from 'react-icons/fi';

const App = () => {
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

  const wrapperRef = useRef(null);
  const selectBtnRef = useRef(null);

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
  
    // Log form data
    console.log({
      country: selectedCountry,
      name: name,
      number: number,
      amount: amount,
      senderNumber: senderNumber,
      paymentMethod: selectedPaymentOption
    });
  
    setIsSubmitting(true);
    setIsFormFrozen(true);
  
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 3000);
  };
  const isSubmitEnabled = checkFormCompletion();
  console.log();


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-8 pb-12">
      {/* Banner Image */}
      <div 
        className="w-full max-w-md h-48 bg-cover bg-center rounded-t-2xl mx-auto shadow-lg"
        style={{ backgroundImage: "url('https://i.postimg.cc/5tFXFDLV/Thumbnail-2.jpg')" }}
      ></div>

      {/* Form Container */}
      <div className="w-full max-w-md p-6 bg-white rounded-b-2xl shadow-lg flex flex-col justify-center mx-auto">
        <h2 className="text-center mb-6 text-2xl text-blue-600 font-bold">এজেন্ট সাইন আপ</h2>
        <form id="myForm" onSubmit={handleSubmit}>
          {/* Country Select Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">সিলেক্ট দেশ</label>
            <div className={`relative ${isWrapperActive ? "z-10" : ""}`} ref={wrapperRef}>
              <div 
                className="flex items-center justify-between h-12 px-4 text-sm bg-gray-50 rounded-lg border-2 border-gray-300 cursor-pointer transition-all hover:border-blue-500"
                onClick={() => setIsWrapperActive(!isWrapperActive)}
              >
                <span className={`${selectedCountry !== "সাইট সিলেক্ট করুন" ? "text-blue-600" : "text-gray-500"}`}>
                  {selectedCountry}
                </span>
                <FiChevronDown 
                  className={`text-lg text-gray-500 transition-transform duration-200 ${isWrapperActive ? "transform rotate-180" : ""}`} 
                />
              </div>
              <div className={`${isWrapperActive ? "block" : "hidden"} absolute w-full mt-1 p-4 bg-white rounded-lg shadow-xl border border-gray-200`}>
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    spellCheck="false"
                    type="text"
                    placeholder="Search"
                    className="w-full h-10 text-sm pl-10 pr-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <li
                        key={country}
                        className={`flex items-center h-10 px-3 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 rounded transition-colors ${
                          country === selectedCountry ? "bg-blue-100 text-blue-600 font-medium" : ""
                        }`}
                        onClick={() => updateName(country)}
                      >
                        {country}
                        {country === selectedCountry && <FiCheck className="ml-auto text-blue-600" />}
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
              className="w-full h-12 px-4 text-sm rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
              className="w-full h-12 px-4 text-sm rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              disabled={isFormFrozen}
            />
          </div>

          <p className="text-sm mb-4 text-blue-600 font-medium">
            এজেন্ট একাউন্ট নিশ্চিত করতে অবশ্যই ১ হাজার টাকা অগ্রিম পেমেন্ট করতে হবে
          </p>

          {/* Payment Options */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">পেমেন্ট অপশন</label>
            <div className="flex justify-between mb-5">
              <div
                className={`w-28 h-14 rounded-xl bg-white flex flex-col justify-center items-center cursor-pointer transition-all p-1 border-2 ${
                  selectedPaymentOption === "বিকাশ" ? "border-blue-600 shadow-lg" : "border-gray-300 hover:border-blue-400"
                }`}
                onClick={() => !isFormFrozen && selectOption("বিকাশ")}
              >
                <img 
                  src="https://i.postimg.cc/8CkmVGx1/images-22.jpg" 
                  alt="বিকাশ" 
                  className="w-full h-full rounded-lg object-contain"
                />
              </div>
              <div
                className={`w-28 h-14 rounded-xl bg-white flex flex-col justify-center items-center cursor-pointer transition-all p-1 border-2 ${
                  selectedPaymentOption === "নগদ" ? "border-blue-600 shadow-lg" : "border-gray-300 hover:border-blue-400"
                }`}
                onClick={() => !isFormFrozen && selectOption("নগদ")}
              >
                <img 
                  src="https://i.postimg.cc/tTM1wGGm/images-2.png" 
                  alt="নগদ" 
                  className="w-full h-full rounded-lg object-contain"
                />
              </div>
              <div
                className={`w-28 h-14 rounded-xl bg-white flex flex-col justify-center items-center cursor-pointer transition-all p-1 border-2 ${
                  selectedPaymentOption === "রকেট" ? "border-blue-600 shadow-lg" : "border-gray-300 hover:border-blue-400"
                }`}
                onClick={() => !isFormFrozen && selectOption("রকেট")}
              >
                <img 
                  src="https://i.postimg.cc/5NR15Qtw/images-23.jpg" 
                  alt="রকেট" 
                  className="w-full h-full rounded-lg object-contain"
                />
              </div>
            </div>

            {selectedPaymentOption && (
              <div className="mt-5">
                <p className="text-blue-600 font-bold mb-3">
                  এই নাম্বারে অবশ্যই পেমেন্ট করবেন
                </p>
                <div className="flex items-center justify-between w-full h-12 bg-white text-blue-600 text-lg font-bold rounded-lg p-3 mb-4 border-2 border-blue-500">
                  <span>01402050768</span>
                  <button
                    type="button"
                    className="flex items-center bg-blue-600 text-white px-3 py-1 ml-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
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
                    className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                    className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
          {isSubmitEnabled && (
            <button
              id="submitBtn"
              type="submit"
              className={`w-full h-12 text-sm text-white rounded-lg relative overflow-hidden flex items-center justify-center ${
                isSubmitEnabled 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer shadow-md" 
                  : "bg-gray-400 cursor-not-allowed"
              } ${isSubmitting ? "opacity-90" : ""} transition-all duration-300`}
              disabled={!isSubmitEnabled || isFormFrozen}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  সকল তথ্য সাবমিট করা হচ্ছে
                </span>
              ) : (
                "সাবমিট করুন"
              )}
            </button>
          )}

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="p-4 mt-6 text-center bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-600 font-bold">
                ধন্যবাদ আপনাকে, আপনার সকল তথ্য সঠিকভাবে সাবমিট করা হয়েছে।
                আপনি ৫-১০ মিনিটের মধ্যে আপনার হোয়াটসঅ্যাপ নাম্বারে এজেন্ট এর এক্সেস দেওয়া হবে
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default App;