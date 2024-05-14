import app from "../../app"
import * as pageModel from './pageModel'

app.get("/get-tag", (req, res) => {
  pageModel.getTag(req, res);
});

app.post("/get-images", (req, res) => {
  pageModel.getImages(req, res);
});
