import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserAppContext } from "../context/UserAppContext";

const SearchBar = () => {
  const { token, user } = useContext(UserAppContext);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleSearch = async () => {
    setError("");
    if (!prompt) return setError("Please enter a search query");

    try {
      const res = await axios.post(
        "https://folder-1.onrender.com/api/auth/search",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponse(res.data.response);
      fetchSearchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching response");
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const res = await axios.get("https://folder-1.onrender.com/api/auth/allsearch", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchHistory(res.data.searches || []);
    } catch (err) {
      console.error("Error fetching search history", err);
    }
  };




  useEffect(() => {
    fetchSearchHistory();

  }, [searchHistory]);

  if (!user) return <p className="text-red-500">Please log in to search.</p>;

  return (
    <>
      <div className="flex flex-col md:flex-row p-6 bg-white shadow-lg rounded-lg space-y-6 md:space-y-0 md:space-x-6">

        {/* Left Side - Search Input & Response */}
        <div className="md:w-2/3 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Search with Gemini API</h2>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your search query..."
            className="w-full p-3 border rounded-lg mb-3"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {response && (
            <div className="mt-4 p-4 bg-white border rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Search Result</h3>
              <p className="text-gray-700">{response}</p>
            </div>
          )}
        </div>

        {/* Right Side - Search History */}
        <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg overflow-y-auto max-h-80">
          <h3 className="text-lg font-bold mb-3">Search History</h3>
          {searchHistory.length === 0 ? (
            <p className="text-gray-500">No previous searches found.</p>
          ) : (
            <ul className="space-y-3">
              {searchHistory.map((item, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow"   >
                  <strong className="text-blue-600">Query:</strong> {item.query} <br />
                  <strong className="text-green-600">Result:</strong> {item.result} <br />
                  <small className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={show ? "block" : "hidden"}>
          <h1>Hello</h1>
        </div>
      </div>


    </>
  );
};

export default SearchBar;
