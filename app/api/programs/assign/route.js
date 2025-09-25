import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request) {
  try {
    const filePath = path.join(process.cwd(), "src/app/utils", "programs.json");
    const formData = await request.json();
    const programsContent = await fs.readFile(filePath, "utf-8");

    const programs = JSON.parse(programsContent);
    if (programs.length == 0) {
      throw new Error("data fetching failed");
    }
    const singleProgram = programs.find((item) => item.id === formData.id);
    if (singleProgram) {
      var editedPrograms = programs.map((item) => {
        if (item.id == formData.id) {
          return {...item,participants:{...item.participants,[formData.campus]:formData.participants}};
        }
        return item;
      });
    } else {
      throw new Error("Program not found");
    }

    const jsonString = JSON.stringify(editedPrograms, null, 2);
    fs.writeFile(filePath, jsonString, "utf-8");
    return NextResponse.json({
      status: "200",
      message: "Program updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({
      status: "500",
      message: error.message,
      success: false,
    });
  }
}
