import app from "../../app"
import * as imagesModel from './imagesModel'

app.post("/images/query-page", (req, res) => {
  imagesModel.searchPage(req, res);
});
