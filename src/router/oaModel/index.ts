import app from "../../app"
import * as oaModel from './oaModel'
import { getSts } from './cos/sts'

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

app.post("/sts", (req, res) => {
  getSts().then(async (data) => {
    await res.json({
      success: true,
      data,
    });
  }).catch(async err => {
    await res.json({
      success: false,
      data: err,
    });
  })
});