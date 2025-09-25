import { NextResponse } from "next/server";
import pool from "../../../utils/mysqlDb";

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const programSql = `SELECT * FROM programs WHERE status='announced'`;
    const studentsSql = "SELECT * FROM students";

    const campusSql = "SELECT * FROM campus";
    const [
      [programData, programFields],
      [studentsData, studentFields],
      [campusData, campusFields],
    ] = await Promise.all([
      pool.query(programSql),
      pool.query(studentsSql),
      pool.query(campusSql),
    ]);
    if (programData.length == 0) {
      return NextResponse.json({
        staus: "200",
        message: "Result not published.",
        success: true,
      });
    }
    const responseData = await Promise.all(
      await programData.map(async (program) => {
        const programListSql = `SELECT * FROM programList WHERE program=${program.id} AND status='finished' OR program=${program.id} AND status='awarded' ORDER BY mark DESC`;
        const [programListData, programListFields] = await pool.query(
          programListSql
        );

        if (programListData.length == 0) {
          throw new Error("Results not fetched");
        }
        const marks = [...new Set(programListData.map((item) => item.mark).filter(item=>item!=0))];
        const first = programListData.filter((item) => item.mark == marks[0]);
        const second = programListData.filter((item) => item.mark == marks[1]);
        const third = programListData.filter((item) => item.mark == marks[2]);
        const grades = programListData.filter(
          (item) =>
            marks.filter((mark, index) => index > 4).includes(item.mark) &&
            item.mark >= 40
        );
        let result = {
          ...program,
        };

        if (first.length != 0) {
          const FIRST = first.map((item) => {
            return {
              ...item,
              studentName:
                program.isGroup == 0
                  ? studentsData?.find(
                      (student) => item.student.includes(student.jamiaNo) ||student.jamiaNo.includes(item.student)
                    )?.name
                  : studentsData?.find(
                      (student) => item.student.split("&")[0] == student.jamiaNo
                    )?.name + " & Party",
              campusName: campusData?.find(
                (campus) => item.campus == campus.jamiaNo
              )?.name,
              short: campusData?.find((campus) => item.campus == campus.jamiaNo)
                ?.shortName,
              ...calculatePoints({
                group: result.isGroup == 0 ? false : true,
                rank: 1,
                mark: item.mark,
              }),
            };
          });
          result = { ...result, first: FIRST };
        }
        if (second.length != 0) {
          const SECOND = second.map((item) => {
            return {
              ...item,
              studentName:
                program.isGroup == 0
                  ? studentsData?.find(
                      (student) => item.student.includes(student.jamiaNo) ||student.jamiaNo.includes(item.student)
                    )?.name
                  : studentsData?.find(
                      (student) => item.student.split("&")[0] == student.jamiaNo
                    )?.name + " & Party",
              campusName: campusData?.find(
                (campus) => item.campus == campus.jamiaNo
              )?.name,
              short: campusData?.find((campus) => item.campus == campus.jamiaNo)
                ?.shortName,
              ...calculatePoints({
                group: result.isGroup == 0 ? false : true,
                rank: 2,
                mark: item.mark,
              }),
            };
          });
          result = { ...result, second: SECOND };
        }
        if (third.length != 0) {
          const THIRD = third.map((item) => {
            return {
              ...item,
              studentName:
                program.isGroup == 0
                  ? studentsData?.find(
                      (student) => item.student.includes(student.jamiaNo) ||student.jamiaNo.includes(item.student)
                    )?.name
                  : studentsData?.find(
                      (student) => item.student.split("&")[0] == student.jamiaNo
                    )?.name + " & Party",
              campusName: campusData?.find(
                (campus) => item.campus == campus.jamiaNo
              )?.name,
              short: campusData?.find((campus) => item.campus == campus.jamiaNo)
                ?.shortName,
              ...calculatePoints({
                group: result.isGroup == 0 ? false : true,
                rank: 3,
                mark: item.mark,
              }),
            };
          });
          result = { ...result, third: THIRD };
        }
        if (grades.length != 0) {
          const GRADES = grades.map((item) => {
            return {
              ...item,
              studentName:
                program.isGroup == 0
                  ? studentsData?.find(
                      (student) => item.student.includes(student.jamiaNo)
                    )?.name
                  : studentsData?.find(
                      (student) => item.student.split("&")[0] == student.jamiaNo
                    )?.name + " & Party",
              campusName: campusData?.find(
                (campus) => item.campus == campus.jamiaNo
              )?.name,
              short: campusData?.find((campus) => item.campus == campus.jamiaNo)
                ?.shortName,
              ...calculatePoints({
                group: result.isGroup == 0 ? false : true,
                rank: 0,
                mark: item.mark,
              }),
            };
          });
          result = { ...result, grades: GRADES };
        }
        return result;
      })
    );

    return NextResponse.json({
      status: "200",
      data: responseData,
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
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();

      
    }
  }
}
