
import CardGeneratorPage from "../../components/common/Card";
import Card from "../../components/common/Card";
import { getStudentsByCampus} from "../campus/func";

async function page() {
  
  // const students = await getStudentsByCampus("hizone");
  // const students = ""
//  console.log("studentData",students);
 
  return (
    <div className="h-full">
     
      {/* <CardGeneratorPage data={students.data}/>  */}
     
    </div>
  );
}

export default page;
