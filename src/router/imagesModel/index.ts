import app from "../../app"
import * as imagesModel from './imagesModel'

app.post("/images/search-page", (req, res) => {
  imagesModel.searchPage(req, res);
});
