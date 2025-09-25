import pool from "../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const connection=await pool.getConnection()
  try {
    // const sql = "SELECT * FROM programs";
    // const [programs, fields] = await pool.query(sql);

    const sql = `UPDATE programs
    SET isGroup = 
        CASE 
            WHEN (stage=0 AND category='minor') OR (stage=0 AND category='junior') THEN 3
            WHEN (stage=1 AND category='minor') OR (stage=1 AND category='junior') THEN 2
            WHEN (stage=0 AND category='premier') OR (stage=0 AND category='subjunior') THEN 2
            WHEN (stage=1 AND category='premier') OR (stage=1 AND category='subjunior') THEN 1
            WHEN category='senior' THEN 3
        END
    WHERE category IN ('senior', 'junior', 'subjunior', 'premier', 'minor')
      AND stage IN (0, 1)
      `;

    const [updateStatus, fields2] = await connection.query(sql);

    if (updateStatus) {
      return NextResponse.json({
        staus: "200",
        message: "Program List updated successfully",
        success: true,
      });
    } else {
      throw new Error("Some thing went wrong");
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
