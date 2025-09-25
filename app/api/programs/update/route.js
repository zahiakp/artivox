import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, stage, groupItem, edit, limit,category } = await request.json();

    let sql;
    if (edit) {
      sql = `UPDATE programs
SET name = '${name}',category='${category}',limitCount='${limit}',isGroup='${groupItem}',stage='${stage}' WHERE id='${edit}'`;
    } else {
      sql = `INSERT INTO programs VALUES ('','${name}','${category}',${stage},${groupItem},${limit}),'pending'`;
    }
    const [updateStatus, fields] = await pool.query(sql);
    
    if (updateStatus) {
      return NextResponse.json({
        status: "200",
        message: "Program updated successfully",
        success: true,
      });
    } else {
      throw new Error("Some thing went wrong");
    }
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({
      status: "500",
      message: error.message,
      success: false,
    });
  }
}
