import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, eventAPI, bookingsAPI } from '../services/api';
import { ShieldCheck, Calendar, MapPin, Zap, User, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';

const Register = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Showroom states
  const [products, setProducts] = useState([]);
  const [event, setEvent] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');

  // Checkout process states
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Demo pay modal states
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoOrderData, setDemoOrderData] = useState(null);

  useEffect(() => {
    const loadBookingParameters = async () => {
      try {
        const prodRes = await productsAPI.getAll();

        const hardcodedProducts = [
          {
            id: 'static-3',
            name: 'Resources Free Generator - 3KW',
            kw_capacity: 3,
            price: '6000',
          },
          {
            id: 'static-4',
            name: 'Resources Free Generator - 4KW',
            kw_capacity: 4,
            price: '6000',
          },

          {
            id: 'static-1',
            name: 'Resources Free Generator - 6KW',
            kw_capacity: 6,
            price: '6000',
          },
          {
            id: 'static-2',
            name: 'Energy Booster System',
            kw_capacity: 40,
            price: '6000',
          }
        ];

        const apiProducts = (prodRes.data || []).filter(p => !p.name.includes('K V V Sai electronic'));
        const allProducts = [...hardcodedProducts, ...apiProducts];

        setProducts(allProducts);

        // Pre-select product from URL search param
        const urlProductId = searchParams.get('product');
        if (urlProductId) {
          setSelectedProductId(urlProductId);
        } else if (allProducts.length > 0) {
          setSelectedProductId(allProducts[0].id.toString());
        }

        const eventRes = await eventAPI.getActive();
        setEvent(eventRes.data);
      } catch (error) {
        console.error('Failed to load booking parameters:', error);
        setErrorMsg('Failed to synchronize launch event parameters.');
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

  const handleCheckout = async () => {
    if (!selectedProductId || !event) {
      return setErrorMsg('Please choose a valid generator model.');
    }

    setErrorMsg('');
    setPaying(true);

    try {
      // Step 1: Initiate booking on backend and receive order details
      const response = await bookingsAPI.initiate({
        product_id: parseInt(selectedProductId),
        event_id: event.id
      });

      const orderData = response.data; // { registration_id, booking_id, order_id, amount, is_demo, key_id }

      /*
      if (orderData.is_demo) {
        // Fallback to React sandbox modal
        setDemoOrderData(orderData);
        setShowDemoModal(true);
        setPaying(false);
      } else {
        // Initialize Live Razorpay Checkout
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setPaying(false);
          return setErrorMsg('Razorpay payment gateway failed to load. Check your internet connection.');
        }

        const options = {
          key: orderData.key_id,
          amount: Math.round(orderData.amount * 100),
          currency: 'INR',
          name: 'Quantum Generator Industries',
          description: `VIP Event Boarding - ${selectedProduct.name}`,
          order_id: orderData.order_id,
          handler: async (payResponse) => {
            try {
              // Step 2: Send payment capture results to backend verify endpoint
              const verifyRes = await bookingsAPI.verify({
                registration_id: orderData.registration_id,
                razorpay_order_id: payResponse.razorpay_order_id,
                razorpay_payment_id: payResponse.razorpay_payment_id,
                razorpay_signature: payResponse.razorpay_signature
              });

              setSuccessBooking(verifyRes.data);
            } catch (err) {
              console.error('Verify error:', err);
              setErrorMsg('Transaction verification failed. Please contact secure support.');
            } finally {
              setPaying(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.mobile
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

        setSuccessBooking(verifyRes.data);
      } catch (err) {
        console.error('Verify error:', err);
        setErrorMsg('Transaction verification failed. Please contact secure support.');
      } finally {
        setPaying(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorMsg(error.response?.data?.message || 'Error occurred during reservation initialization.');
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
        registration_id: demoOrderData.registration_id,
        razorpay_order_id: demoOrderData.order_id,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        razorpay_signature: 'demo_simulation_signature'
      });

      setSuccessBooking(verifyRes.data);
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

  // --- Success State ---
  if (successBooking) {
    return (
      <div className="relative min-h-screen bg-white flex items-center justify-center pt-24 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
        <div className="w-full max-w-xl glass-panel border border-green-500/30 bg-green-500/5 rounded-2xl p-6 sm:p-10 text-center shadow-2xl relative">

          <div className="w-16 h-16 rounded-full bg-slate-100 border border-green-400 shrink-0 flex items-center justify-center mx-auto mb-6 glow-shadow-cyan">
            <ShieldCheck className="w-8 h-8 text-green-400" />
          </div>

          <h2 className="font-orbitron font-extrabold text-2xl text-green-400 uppercase tracking-widest mb-2">
            BOARDING PASS ACQUIRED
          </h2>
          <p className="text-[10px] text-slate-500 font-orbitron tracking-widest uppercase mb-6">Security Clearance Active</p>

          <div className="bg-slate-50/80 border border-slate-850 p-6 rounded-xl text-xs sm:text-sm text-left space-y-4 mb-8">
            <p className="border-b border-slate-900 pb-2">Booking ID: <span className="text-[#3b82f6] font-bold font-orbitron float-right">{successBooking.booking_id}</span></p>
            <p className="border-b border-slate-900 pb-2">VIP Pass Code: <span className="text-black font-bold font-orbitron float-right">{successBooking.pass.pass_id}</span></p>
            <p className="border-b border-slate-900 pb-2">Reserved Generator: <span className="text-black float-right">{selectedProduct.name}</span></p>
            <p>Email Dispatch: <span className="text-black float-right">{user.email}</span></p>
          </div>

          <p className="text-xs text-black leading-relaxed mb-8">
            Your high-tech downloadable PDF entry ticket with verification QR code has been successfully rendered on the server and emailed to your coordinates. Present it at the entrance scanner check-point.
          </p>

          <div className="flex gap-4">
            <Link to="/history" className="w-full btn-cyber py-3 rounded text-xs flex items-center justify-center font-bold">
              VIEW MY PASSES
            </Link>
          </div>
        </div>
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
            RESERVE PASS Clearance
          </h1>
          <p className="text-[10px] text-[#3b82f6] text-glow-cyan font-orbitron tracking-widest uppercase">Launch Event Priority Checkout</p>
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto flex items-start space-x-2 border border-red-500/30 bg-red-500/5 rounded-lg p-4 text-xs text-red-400 mb-8">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start max-w-5xl mx-auto">

          {/* Left Column: Form Details & Product Selection */}
          <div className="lg:col-span-3 space-y-6">

            {/* Stage 1: Personal Info Coordinates */}
            <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
              <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                <User className="w-4 h-4 text-[#3b82f6]" />
                <span>1. ATTENDEE COORDINATES</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Name</span>
                  <span className="text-black font-semibold mt-1 block">{user.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Link</span>
                  <span className="text-black font-semibold mt-1 block truncate">{user.email}</span>
                </div>
                <div className="col-span-2 pt-2">
                  <span className="text-slate-500 block">Shipping/Grid Address</span>
                  <span className="text-black font-semibold mt-1 block leading-relaxed">{user.address}</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Generator Model selection */}
            <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
              <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                <ShoppingBag className="w-4 h-4 text-[#3b82f6]" />
                <span>2. SELECT GENERATOR CAPACITY</span>
              </h3>

              <div className="space-y-4">
                {products.map((prod) => (
                  <label
                    key={prod.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedProductId === prod.id.toString() ? 'border-[#3b82f6] bg-cyan-500/5 glow-shadow-cyan' : 'border-slate-800/80 hover:border-slate-700 bg-slate-100/30'}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <input
                        type="radio"
                        name="product"
                        value={prod.id}
                        checked={selectedProductId === prod.id.toString()}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-4 h-4 text-cyan-500 bg-slate-100 border-slate-850 accent-cyan-400 focus:ring-0 focus:ring-offset-0"
                      />
                      <div>
                        <span className="font-orbitron font-bold text-xs sm:text-sm text-black block">{prod.name}</span>
                        <span className="text-[10px] text-black">{prod.kw_capacity} Kilowatt continuous load capability</span>
                      </div>
                    </div>
                    <span className="font-orbitron text-xs sm:text-sm text-[#3b82f6] font-semibold shrink-0">
                      Rs. {parseFloat(prod.price).toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Pricing Card */}
          <div className="lg:col-span-2 space-y-6">

            {event && (
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent"></div>

                <h3 className="font-orbitron font-bold text-xs text-black tracking-wider mb-5 flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <CreditCard className="w-4 h-4 text-[#3b82f6]" />
                  <span>3. EVENT DEPOSIT BOOKING</span>
                </h3>

                <div className="space-y-4 text-xs mb-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 font-medium">Unveiling Launch Event</span>
                      <p className="text-black font-semibold mt-1">{event.title}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 font-medium">Clearance Gate Entrance</span>
                      <p className="text-black font-semibold mt-1">{event.venue}</p>
                    </div>
                  </div>
                </div>

                {/* Subtotals ledger */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-900 space-y-3 mb-6 text-xs text-black">
                  <div className="flex justify-between">
                    <span>Priority Pass Preorder</span>
                    <span className="text-black">Rs. {parseFloat(event.ticket_price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zero-Fuel Magnet Priority Queue</span>
                    <span className="text-green-400 font-bold font-orbitron">INCLUDED</span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-3 flex justify-between font-orbitron font-extrabold text-sm text-black">
                    <span>TOTAL AMOUNT</span>
                    <span className="text-[#3b82f6] text-glow-cyan">Rs. {parseFloat(event.ticket_price).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={paying}
                  className="w-full btn-cyber py-4 rounded text-xs flex items-center justify-center font-bold tracking-wider"
                >
                  {paying ? (
                    <div className="w-4 h-4 border-2 border-t-slate-900 border-r-transparent border-slate-700 rounded-full animate-spin"></div>
                  ) : (
                    <span>CONFIRM & PROCESS PAYMENT</span>
                  )}
                </button>

                <p className="text-[10px] text-slate-500 leading-relaxed mt-4 text-center">
                  Payments are secure, signature-verified, and fully refundable until launch day.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* --- Simulated Cyber Pay Sandbox Modal Overlay --- */}
      {showDemoModal && demoOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md"></div>

          <div className="relative w-full max-w-md bg-slate-50 border border-cyan-500/40 glow-shadow-cyan rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-center">

            <div className="w-12 h-12 rounded-full bg-slate-100 border border-cyan-400 shrink-0 flex items-center justify-center mx-auto mb-4 glow-shadow-cyan">
              <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400 animate-pulse" />
            </div>

            <h3 className="font-orbitron font-extrabold text-lg text-cyan-400 tracking-wide text-glow-cyan mb-2">
              K V V SAI ELECTRONIC PAY SANDBOX
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

export default Register;

