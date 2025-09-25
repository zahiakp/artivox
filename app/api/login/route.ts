import { NextResponse } from "next/server";
import pool from "../../utils/mysqlDb";

export async function POST(request:any) {
  const connection = await pool.getConnection();
  try {
    const { username, password } = await request.json();
    const sql = `SELECT * FROM access WHERE username='${username}'`;
    const [access, fields]:any = await connection.query(sql);
    const user:any = access[0];
    let responseData = {};
    if (!user) {
      throw new Error("User not found");
    } else if (user.password !== password) {
      throw new Error("Wrong password.");
    } else if (user.role == "campus") {
      const campusSql = `SELECT * FROM campus WHERE jamiaNo='${user.campusId}'`;
      const [campusData, fields]:any = await pool.query(campusSql);
      const campus:any = campusData[0];
      if (!campus) {
        throw new Error("Something went wrong");
      }
      responseData = {
        ...user,
        ...campus
      };
    }else{
      responseData=user
    }

    
    console.log(responseData);
    return NextResponse.json({
      status: "200",
      data: responseData,
      message: "login success",
      success: true,
    });
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({
      status: "500",
      message: error.message,
      success: false,
    });
  }finally{
    if (connection) {
      connection.release();
    }
  }
}
