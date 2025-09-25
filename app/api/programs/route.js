import { NextResponse } from "next/server";
import pool from "../../utils/mysqlDb";

export async function POST(request) {
  try {
    const sql = "SELECT * FROM programs";
    const [programs, fields] = await pool.query(sql);
    const responseData = programs.map(program=>({...program,stage:!program.stage==0 ? true : false}));

    return NextResponse.json({
      status: "200",
      data: responseData.sort((a, b) => a.name.localeCompare(b.name)),
      message: "Data fetched",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({
      status: "500",
      message: error.message,
      success: false,
    });
  }
}
