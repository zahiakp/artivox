import { NextResponse } from "next/server";
import pool from "../../../../utils/mysqlDb";

export async function POST(request) {
  try {
    const { program } = await request.json();

    const checkResultSql = `SELECT * FROM programs WHERE id=${program} AND status='announced'`;
    const [programData, ProgramFields] = await pool.query(checkResultSql);

    if (programData.length == 0) {
      return NextResponse.json({
        staus: "200",
        message: "Result not published.",
        success: true,
      });
    }
    const programListSql = `SELECT * FROM programList WHERE program=${program} AND status='finished' OR status='awarded' ORDER BY mark DESC`;
    const [programListData, programListFields] = await pool.query(
      programListSql
    );
    if (programListData.length == 0) {
      throw new Error("Results not fetched");
    }

    const marks = [...new Set(programListData.map((item) => item.mark))];
    const first = programListData.filter((item) => item.mark == marks[0]);
    const second = programListData.filter((item) => item.mark == marks[1]);
    const third = programListData.filter((item) => item.mark == marks[2]);
    const grades = programListData.filter(
      (item) =>
        marks.filter((mark, index) => index > 4).includes(item.mark) &&
        item.mark >= 40
    );
    let result = {
      ...programData[0],
    };
    const studentsSql =
      result.isGroup == 0
        ? `SELECT * FROM students WHERE jamiaNo IN (${programListData.map(
            (item) => "'"+item.student+"'"
          )})`
        : `SELECT * FROM students WHERE jamiaNo IN (${programListData.map(
            (item) => "'"+item.student.split("&")[0]+"'"
          )})`;
    const campusSql = `SELECT * FROM campus WHERE jamiaNo IN (${[
      ...new Set(programListData.map((item) => item.campus)),
    ].map((item) => "'"+item+"'")})`;

    const [[studentsData, studentsFileds], [campusData, campusFields]] =
      await Promise.all([
        await pool.query(studentsSql),
        await pool.query(campusSql),
      ]);
    if (first.length != 0) {
      const FIRST = first.map((item) => {
        return {
          ...item,
          studentName: studentsData?.find(
            (student) => item.student == student.jamiaNo
          )?.name,
          campusName: campusData?.find(
            (campus) => item.campus == campus.jamiaNo
          )?.name,
          ...calculatePoints({
            group: result.isGroup == 0 ? false : true,
            rank: 1,
            mark: item.mark,
          }),
        };
      });
      result = { ...result, first:FIRST };
    }
    if (second.length != 0) {
      const SECOND = second.map((item) => {
        return {
          ...item,
          studentName: studentsData?.find(
            (student) => item.student == student.jamiaNo
          ).name,
          campusName: campusData?.find(
            (campus) => item.campus == campus.jamiaNo
          ).name,
          ...calculatePoints({
            group: result.isGroup == 0 ? false : true,
            rank: 2,
            mark: item.mark,
          }),
        };
      });
      result = { ...result, second:SECOND };
    } 
     if (third.length != 0) {
      const THIRD = third.map((item) => {
        return {
          ...item,
          studentName: studentsData?.find(
            (student) => item.student == student.jamiaNo
          ).name,
          campusName: campusData?.find(
            (campus) => item.campus == campus.jamiaNo
          ).name,
          ...calculatePoints({
            group: result.isGroup == 0 ? false : true,
            rank: 3,
            mark: item.mark,
          }),
        };
      });
      result = { ...result, third:THIRD };
    }
    if (grades.length != 0) {
      const GRADES = grades.map((item) => {
        return {
          ...item,
          studentName: studentsData?.find(
            (student) => item.student == student.jamiaNo
          ).name,
          campusName: campusData?.find(
            (campus) => item.campus == campus.jamiaNo
          ).name,
          ...calculatePoints({
            group: result.isGroup == 0 ? false : true,
            rank: 0,
            mark: item.mark,
          }),
        };
      });
      result = { ...result, grades:GRADES };
    }
    return NextResponse.json({
      status: "200",
      data: result,
      message: "Data fetched",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: "500",
      message: error.message,
      success: false,
    });
  }
}
