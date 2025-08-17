import React, { useState } from 'react';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../provider/AuthContext';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import axiosSecure from '../../utilities/axiosSecure';
import image from "../../assets/auth.JPG";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const PaymentForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Payment not ready yet. Please wait a second.");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await axiosSecure.post("/create-payment-intent", { amount });
      const clientSecret = res.data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/funds", {
          amount,
          name: user.displayName,
          email: user.email,
          paymentId: paymentIntent.id,
        });
        cardElement?.clear();
        toast.success("Payment successful!");
        onSuccess();
        onClose();
      }
    } catch {
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded" />
      <button
        type="submit"
        disabled={!stripe || isProcessing || !amount || amount <= 0}
        className="btn bg-red-700 text-white hover:bg-red-800 w-full"
      >
        {isProcessing ? "Processing..." : `Pay $${Number(amount).toFixed(2)}`}
      </button>
    </form>
  );
};

const FundingPage = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["funds", page],
    enabled: !loading && !!user,
    queryFn: async () => {
      const res = await axiosSecure.get("/funds", { params: { page, limit } });
      return res.data;
    },
  });

  const funds = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleSuccess = () => refetch();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Funding Page</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="btn bg-red-700 text-white hover:bg-red-800"
        >
          Give Fund
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : funds.length === 0 ? (
        <p>No funds yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Amount ($)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((f, idx) => (
                <tr key={f._id}>
                  <td>{(page - 1) * limit + idx + 1}</td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{Number(f.amount).toFixed(2)}</td>
                  <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn btn-sm ${
                page === i + 1 ? "btn bg-red-700 text-white hover:bg-red-800" : "btn-outline"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Give Fund"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 flex flex-col md:flex-row gap-4">
            {/* Left: Image */}
            <div className="w-full md:w-1/3 flex justify-center items-center bg-gray-100 rounded-lg p-4">
              <img
                src={image}
                alt="Donation"
                className="max-h-40 md:max-h-48 object-contain rounded-lg"
                loading="lazy"
              />
            </div>

            {/* Right: Form */}
            <div className="w-full md:w-2/3 p-4 bg-gray-50 text-black rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">Give Fund</h3>
              <input
                type="number"
                min={1}
                step="0.01"
                placeholder="Enter amount in USD"
                className="input input-bordered w-full mb-4 text-black"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={parseFloat(amount) || 0}
                  onSuccess={handleSuccess}
                  onClose={() => {
                    setIsOpen(false);
                    setAmount("");
                  }}
                />
              </Elements>

              <button
                className="btn bg-red-700 text-white hover:bg-red-800 w-full mt-3"
                onClick={() => {
                  setIsOpen(false);
                  setAmount("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FundingPage;
