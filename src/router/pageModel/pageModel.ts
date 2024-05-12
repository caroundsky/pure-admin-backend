import Logger from "../../loaders/logger";
import { connection as _connection } from "../../utils/mysql";
import { Request, Response } from "express";

const connection = _connection('images').promise()
const TIMEOUT = 5 * 1000;

const ipMap: {
  [key: string]: {
    time: number,
    number: number,
    isFlash: boolean
  }
} = {}

const vilidFlash = async (req, res) => {
  let valid = true

  const ip = req.ip
  const target = ipMap[ip]
  if (target) {
    const now = new Date().getTime()
    target.number++
    // 5S内调用次数大于20次
    if (now - target.time <= TIMEOUT && target.number > 20) {
      // 证明是刷接口，强行退出服务
      target.time = now
      target.isFlash = true
      valid = false
      await res.status(500).end()
    } else if (now - target.time > TIMEOUT){
      // 重置数据
      delete ipMap[ip]
    }
  } else {
    ipMap[ip] = {
      number: 0,
      time: new Date().getTime(),
      isFlash: false
    }
    ifDel(ip)
  }
  return valid
}

const ifDel = (ip) => {
  setTimeout(() => {
    if (ipMap[ip] && ipMap[ip].isFlash) {
      ifDel(ip)
    } else {
      delete ipMap[ip]
    }
  }, 10000)
}

const getImages = async (req: Request, res: Response) => {
  if (!await vilidFlash(req, res)) return
  
  const { pageIndex, pageSize } = req.body;
  
  let sql: string = "select * from image_list limit " + pageSize + " offset " + pageSize * (pageIndex - 1);

  try {
    const [ data ] = await connection.query(sql)
    await res.json({
      success: true,
      data,
    });
  } catch(err) {
    Logger.error(err);
  } 
};

const getTag = async (req: Request, res: Response) => {
  if (!await vilidFlash(req, res)) return

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

export {
  getTag,
  getImages,
}

