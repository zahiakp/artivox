import { API_KEY, ROOT_URL } from "../data/func";
import axios from "axios";

export async function getProgram(id:any) {
    try {
      const requestOptions: any = {
        method: "GET",
        redirect: "follow",
      };
  
      const response = await fetch(
        `${ROOT_URL}programs/action.php?id=${id}`,
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


  export async function getPrograms(root:any) {
    const URL = `${ROOT_URL}${root}/action.php?api=${API_KEY}`;
    
    try {
        const response = await axios.get(URL);

        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Failed to get programs:", response.statusText);
            return null; 
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}



export async function getProgramswithPagination(quary:any) {
  const URL = `${ROOT_URL}/programs/action.php?action=pagination&${quary}`;
  
  try {
      const response = await axios.get(URL);

      if (response.status === 200) {
          return response.data;
      } else {
          console.error("Failed to get programs:", response.statusText);
          return null; 
      }
  } catch (error) {
      console.error("Error:", error);
      return null;
  }
}


  export async function getProgramsbyCategory(categories:any) {
    const URL: string = `${ROOT_URL}programs/action.php?api=${API_KEY}&categories=${categories}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  export async function getProgramsbyStatus(status:any) {
    const URL: string = `${ROOT_URL}zoneprograms/action.php?status=${status}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  export async function getProgramsbyStatusandPagination(status:any,quary:any,root:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?status=${status}&action=pagination&${quary}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  export async function getProgramsforJudgment(status:any,quary:any,root:any,isStage:number) {
    const URL: string = `${ROOT_URL}${root}/action.php?status=${status}&action=pagination&isStage=${isStage}&${quary}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }


  export async function getAwardDetails(quary:any) {
    const URL: string = `${ROOT_URL}programs/action.php?action=getAwardDetails&${quary}&status=announced`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }


  export async function getJudgedPros(query:any,status:any) {
    const URL: string = `${ROOT_URL}programs/action.php?action=pagination&status=${status}&${query}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }













  export async function getProgramsbyTeamIdandStatuswithPagination(team:any,status:any,quary:any,root:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?status=${status}&teamId=${team}&action=pagination&${quary}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  export async function getProgramsbyStatuswithCategoryBased(status:any) {
    const URL: string = `${ROOT_URL}programs/action.php?api=${API_KEY}&status=${status}&action=categorybased`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  export async function getProgramsbyCategorywithTeamId(categories:any,teamId:any,quary:any,root:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=pagination&category=${categories}&campusId=${teamId}&${quary}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }


  export async function getProgramsByTeamId(teamId:any,quary:any,root:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=pagination&teamId=${teamId}&${quary}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  export async function getProgramsOrder() {
    const URL: string = `${ROOT_URL}programs/action.php?action=orderCheck`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  export async function getProgramsOrderTeamBased(team:any,root:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=orderCheck&teamId=${team}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  
  export async function getIndivitualPoints(root:any,isStage?:any) {
    console.log('isStage',isStage);
    
    const URL: string = `${ROOT_URL}${root}/action.php?action=getStudentPoints${isStage ? `&isStage=${isStage}` : ''}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  export async function getIndivitualPointsCatBased(root:any,cat:any,isStage?:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=getStudentPoints&category=${cat}${isStage ? `&isStage=${isStage}` : ''}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }




  export async function getIndivitualPoint(root:any,cat:any,quary:any,stage:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=getStudentPoints&category=${cat}&stage=${stage}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }


  export async function getTeamIndivitualPoint(root:any,cat:any,team:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=getStudentPoints&category=${cat}&team=${team}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }


  export async function getTeamPoint(root:any,after:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=getCampusPointStatus&after=${after}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  export async function getTeamPointCatBased(root:any,cat:any,after:any) {
    const URL: string = `${ROOT_URL}${root}/action.php?action=getCampusPointStatus&category=${cat}&after=${after}`;
    
    try {
      const response = await axios.get(URL);
  
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to get programs:", response.statusText);
        return null; 
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }


  export async function addProgram(values: any,root:any) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", values.name);
    urlencoded.append("stage", values.stage ? "1" : "0");
    urlencoded.append("group", values.group? "1" : "0");
    urlencoded.append("limit", values.limit);
    urlencoded.append("members", values.members);
    urlencoded.append("category", values.category);
    urlencoded.append("campus", values.campus);
    
    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${ROOT_URL}${root}/action.php?api=${API_KEY}&action=upload`, requestOptions);
        
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
export async function ImportProgram(cat: any,campus:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("campus", campus);
  urlencoded.append("category", cat);
  
  const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}campusprograms/action.php?api=${API_KEY}&action=importprograms`, requestOptions);
      
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

export async function editProgram(id:any,values: any,root:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("name", values.name);
  urlencoded.append("stage", values.stage ? "1" : "0");
    urlencoded.append("group", values.group? "1" : "0");
  urlencoded.append("limit", values.limit);
  urlencoded.append("members", values.members);
  urlencoded.append("category", values.category);
  urlencoded.append("campus", values.campus);

  const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}${root}/action.php?api=${API_KEY}&action=update`, requestOptions);
      
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


export async function AssignBulkOrder(array: any, root: any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "bulk": true,
    "updates": array
  });

  const requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${ROOT_URL}${root}/action.php?action=assignOrder`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    console.log(result);
    return { success: true };
  } catch (error: any) {
    console.error("Error:", error.message);
    return { success: false, message: error.message }; // Return error message
  }
}


export async function AssignOrder(id:any,order: any,root:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("order", order);

  const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}${root}/action.php?action=assignOrder`, requestOptions);
      
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



export async function UpdateProgramStatus(id:any,status: any,root:any) {
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
      const response = await fetch(`${ROOT_URL}${root}/action.php?api=${API_KEY}&action=changestatus`, requestOptions);
      
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

export async function deleteProgram(id:any,root:any) {
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
      const response = await fetch(`${ROOT_URL}${root}/action.php?api=${API_KEY}`, requestOptions);
      
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



// -----------------------participants----------------------------------------



export async function addParticipant(values: any,par:any,root:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("student", par);
  urlencoded.append("campus", values.campus);
  urlencoded.append("group", values.group);
  urlencoded.append("program", values.program);

  const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}${root}/action.php?api=${API_KEY}&action=upload`, requestOptions);
      
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


export async function editParticipant(id:any,values: any,par:any,root:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("student", par);
  urlencoded.append("campus", values.campus);
  urlencoded.append("group", values.group);
  urlencoded.append("program", values.program);

  const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}${root}/action.php?api=${API_KEY}&action=update`, requestOptions);
      
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

export async function ChangeParticipantStatus(id:any,status:any,root:any) {
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
      const response = await fetch(`${ROOT_URL}${root}/action.php?action=statusChange`, requestOptions);
      
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

export async function getParticipantsbyProgram(program:any) {
  const URL: string = `${ROOT_URL}participants/action.php?api=${API_KEY}&program=${program}`;
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to get programs:", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getParticipantsbyProgramwithTeamId(program:any,teamId:any,root:any) {
  const URL: string = `${ROOT_URL}${root}/action.php?api=${API_KEY}&program=${program}&campusId=${teamId}`;
  
  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to get programs:", response.statusText);
      return null; 
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}


export async function deleteParticipant(id:any,root:any) {
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
      const response = await fetch(`${ROOT_URL}${root}/action.php?api=${API_KEY}`, requestOptions);
      
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



export async function AssignCode(id:any,code:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("code", code);

  const requestOptions: RequestInit = {
      method:"POST",
      headers:myHeaders,
      body: urlencoded,
      redirect: "follow"
  };
 console.log("id",id);
 console.log("code",code);
 
  try {
      const response = await fetch(`${ROOT_URL}participants/action.php?action=assignCode`, requestOptions);
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



export async function UpdateMark(id:any,mark:any,mark2:any,mark3:any,root:any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);
  urlencoded.append("mark", mark);
  urlencoded.append("mark2", mark2);
  urlencoded.append("mark3", mark3);

  const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
  };

  try {
      const response = await fetch(`${ROOT_URL}${root}/action.php?action=markUpdate`, requestOptions);
      
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