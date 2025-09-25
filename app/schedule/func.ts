import axios from "axios";
import { ROOT_URL } from "../data/func";

export async function getDates() {
  const URL: string = `${ROOT_URL}schedule/action.php`;
  
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

export async function getProgramsbyDate(date:any) {
  const URL: string = `${ROOT_URL}schedule/action.php?date=${date}`;
  
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