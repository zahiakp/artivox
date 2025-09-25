import pool from "../../../utils/mysqlDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { program, participants, campus, edit } = await request.json();

    let sql;
    if (edit) {
      sql = `UPDATE programList
      SET student = 
          CASE 
          ${participants
            .map((par, index) => `WHEN id=${edit[index]} THEN '${par}'`)
            .toString()
            .replaceAll(",", "\n")}
          END
      
      WHERE id IN (${edit.map((id) => id)})
      `;
    } else {
      sql = `INSERT INTO programList VALUES ${participants.map(
        (student) => `('','${program}','${student}','${campus}',null,0,'not reported',0)`
      )}`;
    }
    
    const [updateStatus, fields] = await pool.query(sql);

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
  }
}
