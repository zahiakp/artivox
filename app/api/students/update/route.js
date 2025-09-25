import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const {name,category,campus,jamiaNo,edit} = await request.json();
    let sql;
    if(edit){
sql=`UPDATE students
SET jamiaNo = '${jamiaNo}', name = '${name}',campus='${campus}',category='${category}' WHERE jamiaNo='${edit}'`
    }else{
      sql=`INSERT INTO students VALUES ('${jamiaNo}','${name}','${category}','${campus}',0)`
    }
    const [updateStatus, fields] = await pool.query(sql);
    console.log(updateStatus);
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
  }
}
