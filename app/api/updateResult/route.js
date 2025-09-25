import pool from "../../utils/mysqlDb";
import { NextResponse } from "next/server";


export async function POST(request) {
  const connection=await pool.getConnection()
  try {
    const {program} = await request.json();
    const countsql=`SELECT MAX(count) AS count
    FROM programs
     `
     const [count, cields] = await connection.query(countsql);
    
const sql=`UPDATE programs
SET count = ${count[0].count+1} WHERE id=${program} `
    
    const [updateStatus, fields] = await connection.query(sql);
if(updateStatus){
  return NextResponse.json({
    staus: "200",
    message: "Students updated successfully",
    success: true,
  });
}else{
  throw new Error('Some thing went wrong')
}
    
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
