"use client";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

// Assuming these are the correct paths to your components
import Modal from "./Modal"; 
import DeleteParticipant from "../../app/programs/DeletePart";

// --- TYPE DEFINITIONS ---

interface Program {
  id: string;
  name: string;
}

interface Student {
  partId: string;
  studentName: string;
}

interface Team {
  id: string;
  campus: string;
  teamName: string;
  students: any[];
  name:string;
  jamiaNo:string;
}

interface FlatParticipant {
  id: string;
  studentName?: string;
  student?: string;
  teamId?: string;
  campus?: string;
  teamName?: string;
  students?: undefined;
  jamiaNo?: string;
}

type Participant = Team | FlatParticipant;

interface ParticipantsCardProps {
  close: any;
  program: Program;
  participants: Participant[];
  fetchPrograms: () => void;
}

// --- COMPONENT ---

const ParticipantsCard: React.FC<any> = ({ 
  close, 
  program, 
  participants = [], 
  fetchPrograms 
}) => {
  const [cookies] = useCookies(["access"]);
  // Explicitly type userRole state
  const [userRole, setUserRole] = useState<'admin' | 'campus' | undefined>();
  
  // Set user role from cookies once on component mount
  useEffect(() => {
    if (cookies?.access?.role) {
      setUserRole(cookies.access.role);
    }
  }, [cookies]);
console.log('participants',participants);

  const partEndpoint = "participants";

  // Type guard to check if a participant is a Team (grouped data)
  const isTeam = (participant: Participant): participant is Team => {
    return Array.isArray(participant.students);
  };
  
  // Determine the data structure based on the first element.
  const isGroupedData = participants.length > 0 && isTeam(participants[0]);

  /**
   * Renders the table header row with columns based on user role and data structure.
   */
  const renderTableHeader = (): JSX.Element | null => {
    // Don't render a header if the role isn't set yet
    if (!userRole) return null;

    return (
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          {!isGroupedData && userRole === 'admin' && <th>Id</th>}
          {!isGroupedData && userRole === 'campus' && <th>Part Id</th>}
          {(userRole === 'admin') && <th>Team</th>}
          <th></th>
        </tr>
      </thead>
    );
  };

  /**
   * Renders table rows for grouped data (teams of students).
   */
  const renderGroupedRows = (): JSX.Element[] => {
    const teams = participants as Team[];
    return teams.map((team, index) => (
      <tr key={team.id || `team-${index}`} className="align-top mb-5">
  <th className="text-left py-2 px-3">{index + 1}</th>

  {/* Student List */}
  <td className="py-2 px-3 max-w-[600px]">
    <div className="flex flex-wrap gap-1">
      {team.students?.map((student, studentIdx) => (
        <span
          key={student.partId || `student-${studentIdx}`}
          className="inline-flex items-center bg-gray-100 text-sm text-gray-800 px-2 py-1 rounded-md"
        >
          <span className="font-semibold mr-1">{student.name || 'Unknown'}</span>
          <span className="text-xs text-gray-500">({student.jamiaNo})</span>
        </span>
      ))}
      {!team.students?.length && (
        <>
        {userRole === 'admin' && <td>{team.name?.toUpperCase() || 'N/A'}</td>}
        {/* {userRole === 'campus' && <td>{item.teamId || 'N/A'}</td>} */}
        </>
      )}
    </div>
  </td>

  {/* Team Name */}
  {userRole === 'admin' && <td className="py-2 px-3 font-medium text-gray-700">{team.campus}</td>}

  {/* Delete Action */}
  <td className="py-2 px-3">
    <DeleteParticipant 
      id={team.id} 
      fetchPrograms={fetchPrograms} 
      close={close} 
      root={partEndpoint} 
    />
  </td>
</tr>

    ));
  };

  /**
   * Renders table rows for flat data (individual participants).
   */
  const renderFlatRows = (): JSX.Element[] | null => {
    if (!userRole) return null; // Don't render rows if role is unknown

    const flatParticipants = participants as FlatParticipant[];
    return flatParticipants.map((participant, index) => (
      <tr key={participant.id || `part-${index}`}>
        <th>{index + 1}</th>
        <td>{participant.studentName?.toUpperCase() || 'N/A'}</td>
        
        <td>{participant.jamiaNo || 'N/A'}</td>
        {userRole === 'admin' && <td>{participant.campus || 'N/A'}</td>}
        
        <td>
          <DeleteParticipant 
            id={participant.id} 
            fetchPrograms={fetchPrograms} 
            close={close} 
            root={partEndpoint} 
          />
        </td>
      </tr>
    ));
  };

  return (
    <Modal close={close}>
      <div className="flex flex-col gap-4 p-4 md:w-fit max-h-[80vh]">
        <h6 className="font-bold text-xl text-center text-gray-800">
          {program.name}
        </h6>
        <div className="">
          <table className="table table-zebra w-full text-sm">
            {renderTableHeader()}
            <tbody>
              {/* Only render the body when we know the role and have participants */}
              {userRole && participants.length > 0 ? 
                (isGroupedData ? renderGroupedRows() : renderFlatRows()) : 
                <tr><td colSpan={5} className="text-center p-4">No participants found.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default ParticipantsCard;
