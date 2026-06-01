/**
 * BOOTSTRAP layer — application initialization only.
 * Server setup and middleware registration.
 */

import cors from "cors";
import express from "express";
import { routes } from "../routes";

export const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: [
      "https://preview--ellasicelandstudyplan.lovable.app",
      "https://ellasicelandstudyplan.lovable.app",
      process.env.FRONTEND_URL ?? "",
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
