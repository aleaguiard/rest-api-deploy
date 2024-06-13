import { MovieModel } from "../models/movie.js";

export class MovieController {
	static async getAll(req, res) {
		const { genre } = req.query;
		const movies = await MovieModel.getAll({ genre });
		res.json(movies);
	}

	static async getById(req, res) {
		const { id } = req.params;
		const movie = await MovieModel.getById({ id });
		if (movie) return res.json(movie);
		res.status(404).json({ error: "Movie not found" });
	}

	static async create(req, res) {
		const result = validateMovie(req.body);
		const newMovie = await MovieModel.create({ input: result.data });
		if (!result.success) {
			return res.status(400).json({ error: JSON.parse(result.error.message) });
		}

		movies.push(newMovie);
		return res.status(201).json(newMovie);
	}

	static async updateById(req, res) {
		const result = validatePartialMovie(req.body);
		if (!result.success) {
			return res.status(400).json({ error: JSON.parse(result.error.message) });
		}
		const { id } = req.params;
		const updatedMovie = await MovieModel.updateById({ id, input: result.data });
		return res.json(updatedMovie);
	}

	static async deleteById(req, res) {
		const { id } = req.params;
		const result = await MovieModel.deleteById({ id });
		const movieIndex = movies.findIndex((movie) => movie.id === id);
		if (movieIndex === -1) {
			return res.status(404).json({ message: "Movie not found" });
		}
		movies.splice(movieIndex, 1);
		return res.status(204).json({ message: "Movie deleted" });
	}
}
