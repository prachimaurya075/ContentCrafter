import React, { useEffect, useState } from "react";
import api from "../services/api";

const GenreDropdown = ({ selectedGenre, setSelectedGenre }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await api.get("/content/genres");
        console.log("Fetched Genres: ", res.data);
        setGenres(res.data.data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenres();
  }, []);

  return (
    <>
      <label className="block mb-2 text-sm text-gray-300">Select Genre</label>
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="w-full p-3 mb-5 rounded-lg bg-gray-800 text-white border border-gray-600 
        transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-blue-400"
      >
        <option value="">-- Choose Genre --</option>
        {genres.map((genre) => (
          <option key={genre._id} value={genre._id}>
            {genre.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default GenreDropdown;
