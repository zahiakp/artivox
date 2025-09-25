
import React, { useEffect, useRef, useState } from "react";
import { Spreadsheet, Worksheet } from "@jspreadsheet/react";
import { useCookies } from "react-cookie";

const license =
  "MDc3MjJmZWE3YWI3N2ZhOGQ1NzMyOWFlYzAxMGZiOTA2YWNiZjE2ODRmNjBhZjliNWI4NDJkZjliZmM0ZTVmMzExMDJlMGIyNjZiMmY4YTYzZTRlMTI4NWU0NGI0ZDZjYzhmNDljMTZmZDMzMzNjZThjNDZmNzFiMjM2NDQ0YmIsZXlKdVlXMWxJam9pU25Od2NtVmhaSE5vWldWMElpd2laR0YwWlNJNk1UY3dOREF5TVRjek1Td2laRzl0WVdsdUlqcGJJbXB6Y0hKbFlXUnphR1ZsZEM1amIyMGlMQ0pqYjJSbGMyRnVaR0p2ZUM1cGJ5SXNJbXB6YUdWc2JDNXVaWFFpTENKamMySXVZWEJ3SWl3aWQyVmlJaXdpYkc5allXeG9iM04wSWwwc0luQnNZVzRpT2lJek5DSXNJbk5qYjNCbElqcGJJblkzSWl3aWRqZ2lMQ0oyT1NJc0luWXhNQ0lzSW1Ob1lYSjBjeUlzSW1admNtMXpJaXdpWm05eWJYVnNZU0lzSW5CaGNuTmxjaUlzSW5KbGJtUmxjaUlzSW1OdmJXMWxiblJ6SWl3aWFXMXdiM0owWlhJaUxDSmlZWElpTENKMllXeHBaR0YwYVc5dWN5SXNJbk5sWVhKamFDSXNJbkJ5YVc1MElpd2ljMmhsWlhSeklsMHNJbVJsYlc4aU9uUnlkV1Y5";

export default function SpreadSheet({ data }:{data:any}) {
  const spreadsheet:any = useRef();
  const tableRef = useRef();
  const { students, programList, programs, campuses } = data;
  const [cookies] = useCookies(["access"]);
  const [campusName, setCampusName] = useState();
  useEffect(() => {
    setCampusName(cookies?.access?.name || null);
  }, []);
  

  return (
    <>
      <button
       onClick={() => {
    const table=spreadsheet.current[0]
    table.setMerge('A1',campusName ? 3 : 4)
    table.setHeight('1',10)
      }}
    
      >
        export
      </button>
      <Spreadsheet ref={spreadsheet} license={license}>
        <Worksheet />
      </Spreadsheet>
      
    </>
  );
}
