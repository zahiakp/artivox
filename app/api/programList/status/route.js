import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const connection=await pool.getConnection()
  try {
    const { type,participant,program } = await request.json();

   
    
     const sql = `UPDATE programList
SET status = '${type}' WHERE id='${participant.id}'`;
    
    const [updateStatus, fields] = await connection.query(sql);
    
    if (updateStatus) {
      if(program){
        const dataSql=`SELECT * FROM programList WHERE program=${program}`
        const [data, fields] = await connection.query(dataSql);
        return NextResponse.json({
          status: "200",
          data:data,
          message: "Participant updated successfully",
          success: true,
        });
      }
      
     
      return NextResponse.json({
        status: "200",
        message: "Participant updated successfully",
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
