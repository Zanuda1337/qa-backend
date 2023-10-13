import "dotenv/config";import { sequelize } from "./db.js";import router from "./routes/index.js";import express from "express";import cors from "cors";import { errorHandler } from "./middleware/errorHandlingMiddleware.js";import fileUpload from "express-fileupload";import path from "path";import { fileURLToPath } from "url";const PORT = process.env.PORT || 5000;const app = express();app.use(cors());app.use(express.json());app.use(  express.static(    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "static")  ));app.use(fileUpload({}));app.use("/api", router);//последний middlewareapp.use(errorHandler);const start = async () => {  try {    await sequelize.authenticate();    await sequelize.sync();    app.listen(PORT, () =>      console.log(`Server started on port ${PORT}, http://localhost:${PORT}`)    );  } catch (e) {    console.error(e);  }};start();