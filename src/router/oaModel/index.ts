import app from "../../app"
import * as oaModel from './oaModel'

app.post("/login", (req, res) => {
  oaModel.login(req, res);
});

app.post("/register", (req, res) => {
  oaModel.register(req, res);
});

app.get("/captcha", (req, res) => {
  oaModel.captcha(req, res);
});

app.get("/get-async-routes", (req, res) => {
  oaModel.asyncRoutes(req, res);
});

app.post("/refresh-token", (req, res) => {
  oaModel.refreshToken(req, res);
});