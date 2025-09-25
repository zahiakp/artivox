import { NextResponse } from "next/server";
import pool from "../../utils/mysqlDb";

export async function POST(request) {
  
  try {
    const sql = `SELECT * FROM Topics`;

    const [topics, fields] = await pool.query(sql);
    const responseData = topics.sort((a,b)=>a.id-b.id);
    return NextResponse.json({
      staus: "200",
      data: responseData,
      message: "Data fetched",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      staus: "500",
      message: error.message,
      success: false,
    });
  }
}
