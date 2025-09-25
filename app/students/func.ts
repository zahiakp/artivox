import { API_KEY, ROOT_URL } from "../data/func";
import axios from "axios";




  export async function addStudent(values: any) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("jamiaNo", values.jamiaNo);
    urlencoded.append("name", values.name);
    urlencoded.append("campus", values.campus);
    urlencoded.append("group", values.group?values.group:"");
    urlencoded.append("category", values.category);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${ROOT_URL}students/action.php?api=${API_KEY}&action=upload`, requestOptions);
        
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


export async function editStudent(id:any,values: any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("jamiaNo", values.jamiaNo);
    urlencoded.append("name", values.name);
    urlencoded.append("campus", values.campus);
    urlencoded.append("group", values.group?values.group:"");
    urlencoded.append("category", values.category);

  const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}students/action.php?api=${API_KEY}&action=update`, requestOptions);
      
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



export async function deleteStudent(id:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id); // Join categories into a comma-separated string

  const requestOptions: RequestInit = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}students/action.php?api=${API_KEY}`, requestOptions);
      
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



export async function getStudentsByTeamIdwithCategory(teamId:any,category:any) {
  const URL: string = `${ROOT_URL}students/action.php?api=${API_KEY}&campusId=${teamId}&category=${category}`;
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to get access:", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
export async function collectAllJamiaIds() {
  const URL: string = `${ROOT_URL}students/action.php?api=${API_KEY}&action=collectAllJamiaIds`;
  
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
      
    } else {
      console.error("Failed to get JamiaIds", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function CheckJamiaIds(teamId:any) {
  const URL: string = `${ROOT_URL}students/action.php?api=${API_KEY}&action=getJamiaNoCount&jamiaNo=${teamId}`;
  
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
      
    } else {
      console.error("Failed to get JamiaIds", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}


export async function getStudentsByteamId(campusId:any,quary:any) {
  const URL: string = `${ROOT_URL}students/action.php?campusId=${campusId}&action=pagination&${quary}`;
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to get access:", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}


export async function getStudentsByteamIdwithCat(campusId:any,quary:any,category:any) {
  const URL: string = `${ROOT_URL}students/action.php?campusId=${campusId}&action=pagination&category=${category}&${quary}`;
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to get access:", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}


export async function getAllStudentsByteamIdwithCat(teamId:any,category:any) {
  const URL: string = `${ROOT_URL}students/action.php?campusId=${teamId}&action=getAllStudents&category=${category}`;
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to get access:", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}