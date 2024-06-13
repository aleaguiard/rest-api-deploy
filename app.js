import express, { json } from "express"; // require --> commonjs | import --> modules
import cors from "cors";
import { moviesRouter } from "./routes/movies.js";

// import usando 'with' aunque está en experimental stage 1
// https://nodejs.org/api/esm.html#esm_import_using_with_statement
// import movies from "./movies.json" with { type: "json" };

// otro modo de importar en ESModules
// import fs from "node:fs";
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf8"));

// RECOMENDADO -->
// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);
// const movies = require("./movies.json");

const app = express();
app.disable("x-powered-by"); // remove X-Powered-By header
app.use(json()); // parse JSON body
app.use(cors());
const PORT = process.env.PORT ?? 3000;

// método GET que devuelve un objeto JSON
app.get("/", (req, res) => {
  res.json({ message: "API deployed successfully" });
});

app.use("/movies", moviesRouter);

// ponemos el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
