import { NextResponse } from "next/server";
import pool from "../../utils/mysqlDb";
export async function POST(request) {
    const connection=await pool.getConnection()
  try {
    const sql = `SELECT * 
    FROM programList
    LEFT JOIN students
    ON programList.student = students.jamiaNo
    LEFT JOIN campus
    ON programList.campus = campus.jamiaNo `;
    const [awardedData, fields] = await connection.query(sql);

    const responseData = awardedData;
    return NextResponse.json({
      staus: "200",
      data: responseData,
      message: "Data fetched",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({
      staus: "500",
      message: error.message,
      success: false,
    });
  }finally{
    if(connection){
        connection.release()
    }
  }
}
