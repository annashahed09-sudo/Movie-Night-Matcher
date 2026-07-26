const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWVjMjlmODZlYWUwNDQ1MjllY2Y2NzA5YzlhNjhhMCIsIm5iZiI6MTg1MDkwMTY5LjcxMSwic3ViIj6IjZhNjY1MDc5ZDg5NTNlODQ3YzNmODhlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l9UN7l5oXlUZ-WuT87nlBgSDyqp6Ok0OpstKak0303g";

export const fetchTrendingMovies = async (page = 1) => {
  const url = `https://themoviedb.org{page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWVjMjlmODZlYWUwNDQ1MjllY2Y2NzA5YzlhNjhhMCIsIm5iZiI6MTg1MDkwMTY5LjcxMSwic3ViIj6IjZhNjY1MDc5ZDg5NTNlODQ3YzNmODhlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l9UN7l5oXlUZ-WuT87nlBgSDyqp6Ok0OpstKak0303g";

export const fetchTrendingMovies = async (page = 1) => {
  const url = `https://themoviedb.org{page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${61ec29f86eae044529ecf6709c9a68a0 = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWVjMjlmODZlYWUwNDQ1MjllY2Y2NzA5YzlhNjhhMCIsIm5iZiI6MTg1MDkwMTY5LjcxMSwic3ViIj6IjZhNjY1MDc5ZDg5NTNlODQ3YzNmODhlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l9UN7l5oXlUZ-WuT87nlBgSDyqp6Ok0OpstKak0303g";

export const fetchTrendingMovies = async (page = 1) => {
  const url = `https://themoviedb.org{page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${61ec29f86eae044529ecf6709c9a68a0}`
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
      posterUrl: `https://tmdb.org{movie.poster_path}`,
      releaseDate: movie.release_date || "N/A",
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }));
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
};
}`
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
      posterUrl: `https://tmdb.org{movie.poster_path}`,
      releaseDate: movie.release_date || "N/A",
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }));
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
};
}`
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
      posterUrl: `https://tmdb.org{movie.poster_path}`,
      releaseDate: movie.release_date || "N/A",
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }));
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
};
