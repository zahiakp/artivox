import { NextResponse } from "next/server";
import pool from "../../utils/mysqlDb";
export async function POST(request) {
  const connection=await pool.getConnection()
  try {
    const { campusId,program } = await request.json();

    const sql = campusId
      ? `SELECT * FROM programList WHERE campus='${campusId}'`
      : program ? `SELECT * programList WHERE program='${program}'`: "SELECT * FROM programList";
    const [programList, fields] = await connection.query(sql);
    const responseData = programList;
    return NextResponse.json({
      status: "200",
      data: responseData,
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
  }finally{
    if(connection){
      connection.release()
    }
  }
}
