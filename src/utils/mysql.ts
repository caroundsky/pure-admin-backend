import * as mysql from "mysql2";
import mysqlConfig from "../config";
import Logger from "../loaders/logger";

/** user数据库 */
export const connection = (key) => {
  return mysql.createConnection(
    Object.assign({ database: key }, mysqlConfig.mysql)
  );
}

export function queryTable(s: string): void {
  connection('user').query(s, (err) => {
    err ? Logger.error(err) : Logger.info(`${s}表创建成功`);
  });
}