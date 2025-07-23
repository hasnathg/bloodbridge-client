import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { useAuth } from '../../provider/AuthContext';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import axiosSecure from '../../utilities/axiosSecure';
import { NavLink } from 'react-router';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/navbar/Navbar';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const PaymentForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (amount <= 0) {
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
        disabled={!stripe || isProcessing}
        className="btn btn-accent text-black w-full"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
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
      const res = await axiosSecure.get("/funds", {
        params: { page, limit },
      });
      return res.data;
    },
  });

  const funds = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleSuccess = () => refetch();

  return (
   <div>
    <Navbar></Navbar>
     <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Funding Page</h2>
        <button onClick={() => setIsOpen(true)} className="btn btn-active btn-accent text-black">
          Give Fund
        </button>
      </div>

      {/*  Funding Table */}
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
                  <td>{f.amount}</td>
                  <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/*  Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn btn-sm ${
                page === i + 1 ? "btn-active btn-accent" : "btn-outline"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/*  Modal for Payment */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Give Fund</h3>
            <input
              type="number"
              placeholder="Enter amount in USD"
              className="input input-bordered w-full mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={parseFloat(amount) || 0}
                onSuccess={handleSuccess}
                onClose={() => setIsOpen(false)}
              />
            </Elements>
            <button
              className="btn btn-sm btn-error w-full mt-2"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer></Footer>
   </div>
  );
};
export default FundingPage;