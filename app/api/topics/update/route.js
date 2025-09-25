import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const {programId,topics,lang,edit} = await request.json();
  
    let sql;
    if(edit){
        if(edit.length!==topics.length){
const insertSql=`INSERT INTO Topics VALUES ${topics.filter((item,index)=>index > edit.length).map((item,index)=>`('','${programId}','${lang}','${item}')`)}`
const [updateStatus, fields] = await pool.query(insertSql);
        }
sql=`UPDATE Topics
SET Topic = 
    CASE 
    ${topics.filter((item,index)=>index < edit.length)
      .map((topic, i) => `WHEN id=${edit[i]} THEN '${topic}'`)
      .toString()
      .replaceAll(",", "\n")}
    END,
    lang='${lang}'

WHERE id IN (${edit.map((id) => id)})
`
    }else{
      sql=`INSERT INTO Topics VALUES ${topics.map((item,index)=>`('','${programId}','${lang}','${item}')`)}`
    }
    
    const [updateStatus, fields] = await pool.query(sql);
    
if(updateStatus){
  return NextResponse.json({
    staus: "200",
    message: "Topics updated successfully",
    success: true,
  });
}else{
  throw new Error('Topics updating failed.')
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
