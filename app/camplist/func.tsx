import axios from "axios";
import { ROOT_URL } from "../data/func";

export async function getProgramListforPdf(cat:any,campus:any) {
    const URL: string = `${ROOT_URL}programs/action.php?action=getProgramList&category=${cat}&campus=${campus}`;
    
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