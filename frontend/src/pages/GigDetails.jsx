import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidMessage, setBidMessage] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [hasBid, setHasBid] = useState(false);
  useEffect(() => {
    if (id) {
      fetchGigDetails();
      fetchBids();
    }
  }, [id, user]);

  useEffect(() => {
    if (!socket) return;

    const handleNewBid = (newBid) => {
      if (newBid.gigId === id) {
        setBids((prevBids) => [newBid, ...prevBids]);
        if (user && newBid.freelancerId._id === user._id) {
          setHasBid(true);
        }
      }
    };

    socket.on("new-bid", handleNewBid);
    return () => {
      socket.off("new-bid", handleNewBid);
    };
  }, [socket, id, user]);

  const fetchGigDetails = async () => {
    try {
      const { data: allGigs } = await api.get(`/gigs`);
      const foundGig = allGigs.find((g) => g._id === id);

      if (foundGig) {
        setGig(foundGig);
        if (user && foundGig.ownerId._id === user._id) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      }
    } catch (error) {
      console.error("Error loading gig details");
    }
  };

  const fetchBids = async () => {
    try {
      const { data } = await api.get(`/bids/${id}`);
      setBids(data);
      if (user) {
        const myBid = data.find((bid) => bid.freelancerId._id === user._id);
        if (myBid) {
          setHasBid(true);
        }
      }
    } catch (error) {}
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bids", {
        gigId: id,
        message: bidMessage,
        price: bidPrice,
      });
      toast.success("Bid Placed Successfully!");
      setBidMessage("");
      setBidPrice("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    }
  };

  const handleHire = async (bidId) => {
    try {
      await api.patch(`/bids/${bidId}/hire`);
      toast.success("Freelancer Hired! Project Closed.");
      const updatedBids = bids.map((bid) => {
        if (bid._id === bidId) return { ...bid, status: "hired" };
        return { ...bid, status: "rejected" };
      });
      setBids(updatedBids);
      setGig({ ...gig, status: "assigned" });
    } catch (error) {
      toast.error("Hiring failed");
    }
  };

  if (!gig)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading Gig Details...
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {gig.title}
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              Posted by:{" "}
              <span className="font-medium text-gray-700">
                {gig.ownerId.name}
              </span>
            </p>
          </div>
          <span
            className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
              gig.status === "open"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {gig.status}
          </span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">{gig.description}</p>

        <div className="flex items-center text-xl font-bold text-gray-800">
          Budget: <span className="text-green-600 ml-2">${gig.budget}</span>
        </div>
      </div>

      {isOwner ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Manage Bids ({bids.length})
          </h2>

          {bids.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded text-gray-500">
              No freelancers have bid on this project yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className={`p-6 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center transition-all ${
                    bid.status === "hired"
                      ? "bg-green-50 border-green-200"
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-bold text-lg text-gray-800">
                      {bid.freelancerId.name}
                    </h3>
                    <p className="text-gray-600 mt-1 italic">"{bid.message}"</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-blue-600 font-bold">
                        Bid: ${bid.price}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                          bid.status === "hired"
                            ? "bg-green-200 text-green-800"
                            : bid.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  </div>
                  {gig.status === "open" && bid.status === "pending" && (
                    <button
                      onClick={() => handleHire(bid._id)}
                      className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 transition active:scale-95"
                    >
                      Hire Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          {gig.status === "open" ? (
            <>
              {hasBid ? (
                <div
                  className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-6 rounded shadow-sm"
                  role="alert"
                >
                  <p className="font-bold text-lg">✅ Application Submitted</p>
                  <p>
                    You have already placed a bid on this project. Good luck!
                  </p>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Apply for this Job
                  </h2>
                  <form onSubmit={handleBidSubmit}>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-bold mb-2">
                        Why are you the best fit?
                      </label>
                      <textarea
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        rows="4"
                        placeholder="I can deliver this project in 2 days because..."
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-bold mb-2">
                        Your Bid Price ($)
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="e.g. 500"
                        value={bidPrice}
                        onChange={(e) => setBidPrice(e.target.value)}
                        required
                      />
                    </div>

                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Submit Proposal
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded shadow-sm">
              <p className="font-bold text-lg">⛔ Position Closed</p>
              <p>
                This project has already been assigned to another freelancer.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GigDetails;
