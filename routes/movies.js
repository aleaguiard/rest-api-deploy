import { Router } from "express";
import { readJson } from "../utils.js";
const movies = readJson("./movies.json");

import { randomUUID } from "node:crypto";
import { validateMovie, validatePartialMovie } from "../schema/movies.js";

export const moviesRouter = Router();

// GET /movies
moviesRouter.get("/", (req, res) => {
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

// GET /movies/:id
moviesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ error: "Movie not found" });
});

// POST /movies
moviesRouter.post("/", (req, res) => {
  const result = validateMovie(req.body);
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: randomUUID(), // genera un UUID
    ...result.data,
  };

  movies.push(newMovie);
  return res.status(201).json(newMovie);
});

// PATCH /movies/:id
moviesRouter.patch("/:id", (req, res) => {
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

// DELETE /movies/:id
moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }
  movies.splice(movieIndex, 1);
  return res.status(204).json({ message: "Movie deleted" });
});
