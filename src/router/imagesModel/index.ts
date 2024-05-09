import app from "../../app"
import * as imagesModel from './imagesModel'

app.post("/images/query-page", (req, res) => {
  imagesModel.searchPage(req, res);
});

app.post("/images/modify-image", (req, res) => {
  imagesModel.modifyImage(req, res);
});

app.post("/images/add-image", (req, res) => {
  imagesModel.addImage(req, res);
});

app.post("/images/del-image", (req, res) => {
  imagesModel.delImage(req, res);
});

app.post("/images/query-tag", (req, res) => {
  imagesModel.searchTag(req, res);
});

app.get("/images/get-tag", (req, res) => {
  imagesModel.getTag(req, res);
});

app.post("/images/modify-tag", (req, res) => {
  imagesModel.modifyTag(req, res);
});

app.post("/images/add-tag", (req, res) => {
  imagesModel.addTag(req, res);
});

app.post("/images/del-tag", (req, res) => {
  imagesModel.delTag(req, res);
});