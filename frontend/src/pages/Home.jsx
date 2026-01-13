import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGigs();
  }, [search]);

  const fetchGigs = async () => {
    try {
      const { data } = await api.get(`/gigs?search=${search}`);
      setGigs(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Open Gigs</h1>
        <input
          type="text"
          placeholder="Search gigs..."
          className="border p-2 rounded w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <div
            key={gig._id}
            className="bg-white p-6 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">{gig.title}</h2>
            <p className="text-gray-600 mb-4">
              {gig.description.substring(0, 100)}...
            </p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold">${gig.budget}</span>
              <Link
                to={`/gig/${gig._id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
