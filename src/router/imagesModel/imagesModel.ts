import * as fs from "fs";
import secret from "../../config";
import * as mysql from "mysql2";
import * as jwt from "jsonwebtoken";
import { createHash } from "crypto";
import Logger from "../../loaders/logger";
import { Message } from "../../utils/enums";
import getFormatDate from "../../utils/date";
import { connection as _connection } from "../../utils/mysql";
import { Request, Response } from "express";

const utils = require("@pureadmin/utils");

const connection = _connection('images').promise()

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
  let counter_sql = "select count(*) as total from image_list;"
  let sql: string = "select * from image_list limit " + pageSize + " offset " + pageSize * (pageIndex - 1);

  try {
    const [ total_res ] = await connection.query(counter_sql)
    const [ data ] = await connection.query(sql)
    await res.json({
      success: true,
      data: {
        result: data,
        total: total_res[0].total
      },
    });
  } catch(err) {
    Logger.error(err);
  } 
};

export {
  searchPage
}

