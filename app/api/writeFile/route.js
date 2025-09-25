import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import executeQuery from '../../utils/mysqlDb'
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'src/app/utils', 'campus.json');

    const campusContent = await fs.readFile(
      filePath,
      "utf-8"
    );

    let campus = JSON.parse(campusContent);
   data.map(async (item)=>{
    const sql=`INSERT INTO students Values ('${item.jamiaNo}','${item.name}','${item.category}','${campus.find(cam=>cam.id==item.campus)?.jamiaNo||''}')`
    await executeQuery({query:sql}).then(res=>console.log(res))
   })
    return NextResponse.json({ message: 'done' });
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
