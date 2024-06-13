import { Router } from "express";
import { validateMovie, validatePartialMovie } from "../schema/movies.js";
import { MovieModel } from "../models/movie.js";
import { readJson } from "../utils.js";

const movies = readJson("./movies.json");

export const moviesRouter = Router();

// GET /movies
moviesRouter.get("/", async (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	const { genre } = req.query;
	const movies = await MovieModel.getAll({ genre });
	res.json(movies);
});

// GET /movies/:id
moviesRouter.get("/:id", async (req, res) => {
	const { id } = req.params;
	const movie = await MovieModel.getById({ id });
	if (movie) return res.json(movie);
	res.status(404).json({ error: "Movie not found" });
});

// POST /movies
moviesRouter.post("/", async (req, res) => {
	const result = validateMovie(req.body);
	const newMovie = await MovieModel.create({ input: result.data });
	if (!result.success) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}

	movies.push(newMovie);
	return res.status(201).json(newMovie);
});

// PATCH /movies/:id
moviesRouter.patch("/:id", async (req, res) => {
	const result = validatePartialMovie(req.body);

	if (!result.success) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}

	const { id } = req.params;

	const updatedMovie = await MovieModel.updateById({ id, input: result.data });

	return res.json(updatedMovie);
});

// DELETE /movies/:id
moviesRouter.delete("/:id", async (req, res) => {
	const { id } = req.params;

	const result = await MovieModel.deleteById({ id });
	const movieIndex = movies.findIndex((movie) => movie.id === id);

	if (movieIndex === -1) {
		return res.status(404).json({ message: "Movie not found" });
	}
	movies.splice(movieIndex, 1);
	return res.status(204).json({ message: "Movie deleted" });
});
