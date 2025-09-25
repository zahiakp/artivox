import { API_KEY, ROOT_URL } from "../data/func";

export async function AssignResult(code:any,student: any,program:any,rank:any,grade:any,point:any) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
    const urlencoded = new URLSearchParams();
    urlencoded.append("code", code);
    urlencoded.append("student", student);
    urlencoded.append("program", program);
    urlencoded.append("rank", rank);
    urlencoded.append("grade", grade);
    urlencoded.append("point", point);
  
    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };
  
    try {
        const response = await fetch(`${ROOT_URL}results/action.php?action=resultUpload`, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.text();
      console.log(result); 
      return { success: true}
    } catch (error: any) {
        console.error("Error:", error.message);
        return { success: false, message: error.message }; // Return error message
    }
  }




  export async function MarkAwarded(id:any,status:any) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
    const urlencoded = new URLSearchParams();
    urlencoded.append("id", id);
    urlencoded.append("status", status);
    const requestOptions: RequestInit = {
        method: "PUT",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };
  
    try {
        const response = await fetch(`${ROOT_URL}results/action.php?action=markAwarded`, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.text();
      console.log(result); 
      return { success: true}
    } catch (error: any) {
        console.error("Error:", error.message);
        return { success: false, message: error.message }; // Return error message
    }
  }




  export async function ProResult(program:any,root:any) {
    try {
      const requestOptions: any = {
        method: "GET",
        redirect: "follow",
      };
      
      const response = await fetch(
        `${ROOT_URL}results/action.php?program=${program}&action=proResult`,
        requestOptions
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }