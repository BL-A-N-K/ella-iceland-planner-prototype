/**
 * BOOTSTRAP layer — application initialization only.
 * Server setup and middleware registration.
 */

import express from "express";
import { routes } from "../routes";

export const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
