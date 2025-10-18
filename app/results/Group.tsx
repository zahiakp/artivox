import { useEffect, useMemo, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import { FaStar } from "react-icons/fa";
import LDRloader from "../../components/common/LDRloader";
import { getTeamPoint, getTeamPointCatBased } from "../programs/func";
import { brandName, categoryMap } from "../data/branding";

interface Program {
    id: string | number;
    points: number;
    campus: string;
    campusNo: string | number;
}

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

const getRankStyles = (rank: number) => {
    const styles: { [key: number]: { row: string; text: string; icon: string } } = {
        1: { row: "bg-yellow-50", text: "text-yellow-700", icon: "bg-yellow-600" },
        2: { row: "bg-gray-50", text: "text-gray-700", icon: "bg-gray-600" },
        3: { row: "bg-orange-50", text: "text-orange-700", icon: "bg-orange-600" },
    };
    return styles[rank] || { row: "", text: "text-zinc-600", icon: "bg-primary-400 text-primary-700" };
};

function Group() {
  const [cookies] = useCookies([`${brandName}-access`]);
  const user = cookies[`${brandName}-access`] || {};
  const [groups, setGroups] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [after, setAfter] = useState(10);
  const [isafter, setIsAfter] = useState('');
  const debouncedAfter = useDebounce(after, 500);

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
      default:
        return "";
    }
  }, [user.role]);

  const fetchPrograms = useCallback(async () => {
    if (!proEndpoint) return;

    setLoading(true);
    setGroups([]);

    try {
      let programsResponse;
        if(status == "all"){
          programsResponse = await getTeamPoint(proEndpoint, debouncedAfter);
        }else{
        programsResponse = await getTeamPointCatBased(proEndpoint, status, debouncedAfter);
    }

      if (programsResponse && programsResponse.data) {
        setGroups(programsResponse.data);
        setIsAfter(programsResponse.after)
      } else {
        console.error("No programs returned or data is missing");
        setGroups([]);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [proEndpoint, user.role, user.campusId, status, debouncedAfter]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const rankedGroups = useMemo(() => {
    if (!Array.isArray(groups)) return [];

    const sortedGroups = groups
      .slice()
      .sort((a, b) => (b.points || 0) - (a.points || 0));

    let rank = 0;
    let lastPoints = -Infinity;

    return sortedGroups.map((program) => {
      if (program.points !== lastPoints) {
        rank++;
      }
      lastPoints = program.points;
      return {
        ...program,
        rank: rank,
      };
    });
  }, [groups]);

  const renderContent = () => {
    if (loading) {
      return <div className='flex items-center justify-center w-full h-60'><LDRloader /></div>;
    }

    if (rankedGroups.length === 0) {
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankedGroups.map((program) => {
              const rankStyle = getRankStyles(program.rank);
              return (
                <tr key={program.id} className={rankStyle.row}>
                   <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                            <div className={`rounded-full p-2 text-white h-fit w-fit ${rankStyle.icon}`}>
                                <FaStar />
                            </div>
                        </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="text-sm font-medium line-clamp-1 text-gray-900">{program.campus?.toUpperCase()}</p>
                        <div className="text-[12px] text-gray-500">ID: {program.campusNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap font-bold ${rankStyle.text}`}>{program.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-slate-200 flex items-center justify-between flex-wrap">
        <nav className="flex space-x-2 sm:space-x-8 px-6" aria-label="Tabs">
          {statusOptions.map((option) => (
            <button
              onClick={() => setStatus(option.value)}
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
        {isafter && <p className="text-gray">After <span className="font-semibold">{isafter}</span> programs</p>}
        <div className="mr-6 my-2 flex items-center gap-2">
          <span>Upto</span>
          <input
            id="search-input"
            onChange={(e) => setAfter(Number(e.target.value) || 0)}
            value={after}
            className="outline-none p-[6px] px-4 w-20 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            type="number"
            placeholder="Count"
          />
          <span>Results</span>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default Group;
