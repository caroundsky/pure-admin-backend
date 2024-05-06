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