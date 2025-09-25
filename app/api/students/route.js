import { NextResponse } from "next/server";
import pool from "../../utils/mysqlDb";

export async function POST(request) {
  
  try {
    const { campusId } = await request.json();

    const sql = campusId
      ? `SELECT * FROM students WHERE campus='${campusId}'`
      : "SELECT * FROM students";
      const [students, fields] = await pool.query(sql);
    const responseData = students.sort((a, b) => a.jamiaNo.localeCompare(b.jamiaNo));
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
