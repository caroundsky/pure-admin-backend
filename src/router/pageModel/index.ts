import app from "../../app"
import * as pageModel from './pageModel'

app.post("/get-tag", (req, res) => {
  pageModel.getTag(req, res);
});

app.post("/get-images", (req, res) => {
  pageModel.getImages(req, res);
});
