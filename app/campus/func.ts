import { API_KEY, ROOT_URL } from "../data/func";
import axios from "axios";

export async function getTeam(teamId:any) {
    try {
      const requestOptions: any = {
        method: "GET",
        redirect: "follow",
      };
  
      const response = await fetch(
        `${ROOT_URL}campuses/action.php?teamId=${teamId}`,
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

  export async function addTeam(values: any,categories:any) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("jamiaNo", values.jamiaNo);
    urlencoded.append("name", values.name);
    urlencoded.append("shortname", values.shortname);
    urlencoded.append("strength", values.strength.toString()); // Ensure strength is a string
    urlencoded.append("password", values.password);
    urlencoded.append("categories", categories);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${ROOT_URL}campuses/action.php?api=${API_KEY}&action=upload`, requestOptions);
        
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


export async function editTeam(id:any,values: any,categories:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("jamiaNo", values.jamiaNo);
  urlencoded.append("name", values.name);
  urlencoded.append("shortname", values.shortname);
  urlencoded.append("strength", values.strength.toString()); // Ensure strength is a string
  urlencoded.append("password", values.password);
  urlencoded.append("categories", categories);

  const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}campuses/action.php?api=${API_KEY}&action=update`, requestOptions);
      
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

 export async function getCampuseswithPagination(quary:any) {
    const URL: string = `${ROOT_URL}campuses/action.php?action=pagination&${quary}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get Invoices:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

export async function deleteTeam(id:any,root:any) {
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
      const response = await fetch(`${ROOT_URL}campuses/action.php?api=${API_KEY}`, requestOptions);
      
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



// -------------------------access-------------------------


export async function addAccess(values: any,role:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("campusId", values.jamiaNo);
  urlencoded.append("username", values.jamiaNo);
  urlencoded.append("role", role);
  urlencoded.append("password", values.password);

  const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}access/action.php?api=${API_KEY}&action=upload`, requestOptions);
      
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



export async function editAccess(id:any,values: any,role:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("campusId", values.jamiaNo);
  urlencoded.append("username", values.jamiaNo);
  urlencoded.append("role", role);
  urlencoded.append("password", values.password);

  const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}access/action.php?api=${API_KEY}&action=update`, requestOptions);
      
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



export async function getAccessbyId(id:any) {
  const URL: string = `${ROOT_URL}access/action.php?api=${API_KEY}&id=${id}`;
  
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

export async function getAccessbyJamiaNo(teamId:any) {
  const URL: string = `${ROOT_URL}access/action.php?api=${API_KEY}&campusId=${teamId}`;
  
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


export async function deleteAccess(id:any) {
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
      const response = await fetch(`${ROOT_URL}access/action.php?api=${API_KEY}`, requestOptions);
      
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




// ------------------------------students------------------------
export async function getStudentsByCampus(category:any) {
  const URL: string = `${ROOT_URL}students/action.php?action=getAllStudents&category=${category}`;
  
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

export async function getStudentsByteamId(teamId:any,quary:any) {
  const URL: string = `${ROOT_URL}students/action.php?campusId=${teamId}&action=pagination&${quary}`;
  
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
