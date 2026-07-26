const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWVjMjlmODZlYWUwNDQ1MjllY2Y2NzA5YzlhNjhhMCIsIm5iZiI6MTg1MDkwMTY5LjcxMSwic3ViIjoiNmE2NjUwNzlkODk1M2U4NDdjM2Y4OGViIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.l9UN7l5oXlUZ-WuT87nlBgSDyqp6Ok0OpstKak0303g";

export const fetchTrendingMovies = async (page = 1) => {
  const url = `https://api.themoviedb.org/3/trending/movie/week?page=${page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed to fetch movies from TMDB");
    const data = await response.json();
    
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Poster+Found',
      releaseDate: movie.release_date || "N/A",
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }));
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
};
