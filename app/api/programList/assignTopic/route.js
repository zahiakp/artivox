import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { program,student,topic } = await request.json();

    
   
     const sql = `UPDATE programList
      SET topic = ${topic} WHERE id=${student}  
      `;
    
    
    const [updateStatus, fields] = await pool.query(sql);

    if (updateStatus) {
      const dataSql=`SELECT * FROM programList WHERE program=${program}`
      const [data, fields] = await pool.query(dataSql);
     
      return NextResponse.json({
        staus: "200",
        data:data,
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
  }
}
