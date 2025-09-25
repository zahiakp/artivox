import { NextResponse } from "next/server";
import pool from "../../utils/mysqlDb";

export async function POST(request) {
  try {
    const { collectionName, id } = await request.json();

    if (collectionName == "campus") {
      const accessSql = `DELETE FROM access WHERE campusId='${id}'`;
      const [deleteStatus, fields] = await pool.query(accessSql);
      if (!deleteStatus) {
        throw new Error("Access deleting failed.");
      }
    }

    const sql = `DELETE FROM ${collectionName} WHERE ${
      collectionName == "students" || collectionName == "campus"
        ? "jamiaNo"
        : "id"
    }='${id}'`;

    const [deleteStatus, fields] = await pool.query(sql);

    if (deleteStatus) {
      return NextResponse.json({
        staus: "200",
        message: `${collectionName} deleted succcessfully`,
        success: true,
      });
    } else {
      throw new Error("Something went wrong.");
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
