import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const connection=await pool.getConnection()
  try {
    const { participants } = await request.json();

    
   
     const sql = `UPDATE programList
      SET code = 
          CASE 
          ${participants
            .map((par, index) => `WHEN id=${par.id} THEN '${par.code}'`)
            .toString()
            .replaceAll(",", "\n")}
          END
      
      WHERE id IN (${participants.map((par) => par.id)})
      `;
    
    
    const [updateStatus, fields] = await connection.query(sql);

    if (updateStatus) {
      return NextResponse.json({
        status: "200",
        message: "Program List updated successfully",
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
