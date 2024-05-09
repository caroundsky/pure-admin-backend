import secret from "../../config";
import * as jwt from "jsonwebtoken";
import Logger from "../../loaders/logger";
import { Message } from "../../utils/enums";
import { connection as _connection } from "../../utils/mysql";
import { Request, Response } from "express";

const connection = _connection('images').promise()

const valid = (req, res) => {
  let payload
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }
  return payload
}

const searchPage = async (req: Request, res: Response) => {
  const { pageIndex, pageSize } = req.body;

  if (!valid(req, res)) return

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

const modifyImage = async (req: Request, res: Response) => {
  const { id, name, url, desc, tag, time_range } = req.body;
  const update_time = new Date()

  if (!valid(req, res)) return

  let sql: string = "UPDATE image_list SET `name` = ?, `url` = ?, `desc` = ?, `tag` = ?, `time_range` = ?, `update_time` = ? WHERE `id` = ?";
  let modifyParams: string[] = [name, url, desc, tag, time_range, update_time, id]
  try {
    await connection.query(sql, modifyParams)
    await res.json({
      success: true,
      data: { message: Message[7] },
    });
  } catch(err) {
    Logger.error(err);
  }
}

const addImage = async (req: Request, res: Response) => {
  const { name, url, desc, tag, time_range, update_time = new Date() } = req.body;

  if (!valid(req, res)) return

  let sql: string = "INSERT into image_list (`name`, `url`, `desc`, `tag`, `time_range`, `update_time`) VALUES (?,?,?,?,?,?)";
  let addParams: string[] = [name, url, desc, tag, time_range, update_time]
  try {
    await connection.query(sql, addParams)
    await res.json({
      success: true,
      data: { message: '添加成功' },
    });
  } catch(err) {
    Logger.error(err);
  }
}

const delImage = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!valid(req, res)) return

  let sql: string = "DELETE FROM image_list where id=" + "'" + id + "'";
  try {
    await connection.query(sql)
    await res.json({
      success: true,
      data: { message: '删除成功' },
    });
  } catch(err) {
    Logger.error(err);
  }
}

const searchTag = async (req: Request, res: Response) => {
  const { pageIndex, pageSize } = req.body;

  if (!valid(req, res)) return 

  let counter_sql = "select count(*) as total from tag_list;"
  let sql: string = "select * from tag_list limit " + pageSize + " offset " + pageSize * (pageIndex - 1);

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

const getTag = async (req: Request, res: Response) => {
  if (!valid(req, res)) return
  
  let sql: string = "select * from tag_list";

  try {
    const [ data ] = await connection.query(sql)
    await res.json({
      success: true,
      data,
    });
  } catch(err) {
    Logger.error(err);
  } 
}

const modifyTag = async (req: Request, res: Response) => {
  const { id, tag } = req.body;
  const update_time = new Date()

  if (!valid(req, res)) return

  let sql: string = "UPDATE tag_list SET `tag` = ?, `update_time` = ? WHERE `id` = ?";
  let modifyParams: string[] = [tag, update_time, id]
  try {
    await connection.query(sql, modifyParams)
    await res.json({
      success: true,
      data: { message: Message[7] },
    });
  } catch(err) {
    Logger.error(err);
  }
}

const addTag = async (req: Request, res: Response) => {
  const { tag, update_time = new Date() } = req.body;

  if (!valid(req, res)) return

  let sql: string = "INSERT into tag_list (`tag`,`update_time`) VALUES (?,?)";
  let addParams: string[] = [tag, update_time]
  try {
    await connection.query(sql, addParams)
    await res.json({
      success: true,
      data: { message: '添加成功' },
    });
  } catch(err) {
    Logger.error(err);
  }
}

const delTag = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!valid(req, res)) return

  let sql: string = "DELETE FROM tag_list where id=" + "'" + id + "'";
  try {
    await connection.query(sql)
    await res.json({
      success: true,
      data: { message: '删除成功' },
    });
  } catch(err) {
    Logger.error(err);
  }
}

export {
  searchPage,
  modifyImage,
  addImage,
  delImage,

  searchTag,
  getTag,
  modifyTag,
  addTag,
  delTag
}

