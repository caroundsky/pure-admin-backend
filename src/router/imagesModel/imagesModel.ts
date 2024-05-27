import secret from "../../config";
import * as jwt from "jsonwebtoken";
import Logger from "../../loaders/logger";
import { Message } from "../../utils/enums";
import { connection as _connection } from "../../utils/mysql";
import { Request, Response } from "express";

import tinify from "tinify"
tinify.key = process.env.TinyKey

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
  const { pageIndex, pageSize, tag } = req.body;

  if (!valid(req, res)) return

  let condition = ''
  if (![undefined, ''].includes(tag)) {
    condition = "where `tag` = ?"
  }

  let counter_sql = "select count(*) as total from image_list " + condition
  let sql: string = "select * from image_list " + condition + " order by update_time desc limit " + pageSize + " offset " + pageSize * (pageIndex - 1);

  let modifyParams: string[] = [tag]
  try {
    const [ total_res ] = await connection.query(counter_sql, modifyParams)
    const [ data ] = await connection.query(sql, modifyParams)
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
  const { id, name, url, desc, tag, time_range, width, height, key } = req.body;
  const update_time = new Date()

  if (!valid(req, res)) return

  let sql: string = "UPDATE image_list SET `name` = ?, `url` = ?, `desc` = ?, `tag` = ?, `time_range` = ?, `width` = ?, `height` = ?, `update_time` = ?, `key` = ? WHERE `id` = ?";
  let modifyParams: string[] = [name, url, desc, tag, time_range, width, height, update_time, key, id]
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
  const { name, url, desc, tag, time_range, update_time = new Date(), width, height, key } = req.body;

  if (!valid(req, res)) return

  let sql: string = "INSERT into image_list (`name`, `url`, `desc`, `tag`, `time_range`, `update_time`, `width`, `height`, `key`) VALUES (?,?,?,?,?,?,?,?,?)";
  let addParams: string[] = [name, url, desc, tag, time_range, update_time, width, height, key]
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
  const { pageIndex, pageSize, sort } = req.body;

  if (!valid(req, res)) return 

  const order = ' order by sort asc'

  let counter_sql = "select count(*) as total from tag_list" + order
  let sql: string = "select * from tag_list" + order + " limit " + pageSize + " offset " + pageSize * (pageIndex - 1);

  let modifyParams: string[] = [order]
  try {
    const [ total_res ] = await connection.query(counter_sql, modifyParams)
    const [ data ] = await connection.query(sql, modifyParams)
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
  
  let sql: string = "select * from tag_list order by sort asc";

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
  const { id, tag, sort } = req.body;
  const update_time = new Date()

  if (!valid(req, res)) return

  let sql: string = "UPDATE tag_list SET `tag` = ?, `update_time` = ? , `sort` = ? WHERE `id` = ?";
  let modifyParams: string[] = [tag, update_time, sort, id]
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
  const { tag, sort, update_time = new Date() } = req.body;

  if (!valid(req, res)) return

  let sql: string = "INSERT into tag_list (`tag`, `sort` ,`update_time`) VALUES (?,?,?)";
  let addParams: string[] = [tag, sort, update_time]
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

function zip(fileData) {
  return new Promise((resolve, reject) => {
    tinify.fromBuffer(fileData.buffer).toBuffer(function(err, resultData) {
      if (err) reject(err)
      else resolve(resultData)
    })
  })
}

const tingImages = async (req, res) => {
  const contentType = req.file.mimetype
  try {
    const zipFileData = await zip(req.file).catch(async err => {
      return res.json({
        success: false,
        data: err ,
      })
    })
    res.setHeader('Content-Type', contentType)
    res.setHeader('Compression-Count', tinify.compressionCount)

    return res.send(zipFileData);
  } catch(e) {
    return res.send(500);
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
  delTag,

  tingImages
}

