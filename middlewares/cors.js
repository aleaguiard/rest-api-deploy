// app.options("/movies/:id", (req, res) => {
//   const origin = req.header("origin");
//   res.header("Access-Control-Allow-Origin", origin);
//   res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   res.send(200);
// });

// se usa para permitir que el cliente acceda a la API desde cualquier origen
// se podria crear una regla para cada origen que queremos permitir

// app.use(cors({
//   origin: (origin, callback) => {
// const ACCEPTED_ORIGINS = ["http://localhost:3000", "http://localhost:8080"];
// if (ACCEPTED_ORIGINS.includes(origin)) {
//   return callback(null, true);
// }
// if (!origin) {
// return callback(null, false);
// }
// callback(new Error("Not allowed by CORS"));
//}
// }));
