const express = require("express"); // require --> commonjs
const movies = require("./movies.json");
const crypto = require("node:crypto");
const z = require("zod");
const cors = require("cors");
const { validateMovie, validatePartialMovie } = require("./schema/movies");

const app = express();
app.disable("x-powered-by"); // remove X-Powered-By header
app.use(express.json()); // parse JSON body
app.use(cors());
const PORT = process.env.PORT ?? 3000;

// método GET que devuelve un objeto JSON
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// método GET que devuelve una lista de películas o por género si recibe el param
app.get("/movies", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { genre } = req.query;
  if (genre) {
    const moviesByGenre = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(moviesByGenre);
  }
  res.json(movies);
});

// método GET que devuelve una película por ID
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ error: "Movie not found" });
});

// método POST que crea una película
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(), // genera un UUID
    ...result.data,
  };

  movies.push(newMovie);
  return res.status(201).json(newMovie);
});

// método PATCH que actualiza una película
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

// método DELETE que elimina una película
app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }
  movies.splice(movieIndex, 1);
  return res.status(204).json({ message: "Movie deleted" });
});

// app.options("/movies/:id", (req, res) => {
//   const origin = req.header("origin");
//   res.header("Access-Control-Allow-Origin", origin);
//   res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   res.send(200);
// });

// ponemos el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
