import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, categories, strength, jamiaNo, edit, password } =
      await request.json();
    async function accessUpdation(query) {
      const [updateStatus, fields] = await pool.query(query);
      if (!updateStatus) {
        throw new Error("Access adding failed.");
      }
      return
    }
    let sql;
    if (edit) {
      const accessSql = `UPDATE access
      SET username = '${jamiaNo}', role = 'campus',password='${password}',campusId='${jamiaNo}' WHERE username='${edit}'`;
      await accessUpdation(accessSql);

      sql = `UPDATE campus
SET jamiaNo = '${jamiaNo}', name = '${name}',password='${password}',categories='${categories}',strength='${strength}' WHERE jamiaNo='${edit}'`;
    } else {
      const accessSql = `INSERT INTO access
      VALUES ( '${jamiaNo}', 'campus','${password}','${jamiaNo}')`;
      await accessUpdation(accessSql);
      sql = `INSERT INTO campus VALUES ('${jamiaNo}','${name}','${password}','${strength}','${categories}',0)`;
    }

    const [updateStatus, fields] = await pool.query(sql);
    
    if (updateStatus) {
      return NextResponse.json({
        staus: "200",
        message: "Campus updated successfully",
        success: true,
      });
    } else {
      throw new Error("Some thing went wrong");
    }
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({
      staus: "500",
      message: error.message,
      success: false,
    });
  }
}
