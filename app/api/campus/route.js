import { NextResponse } from "next/server";
import pool from '../../utils/mysqlDb'
export async function POST(request) {
  try {
    
    const sql = "SELECT * FROM campus";
    const [campusData, fields] = await pool.query(sql);
  const responseData=campusData.map(item=>({...item,categories:item.categories.split(',')}))
    return NextResponse.json({
      staus: "200",
      data: responseData.sort((a, b) => a.jamiaNo.localeCompare(b.jamiaNo)),
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
  }
}
