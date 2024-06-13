import { Router } from "express";
import { MovieController } from "../controllers/movie.js";

export const moviesRouter = Router();

// GET ALL /movies
moviesRouter.get("/", MovieController.getAll);

// GET /movies/:id
moviesRouter.get("/:id", MovieController.getById);

// POST /movies
moviesRouter.post("/", MovieController.create);

// PATCH /movies/:id
moviesRouter.patch("/:id", MovieController.updateById);

// DELETE /movies/:id
moviesRouter.delete("/:id", MovieController.deleteById);
