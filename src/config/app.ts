import express from "express";
import cors from "cors";
import http from "http";
import { PORT } from "./env.var";
import routes from "../routes/index.route";
import { bodyDecipher } from "../middlewares/req-res-encoder";
import { tokenVerification } from "../middlewares/authenticate";

export default ({ app }: { app: express.Application }) => {
  app.use(express.json());
  app.use(cors({
    origin: '*',
  }))
  app.use(express.static('public'));
  app.use('/images', express.static('images'));
  app.use("/api", [bodyDecipher, tokenVerification], routes());

  startServer(app);
};

const startServer = (app: express.Application) => {
  let port = PORT.toString();
  app.set("port", port);
  console.log("NODE_ENV", process.env.NODE_ENV)
  let server = http.createServer(app);
  server.listen(port);

  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe  ${addr}` : `port-${port}`;
  console.log(`🛡️   Server listening on ${bind} 🛡️ `);
};

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
