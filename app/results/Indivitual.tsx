import { useEffect, useMemo, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { getIndivitualPoints, getIndivitualPointsCatBased } from "../programs/func";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import { FaStar } from "react-icons/fa";
import LDRloader from "../../components/common/LDRloader";
import { WSelectAuto } from "../../components/common/Form";
import { useFormik } from "formik";
import { Select } from "antd";
import { brandName, categoryMap } from "../data/branding";

// Interface for individual program data
interface IndividualProgram {
    id: string | number;
    points: number;
    student: string;
    jamiaNo: string;
    campus: string;
    category: string;
}

// Debounce hook to delay API calls on input change
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Helper function for dynamic rank styling
const getRankStyles = (rank: number) => {
    const styles: { [key: number]: { row: string; text: string; icon: string } } = {
        1: { row: "bg-yellow-50", text: "text-yellow-700", icon: "bg-yellow-600" },
        2: { row: "bg-gray-50", text: "text-gray-700", icon: "bg-gray-600" },
        3: { row: "bg-orange-50", text: "text-orange-700", icon: "bg-orange-600" },
    };
    return styles[rank] || { row: "", text: "text-zinc-600", icon: "bg-primary-400 text-primary-700" };
};

// The component is now correctly named and structured for Individual Points
function IndividualPoint() {
  const [cookies] = useCookies([`${brandName}-access`]);
  const user = cookies[`${brandName}-access`] || {};
  
  const [individuals, setIndividuals] = useState<IndividualProgram[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for filtering, similar to the Group component
  const [status, setStatus] = useState("all");
  const [after, setAfter] = useState(10);
  const [isStage, setIsStage] = useState("all");
  // const debouncedAfter = useDebounce(after, 500);

  const allProgramsOption = { label: "Overall", value: "all" };
const categoryOptions = Object.entries(categoryMap).map(([key, label]) => ({
  label: label,
  value: key
}));
const statusOptions = [allProgramsOption, ...categoryOptions];

  const proEndpoint = useMemo(() => {
    switch (user.role) {
      case "admin":
      case "announce":
        return "programs";
      case "zoneAdmin":
      case "zonecampus":
        return "zoneprograms";
      case "campusAdmin":
      case "Group": // Assuming 'Group' role is a typo and should be 'campusUser' or similar
        return "campusprograms";
      default:
        return "";
    }
  }, [user.role]);

  const fetchPrograms = useCallback(async () => {
    if (!proEndpoint) return;

    setLoading(true);
    setIndividuals([]);

    try {
      let programsResponse;
      // Correctly calling the individual point functions with status and after count
      if(status == "all"){
        programsResponse = await getIndivitualPoints(proEndpoint,isStage !== "all" ? isStage : '');
      }else{
        programsResponse = await getIndivitualPointsCatBased(proEndpoint,status,isStage !== "all" ? isStage : '');
      }

      if (programsResponse && programsResponse.data) {
        setIndividuals(programsResponse.data);
      } else {
        setIndividuals([]);
      }
    } catch (error) {
      console.error("Error fetching individual points:", error);
      setIndividuals([]);
    } finally {
      setLoading(false);
    }
  }, [proEndpoint, user.role, user.campusId, status,isStage]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const rankedIndividuals = useMemo(() => {
    if (!Array.isArray(individuals)) return [];

    const sortedIndividuals = individuals
      .slice()
      .sort((a, b) => (b.points || 0) - (a.points || 0));

    let rank = 0;
    let lastPoints = -Infinity;

    return sortedIndividuals.map((program) => {
      if (program.points !== lastPoints) {
        rank++;
      }
      lastPoints = program.points;
      return {
        ...program,
        rank: rank,
      };
    });
  }, [individuals]);

  const renderContent = () => {
    if (loading) {
      return <div className='flex items-center justify-center w-full h-60'><LDRloader /></div>;
    }

    if (rankedIndividuals.length === 0) {
      return (
        <div className="flex gap-5 w-full items-center justify-center flex-col p-10">
          <div className="p-5 rounded-full bg-blue-50 text-blue-600">
            <IconInfoHexagon size="50" />
          </div>
          No data found for the selected criteria.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              {status == "all" && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankedIndividuals.map((item) => {
              const rankStyle = getRankStyles(item.rank);
              return (
                <tr key={item.id} className={rankStyle.row}>
                   <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                            <div className={`rounded-full p-2 text-white h-fit w-fit ${rankStyle.icon}`}>
                                <FaStar />
                            </div>
                        </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <p className="text-sm font-medium line-clamp-1 text-gray-900">{item.student?.toUpperCase()}</p>
                        <div className="text-[12px] text-gray-500">Part Id : {item.jamiaNo}</div>
                      </div>
                    </div>
                  </td>
                  {status == "all" && <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.category?.toUpperCase()}</div>
                  </td>}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.campus?.toUpperCase()}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${rankStyle.text}`}>{item.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  };
 const options = [
    { value: 'all', label: 'All Programs' },
    { value: "1", label: 'Stage' },
    { value: "0", label: 'off-Stage' },
  ]
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-slate-200 flex items-center justify-between flex-wrap">
        <nav className="flex space-x-2 sm:space-x-8 px-6" aria-label="Tabs">
          {statusOptions.map((option) => (
            <button
              onClick={() => {setStatus(option.value); setIsStage("all")}}
              key={option.value}
              className={`border-b-2 whitespace-nowrap ${option.value === status
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                } py-4 px-1 text-sm font-medium transition-colors duration-200`}
            >
              {option.label}
            </button>
          ))}
        </nav>
        <div className="mr-6 flex items-center gap-2">
          {/* <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option>All Programs</option>
            <option>Stage</option>
            <option>Off-stage</option>
          </select> */}
          <Select
        bordered={false}
        className={`w-full my-2 border min-w-[200px] rounded-lg focus:border-primary-600 cursor-pointer h-fit`}
        showSearch
        size="large"
        value={isStage}
        onChange={(value:any) => setIsStage(value)} // Set Formik's value
        options={options} // Pass in options for the select
      />
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default IndividualPoint;
