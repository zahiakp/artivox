import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const connection=await pool.getConnection()
  try {
    const { type,program } = await request.json();

    
    
     const sql = `UPDATE programs
SET status = '${type}' WHERE id='${program}'`;
    
    const [updateStatus, fields] = await connection.query(sql);
    
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
  }finally{
    if(connection){
      connection.release()
    }
  }
}
