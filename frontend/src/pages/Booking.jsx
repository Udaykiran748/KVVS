import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, eventAPI, bookingsAPI } from '../services/api';
import { ShieldCheck, Calendar, MapPin, Zap, User, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';

const Booking = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Showroom states
  const [products, setProducts] = useState([]);
  const [event, setEvent] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedKw, setSelectedKw] = useState('');

  // Checkout process states
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsParagraphs] = useState([
    "By accessing and using this website, you agree to comply with and be bound by these Terms and Conditions. The website is intended to provide information about our products, services, events, and booking facilities. Users must ensure that all information provided during registration, booking, or payment is accurate, complete, and up to date. Any misuse of the website may result in the suspension or termination of access.",
    "All bookings made through the website are subject to availability and confirmation. Users are responsible for reviewing the details of their booking before completing the payment process. Once a booking is confirmed, changes or cancellations may be subject to company policies. The company reserves the right to refuse or cancel any booking if inaccurate information, fraudulent activity, or policy violations are detected.",
    "Payments made through the website must be completed using approved payment methods. All transactions are processed through secure payment gateways to protect customer information. The company is not responsible for delays, technical failures, or interruptions caused by third-party payment service providers. Users are advised to retain payment receipts and booking confirmations for future reference.",
    "All content available on this website, including text, images, logos, designs, videos, and software, is the property of the company and is protected by applicable intellectual property laws. Users may not copy, reproduce, distribute, modify, or use any content from the website without prior written permission from the company. Unauthorized use of website content may result in legal action.",
    "The company reserves the right to modify, update, or discontinue any part of the website, products, services, or these Terms and Conditions at any time without prior notice. While reasonable efforts are made to ensure the accuracy of information provided on the website, the company does not guarantee that all content will always be error-free or uninterrupted. Continued use of the website after any changes indicates acceptance of the revised Terms and Conditions."
  ]);
  const [termChecks, setTermChecks] = useState(Array(5).fill(false));

  const handleTermCheck = (index) => {
    setTermChecks(prev => {
      const next = [...prev];
      next[index] = !next[index];
      setAcceptedTerms(next.every(Boolean));
      return next;
    });
  };

  const handleMasterCheckboxChange = (e) => {
    const checked = e.target.checked;
    setAcceptedTerms(checked);
    setTermChecks(Array(termsParagraphs.length).fill(checked));
  };

  // Form Details State
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    emailAddress: '',
    password: '',
    companyName: '',
    generatorCapacity: '',
    deliveryAddress: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'RAZORPAY',
    motorCondition: '',
    motorAge: '',
    motorHp: '',
    generatorKw: '',
    generatorHp: '',
    generatorOthers: '',
    userDescription: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Demo pay modal states
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoOrderData, setDemoOrderData] = useState(null);

  useEffect(() => {
    const loadBookingParameters = async () => {
      const hardcodedProducts = [
        {
          id: '1',
          name: 'Resources Free Generator',
          min_kw: 5,
          max_kw: 40,
          base_price_per_kw: 6000
        },
        {
          id: '2',
          name: 'Energy Booster System',
          min_kw: 40,
          max_kw: 1000,
          base_price_per_kw: 6000
        }
      ];

      setProducts(hardcodedProducts);

      // Pre-select product from URL search param or navigation state
      const urlProductId = location.state?.product || searchParams.get('product');
      if (urlProductId && hardcodedProducts.find(p => p.id === urlProductId)) {
        setSelectedProductId(urlProductId);
      } else {
        setSelectedProductId('1');
      }

      try {
        const prodRes = await productsAPI.getAll();
        const eventRes = await eventAPI.getActive();
        setEvent(eventRes.data);
      } catch (error) {
        console.error('Failed to load booking parameters:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBookingParameters();
  }, [searchParams]);

  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);

  // Script loader helper for Live Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleContinueToTerms = () => {
    if (!formData.customerName || !formData.emailAddress || !formData.mobileNumber || (!user && !formData.password)) {
      return setErrorMsg('Please fill out all required customer details (Name, Email, Mobile' + (!user ? ', Password' : '') + ').');
    }

    if (!formData.generatorKw && !formData.generatorHp && !formData.generatorOthers) {
      return setErrorMsg('Please select a Generator Capacity (KW, HP, or Others).');
    }

    // No longer checking for event availability

    setErrorMsg('');
    setStep(2);
  };

  const handleContinueToPayment = () => {
    if (!acceptedTerms) {
      return setErrorMsg('Please accept the Terms & Conditions to proceed.');
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleCheckout = async () => {
    setErrorMsg('');
    setPaying(true);

    try {
      const capacityStr = formData.generatorKw || formData.generatorHp || formData.generatorOthers || '0';
      const parsedKw = parseFloat(capacityStr) || 0;
      const baseTotal = (selectedProduct?.base_price_per_kw || 6000) * parsedKw;
      const cgst = baseTotal * 0.09;
      const sgst = baseTotal * 0.09;
      const calculatedTotal = baseTotal + cgst + sgst;
      let orderData = null;
      try {
        const response = await bookingsAPI.initiate({
          product_id: parseInt(selectedProductId),
          kw_capacity: parsedKw,
          amount: calculatedTotal,
          event_id: event?.id || 1,
          customer_name: formData.customerName,
          mobile_number: formData.mobileNumber,
          email_address: formData.emailAddress,
          company_name: formData.companyName,
          delivery_address: formData.deliveryAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          payment_method: formData.paymentMethod,
          motor_condition: formData.motorCondition,
          motor_age: formData.motorAge,
          motor_hp: formData.motorHp,
          generator_kw: formData.generatorKw,
          generator_hp: formData.generatorHp,
          generator_others: formData.generatorOthers,
          user_description: formData.userDescription,
          password: formData.password
        });
        orderData = response.data;
      } catch (err) {
        console.log("Backend logging failed:", err);
        const backendMsg = err.response?.data?.message || err.response?.data?.error || err.message;
        throw new Error(`Checkout Error: ${backendMsg}`);
      }

      /*
      if (orderData.is_demo) {
        setDemoOrderData(orderData);
        setShowDemoModal(true);
        setPaying(false);
      } else {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setPaying(false);
          return setErrorMsg('Razorpay payment gateway failed to load. Check your internet connection.');
        }

        const options = {
          key: orderData.key_id,
          amount: Math.round(orderData.amount * 100),
          currency: 'INR',
          name: 'KVVSai Electricals',
          description: `Generator Booking - ${selectedProduct?.name} (${selectedKw} KW)`,
          order_id: orderData.order_id,
          handler: async (payResponse) => {
            try {
              const verifyRes = await bookingsAPI.verify({
                booking_generator_id: orderData.booking_generator_id,
                razorpay_order_id: payResponse.razorpay_order_id,
                razorpay_payment_id: payResponse.razorpay_payment_id,
                razorpay_signature: payResponse.razorpay_signature
              });
              navigate(`/receipt/${verifyRes.data.booking_id}`, {
                state: {
                  successBooking: verifyRes.data,
                  selectedProduct,
                  selectedKw,
                  emailAddress: formData.emailAddress
                }
              });
            } catch (err) {
              setErrorMsg('Transaction verification failed. Please contact secure support.');
            } finally {
              setPaying(false);
            }
          },
          prefill: {
            name: formData.customerName,
            email: formData.emailAddress,
            contact: formData.mobileNumber
          },
          theme: {
            color: '#030303'
          },
          modal: {
            ondismiss: () => {
              setPaying(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Razorpay payment failed:', response.error);
          setErrorMsg(`Payment Failed: ${response.error.description}`);
          setPaying(false);
        });
        rzp.open();
      }
      */

      // Auto bypass
      try {
        const verifyRes = await bookingsAPI.verify({
          booking_generator_id: orderData.booking_generator_id,
          razorpay_order_id: orderData.order_id,
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
          razorpay_signature: 'auto_bypassed_signature'
        });
        navigate(`/receipt/${verifyRes.data.booking_id}`, {
          state: {
            successBooking: verifyRes.data,
            selectedProduct,
            selectedKw,
            emailAddress: formData.emailAddress
          }
        });
      } catch (err) {
        setErrorMsg('Transaction verification failed. Please contact secure support.');
        setPaying(false);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setErrorMsg('Error occurred during checkout redirect: ' + (error.message || JSON.stringify(error)));
      setPaying(false);
    }
  };

  const handleDemoPaymentVerify = async (status) => {
    setShowDemoModal(false);
    setPaying(true);

    if (status === 'fail') {
      setErrorMsg('Demo checkout cancelled or simulated payment failed.');
      setPaying(false);
      return;
    }

    try {
      const verifyRes = await bookingsAPI.verify({
        booking_generator_id: demoOrderData.booking_generator_id,
        razorpay_order_id: demoOrderData.order_id,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        razorpay_signature: 'demo_simulation_signature'
      });

      navigate(`/receipt/${verifyRes.data.booking_id}`, {
        state: {
          successBooking: verifyRes.data,
          selectedProduct,
          selectedKw,
          emailAddress: formData.emailAddress
        }
      });
    } catch (err) {
      console.error('Demo verify error:', err);
      setErrorMsg('Simulated checkout verification error.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#3b82f6] border-r-transparent border-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pt-28 pb-20 overflow-hidden">

      {/* Decorative background grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Header --- */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-extrabold text-3xl text-black mb-2 tracking-wider">
            BOOKING GENERATORS
          </h1>
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto flex items-start space-x-2 border border-red-500/30 bg-red-500/5 rounded-lg p-4 text-xs text-red-400 mb-8">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">

          {step === 1 && (
            <>
              {/* Customer Details */}
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
                <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <User className="w-4 h-4 text-[#3b82f6]" />
                  <span>1. CUSTOMER DETAILS</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Customer Name *</span>
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="Full Name" required />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Mobile Number *</span>
                    <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="Mobile Number" required />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Email Address *</span>
                    <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="Email Address" required />
                  </div>
                  {!user && (
                    <div>
                      <span className="text-slate-500 block mb-1">Password *</span>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="Enter Your Password" required />
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block mb-1">Company Name (Optional)</span>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="Company Name" />
                  </div>
                </div>
              </div>

              {/* Generator Details */}
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
                <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <ShoppingBag className="w-4 h-4 text-[#3b82f6]" />
                  <span>2. GENERATOR DETAILS</span>
                </h3>
                <div className="space-y-4">
                  {products.map((prod) => (
                    <label
                      key={prod.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedProductId === prod.id.toString() ? 'border-[#3b82f6] bg-blue-500/5 glow-shadow-blue' : 'border-slate-800/80 hover:border-slate-700 bg-slate-100/30'}`}
                    >
                      <div className="flex items-center space-x-3.5 w-full">
                        <input
                          type="radio"
                          name="product"
                          value={prod.id}
                          checked={selectedProductId === prod.id.toString()}
                          onChange={(e) => {
                            setSelectedProductId(e.target.value);
                            setSelectedKw('');
                          }}
                          className="w-4 h-4 text-blue-500 bg-slate-100 border-slate-850 accent-blue-400 focus:ring-0 focus:ring-offset-0 shrink-0"
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <div>
                            <span className="font-orbitron font-bold text-xs sm:text-sm text-black block">{prod.name}</span>
                            <span className="text-[10px] text-slate-500">Range: {prod.id === '1' ? '5 HP - 40 HP | 6 KW - 40 KW' : '5 HP - 100 HP | 40 KW - 1MVA'}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}

                  {selectedProduct && selectedProduct.id === '1' ? (
                    <div className="mt-6 space-y-4">
                      {/* Field 1: KW Range */}
                      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-50/50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-2">
                          SELECT CAPACITY (KW)
                        </label>
                        <select
                          name="generatorKw"
                          value={formData.generatorKw}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                        >
                          <option value="" disabled hidden>Select KW Range</option>
                          {Array.from({ length: 35 }, (_, i) => i + 6).map(val => (
                            <option key={`kw-${val}`} value={`${val} KW`}>{val} KW</option>
                          ))}
                        </select>
                      </div>

                      {/* Field 2: HP Range */}
                      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-50/50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-2">
                          SELECT CAPACITY (HP)
                        </label>
                        <select
                          name="generatorHp"
                          value={formData.generatorHp}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                        >
                          <option value="" disabled hidden>Select HP Range</option>
                          {Array.from({ length: 36 }, (_, i) => i + 5).map(val => (
                            <option key={`hp-${val}`} value={`${val} HP`}>{val} HP</option>
                          ))}
                        </select>
                      </div>

                      {/* Field 3: User Motor Model */}
                      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-50/50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-3">
                          USER MOTOR MODEL
                        </label>
                        <div className="flex gap-4 mb-3">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="motorCondition"
                              value="new"
                              checked={formData.motorCondition === 'new'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-500 bg-slate-100 border-slate-800 focus:ring-0"
                            />
                            <span className="text-xs text-black font-semibold">New Motor</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="motorCondition"
                              value="old"
                              checked={formData.motorCondition === 'old'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-500 bg-slate-100 border-slate-800 focus:ring-0"
                            />
                            <span className="text-xs text-black font-semibold">Old Motor</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="motorCondition"
                              value="others"
                              checked={formData.motorCondition === 'others'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-500 bg-slate-100 border-slate-800 focus:ring-0"
                            />
                            <span className="text-xs text-black font-semibold">Others</span>
                          </label>
                        </div>

                        {formData.motorCondition && formData.motorCondition !== 'others' && (
                          <div className="mt-3 space-y-4">
                            <div>
                              <label className="block text-xs font-orbitron font-bold text-black mb-2">
                                SELECT MOTOR AGE ({formData.motorCondition === 'new' ? 'NEW' : 'OLD'})
                              </label>
                              <select
                                name="motorAge"
                                value={formData.motorAge}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                              >
                                <option value="" disabled hidden>Select Motor Age</option>
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="1 - 3 years">1 - 3 years</option>
                                <option value="3 - 5 years">3 - 5 years</option>
                                <option value="5 - 10 years">5 - 10 years</option>
                                <option value="More than 10 years">More than 10 years</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-orbitron font-bold text-black mb-2">
                                SELECT MOTOR HP ({formData.motorCondition === 'new' ? 'NEW' : 'OLD'})
                              </label>
                              <select
                                name="motorHp"
                                value={formData.motorHp}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                              >
                                <option value="" disabled hidden>Select Motor HP</option>
                                {Array.from({ length: 96 }, (_, i) => i + 5).map(val => (
                                  <option key={`user-motor-${val}`} value={`${val} HP`}>{val} HP</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                        {formData.motorCondition === 'others' && (
                          <div className="mt-3">
                            <label className="block text-xs font-orbitron font-bold text-black mb-2">
                              OTHERS (TYPE CAPACITY)
                            </label>
                            <input
                              type="text"
                              name="motorHpOther"
                              value={formData.motorHpOther || ''}
                              onChange={handleInputChange}
                              placeholder="Type Customer Special Requirements"
                              className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* Field 4: Special Requirements */}
                      <div className="p-4 border border-slate-800/80 rounded-xl bg-slate-50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-2 text-center">
                          ANY SPECIAL REQUIREMENTS
                        </label>
                        <textarea
                          name="userDescription"
                          value={formData.userDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                          placeholder="Type your special requirements or description here"
                          rows="3"
                        ></textarea>
                        <p className="text-[10px] text-black font-semibold text-center mt-2">
                          Please contact us for special requirements:<br />
                          <span className="text-blue-600">+91 9035121902 | <a href="mailto:Kvvsaielectricals@gmail.com" className="hover:underline">Kvvsaielectricals@gmail.com</a></span>
                        </p>
                      </div>
                    </div>
                  ) : selectedProduct && selectedProduct.id === '2' ? (
                    <div className="mt-6 space-y-4">
                      {/* Field 1: KW Range */}
                      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-50/50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-2">
                          SELECT CAPACITY (KW)
                        </label>
                        <select
                          name="generatorKw"
                          value={formData.generatorKw}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                        >
                          <option value="" disabled hidden>Select KW Range</option>
                          <option value="40 KW">40 KW</option>
                          <option value="50 KW">50 KW</option>
                          <option value="100 KW">100 KW</option>
                          <option value="200 KW">200 KW</option>
                          <option value="300 KW">300 KW</option>
                          <option value="400 KW">400 KW</option>
                          <option value="500 KW">500 KW</option>
                          <option value="750 KW">750 KW</option>
                          <option value="1000 KW">1 MVA</option>
                        </select>
                      </div>

                      {/* Field 2: HP Range */}
                      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-50/50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-2">
                          SELECT CAPACITY (HP)
                        </label>
                        <select
                          name="generatorHp"
                          value={formData.generatorHp}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                        >
                          <option value="" disabled hidden>Select HP Range</option>
                          {Array.from({ length: 96 }, (_, i) => i + 5).map(val => (
                            <option key={`hp-${val}`} value={`${val} HP`}>{val} HP</option>
                          ))}
                        </select>
                      </div>

                      {/* Field 3: Others Input */}
                      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-50/50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-2">
                          OTHERS (TYPE CAPACITY)
                        </label>
                        <input
                          type="text"
                          name="generatorOthers"
                          value={formData.generatorOthers}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                          placeholder="Type capacity here (e.g., 500 KW)"
                        />
                      </div>

                      {/* Field 4: User Motor Model */}
                      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-50/50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-3">
                          USER MOTOR MODEL
                        </label>
                        <div className="flex gap-4 mb-3">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="motorCondition"
                              value="new"
                              checked={formData.motorCondition === 'new'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-500 bg-slate-100 border-slate-800 focus:ring-0"
                            />
                            <span className="text-xs text-black font-semibold">New Motor</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="motorCondition"
                              value="old"
                              checked={formData.motorCondition === 'old'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-500 bg-slate-100 border-slate-800 focus:ring-0"
                            />
                            <span className="text-xs text-black font-semibold">Old Motor</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="motorCondition"
                              value="others"
                              checked={formData.motorCondition === 'others'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-500 bg-slate-100 border-slate-800 focus:ring-0"
                            />
                            <span className="text-xs text-black font-semibold">Others</span>
                          </label>
                        </div>

                        {formData.motorCondition && formData.motorCondition !== 'others' && (
                          <div className="mt-3 space-y-4">
                            <div>
                              <label className="block text-xs font-orbitron font-bold text-black mb-2">
                                SELECT MOTOR AGE ({formData.motorCondition === 'new' ? 'NEW' : 'OLD'})
                              </label>
                              <select
                                name="motorAge"
                                value={formData.motorAge}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                              >
                                <option value="" disabled hidden>Select Motor Age</option>
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="1 - 3 years">1 - 3 years</option>
                                <option value="3 - 5 years">3 - 5 years</option>
                                <option value="5 - 10 years">5 - 10 years</option>
                                <option value="More than 10 years">More than 10 years</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-orbitron font-bold text-black mb-2">
                                SELECT MOTOR HP ({formData.motorCondition === 'new' ? 'NEW' : 'OLD'})
                              </label>
                              <select
                                name="motorHp"
                                value={formData.motorHp}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                              >
                                <option value="" disabled hidden>Select Motor HP</option>
                                {Array.from({ length: 96 }, (_, i) => i + 5).map(val => (
                                  <option key={`user-motor-2-${val}`} value={`${val} HP`}>{val} HP</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                        {formData.motorCondition === 'others' && (
                          <div className="mt-3">
                            <label className="block text-xs font-orbitron font-bold text-black mb-2">
                              OTHERS (TYPE CAPACITY)
                            </label>
                            <input
                              type="text"
                              name="motorHpOther"
                              value={formData.motorHpOther || ''}
                              onChange={handleInputChange}
                              placeholder="Type capacity here (e.g., 500 HP)"
                              className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* Field 5: Special Requirements */}
                      <div className="p-4 border border-slate-800/80 rounded-xl bg-slate-50">
                        <label className="block text-xs font-orbitron font-bold text-black mb-2 text-center">
                          ANY SPECIAL REQUIREMENTS
                        </label>
                        <textarea
                          name="userDescription"
                          value={formData.userDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black text-xs"
                          placeholder="Type your special requirements or description here"
                          rows="3"
                        ></textarea>
                        <p className="text-[10px] text-black font-semibold text-center mt-2">
                          Please contact us for special requirements:<br />
                          <span className="text-blue-600">+91 9035121902 | <a href="mailto:Kvvsaielectricals@gmail.com" className="hover:underline">Kvvsaielectricals@gmail.com</a></span>
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>



              {/* Delivery Address */}
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
                <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <MapPin className="w-4 h-4 text-[#3b82f6]" />
                  <span>3. ADDRESS</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block mb-1">Address</span>
                    <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="Full Address" rows="2"></textarea>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">City</span>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="City" />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">State</span>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="State" />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Pincode</span>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-800 rounded focus:outline-none focus:border-blue-500 text-black" placeholder="Pincode" />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleContinueToTerms}
                  className="w-full btn-cyber py-4 rounded text-xs flex items-center justify-center font-bold tracking-wider"
                >
                  <span>CONTINUE TO TERMS</span>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Terms and Conditions */}
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
                <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <ShieldCheck className="w-4 h-4 text-[#3b82f6]" />
                  <span>4. TERMS & CONDITIONS</span>
                </h3>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-900 mb-6 text-xs text-slate-600 h-64 overflow-y-auto space-y-4">

                  {termsParagraphs.length > 0 ? termsParagraphs.map((paragraph, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-blue-500 bg-slate-100 border-slate-300 rounded focus:ring-0 shrink-0 cursor-pointer"
                        checked={termChecks[index] || false}
                        onChange={() => handleTermCheck(index)}
                      />
                      <div>
                        <p className="text-sm text-black">
                          {paragraph}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-slate-500">
                      No specific terms have been configured yet.
                    </div>
                  )}
                </div>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={handleMasterCheckboxChange}
                    className="mt-1 w-4 h-4 text-blue-500 bg-slate-100 border-slate-850 rounded focus:ring-0 focus:ring-offset-0 shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-black font-semibold">
                    I have read and agree to all the Terms & Conditions above and confirm that the generator will be used for agricultural purposes only.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-4 rounded font-orbitron border border-slate-800 bg-slate-100/50 text-slate-500 hover:text-black hover:bg-slate-200 transition-colors text-xs font-bold tracking-wider"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    disabled={!acceptedTerms}
                    className={`w-2/3 py-4 rounded text-xs flex items-center justify-center font-bold tracking-wider transition-colors ${acceptedTerms ? 'btn-cyber' : 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-400'}`}
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Payment Details */}
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
                <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <CreditCard className="w-4 h-4 text-[#3b82f6]" />
                  <span>5. PAYMENT DETAILS</span>
                </h3>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-900 space-y-3 mb-6 text-xs text-black">
                  <div className="flex justify-between">
                    <span>Selected Capacity ({formData.generatorKw || formData.generatorHp || formData.generatorOthers || '0'})</span>
                    <span className="text-black">
                      Rs. {(parseFloat(formData.generatorKw || formData.generatorHp || formData.generatorOthers || '0') * (selectedProduct?.base_price_per_kw || 6000)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (9%)</span>
                    <span className="text-black">
                      Rs. {(parseFloat(formData.generatorKw || formData.generatorHp || formData.generatorOthers || '0') * (selectedProduct?.base_price_per_kw || 6000) * 0.09).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (9%)</span>
                    <span className="text-black">
                      Rs. {(parseFloat(formData.generatorKw || formData.generatorHp || formData.generatorOthers || '0') * (selectedProduct?.base_price_per_kw || 6000) * 0.09).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-3 flex justify-between font-orbitron font-extrabold text-sm text-black">
                    <span>TOTAL AMOUNT</span>
                    <span className="text-[#3b82f6] text-glow-blue">
                      Rs. {(parseFloat(formData.generatorKw || formData.generatorHp || formData.generatorOthers || '0') * (selectedProduct?.base_price_per_kw || 6000) * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/3 py-4 rounded font-orbitron border border-slate-800 bg-slate-100/50 text-slate-500 hover:text-black hover:bg-slate-200 transition-colors text-xs font-bold tracking-wider"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={paying}
                    className="w-2/3 btn-cyber py-4 rounded text-xs flex items-center justify-center font-bold tracking-wider"
                  >
                    {paying ? (
                      <div className="w-4 h-4 border-2 border-t-slate-900 border-r-transparent border-slate-700 rounded-full animate-spin"></div>
                    ) : (
                      <span>PAY NOW</span>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed text-center">
                  Payments are secure, signature-verified, and fully refundable until launch day.
                </p>
              </div>
            </>
          )}

        </div>


      </div>

      {/* --- Simulated Cyber Pay Sandbox Modal Overlay --- */}
      {showDemoModal && demoOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md"></div>

          <div className="relative w-full max-w-md bg-slate-50 border border-blue-500/40 glow-shadow-blue rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-center">

            <div className="w-12 h-12 rounded-full bg-slate-100 border border-blue-400 shrink-0 flex items-center justify-center mx-auto mb-4 glow-shadow-blue">
              <Zap className="w-6 h-6 text-blue-400 fill-blue-400 animate-pulse" />
            </div>

            <h3 className="font-orbitron font-extrabold text-lg text-blue-400 tracking-wide text-glow-blue mb-2">
              K V V SAI ELECTRICALS PAY SANDBOX
            </h3>
            <p className="text-[10px] text-slate-500 font-orbitron tracking-widest uppercase mb-6">Demo checkout Simulation Active</p>

            <div className="bg-slate-100 border border-slate-850 p-4 rounded-xl text-left text-xs mb-6 space-y-2">
              <p>Receipt ID: <span className="text-black font-bold font-orbitron float-right">{demoOrderData.booking_id}</span></p>
              <p>Order Hash: <span className="text-black font-bold font-orbitron float-right truncate w-40">{demoOrderData.order_id}</span></p>
              <p>Amount Due: <span className="text-green-400 font-bold float-right">Rs. {parseFloat(demoOrderData.amount).toLocaleString()}</span></p>
            </div>

            <p className="text-xs text-black leading-relaxed mb-6">
              This terminal is bypassing real credit card networks for evaluation purposes. Click Simulate Success to capture transactions and trigger ticket rendering and dispatching logs.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => handleDemoPaymentVerify('fail')}
                className="w-full py-2.5 rounded font-orbitron border border-slate-800 bg-slate-100/50 text-red-400 hover:text-black hover:bg-red-500/10 transition-colors text-xs"
              >
                SIMULATE FAIL
              </button>

              <button
                onClick={() => handleDemoPaymentVerify('success')}
                className="w-full btn-cyber py-2.5 rounded text-xs"
              >
                SIMULATE SUCCESS
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Booking;

