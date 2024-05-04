import * as fs from "fs";
import secret from "../../config";
import * as mysql from "mysql2";
import * as jwt from "jsonwebtoken";
import { createHash } from "crypto";
import Logger from "../../loaders/logger";
import { Message } from "../../utils/enums";
import getFormatDate from "../../utils/date";
import { connection } from "../../utils/mysql";
import { Request, Response } from "express";

const utils = require("@pureadmin/utils");

const searchPage = async (req: Request, res: Response) => {
  const { pageIndex, pageSize } = req.body;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }
  let sql: string = "select * from image_list limit " + pageIndex + " offset " + pageSize * (pageIndex - 1);
  connection('images').query(sql, async function (err, data) {
    console.log(11, data)
    if (err) {
      Logger.error(err);
    } else {
      await res.json({
        success: true,
        data,
      });
    }
  });
};

export {
  searchPage
}

