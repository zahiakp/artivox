"use client";

import React, { useEffect, useReducer, useCallback, useMemo } from "react";
import { useCookies } from "react-cookie";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";

// --- Restored External Imports ---
// NOTE: Adjust the paths to match your project structure.
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import { getTopicsByProgram } from "./func";
import { getProgramsbyStatusandPagination } from "../programs/func";
import { AddTopic } from "../../components/common/AddTopic";
import IconMaximizeSquare from "../../components/icon/icon-maximize-square";
import { ViewTopic } from "../../components/common/ViewTopic";
import { getFirstLastInitials } from "../../components/common/NameShorter";
import LDRloader from "../../components/common/LDRloader";
import { showMessage } from "../../components/common/CusToast";

// --- Type Definitions ---
interface Program {
    id: number;
    name: string;
    category: string;
    topics: number;
}

interface Topic {
    id: number;
    name: string;
}

interface ProgramApiResponse {
    data: Program[];
    total: number;
}

interface TopicsApiResponse {
    success: boolean;
    data: Topic[];
}

// --- Placeholder for EditTopic component ---
const EditTopic = ({ program, topics, onClose, onTopicUpdated }: { program: Program, topics: Topic[], onClose: () => void, onTopicUpdated: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Topics for "{program.name}"</h2>
            <p>Topic editing form goes here...</p>
            <ul className="list-disc pl-5 mt-4 max-h-60 overflow-y-auto">
                {topics.map(t => <li key={t.id}>{t.name}</li>)}
            </ul>
            <div className="flex justify-end space-x-2 mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={() => { showMessage('Topics updated successfully!', 'success'); onTopicUpdated(); }} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Save Changes</button>
            </div>
        </div>
    </div>
);


// --- Custom Hooks ---
const useDebounce = (value: string, delay: number): string => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
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

// --- Component State and Reducer (TypeScript Conversion) ---
type State = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    programs: Program[];
    totalRecords: number;
    error: string | null;
    pagination: { page: number; rows: number };
    filters: {
        searchQuery: string;
        type: string;
    };
    modal: {
        type: 'add' | 'edit' | 'view' | null;
        program: Program | null;
        topics: Topic[];
        isLoading: boolean;
    };
};

// --- Discriminated Union for Reducer Actions ---
type Action =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: { programs: Program[]; total: number } }
    | { type: 'FETCH_FAILURE'; payload: string }
    | { type: 'SET_PAGINATION'; payload: { page: number; rows: number } }
    | { type: 'SET_FILTER'; payload: { filter: keyof State['filters']; value: string } }
    | { type: 'RESET_PAGINATION' }
    | { type: 'OPEN_MODAL'; payload: { type: 'add' | 'edit' | 'view'; program: Program } }
    | { type: 'MODAL_FETCH_TOPICS_INIT' }
    | { type: 'MODAL_FETCH_TOPICS_SUCCESS'; payload: Topic[] }
    | { type: 'MODAL_FETCH_TOPICS_FAILURE' }
    | { type: 'CLOSE_MODAL' };

const initialState: State = {
    status: 'idle',
    programs: [],
    totalRecords: 0,
    error: null,
    pagination: { page: 1, rows: 15 },
    filters: {
        searchQuery: '',
        type: 'all',
    },
    modal: { type: null, program: null, topics: [], isLoading: false },
};

const topicReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, status: 'loading', error: null };
        case 'FETCH_SUCCESS':
            return { ...state, status: 'succeeded', programs: action.payload.programs, totalRecords: action.payload.total };
        case 'FETCH_FAILURE':
            return { ...state, status: 'failed', error: action.payload, programs: [] };
        case 'SET_PAGINATION':
            return { ...state, pagination: action.payload };
        case 'SET_FILTER':
            return { ...state, filters: { ...state.filters, [action.payload.filter]: action.payload.value } };
        case 'RESET_PAGINATION':
             return { ...state, pagination: { ...state.pagination, page: 1 } };
        case 'OPEN_MODAL':
            return { ...state, modal: { ...initialState.modal, type: action.payload.type, program: action.payload.program } };
        case 'MODAL_FETCH_TOPICS_INIT':
            return { ...state, modal: { ...state.modal, isLoading: true } };
        case 'MODAL_FETCH_TOPICS_SUCCESS':
            return { ...state, modal: { ...state.modal, isLoading: false, topics: action.payload } };
        case 'MODAL_FETCH_TOPICS_FAILURE':
            return { ...state, modal: { ...state.modal, isLoading: false } };
        case 'CLOSE_MODAL':
            return { ...state, modal: initialState.modal };
        default:
            return state;
    }
}

// --- Main Component ---
function TopicList() {
    const [state, dispatch] = useReducer(topicReducer, initialState);
    const [cookies] = useCookies(["access"]);
    const debouncedSearchQuery = useDebounce(state.filters.searchQuery, 500);

    const userRole = useMemo(() => cookies?.access?.role, [cookies]);
    const campusId = useMemo(() => cookies?.access?.campusId, [cookies]);

    const fetchPrograms = useCallback(async () => {
        dispatch({ type: 'FETCH_INIT' });

        const { page, rows } = state.pagination;
        const query = new URLSearchParams({
            page: page.toString(),
            limit: rows.toString(),
            search: debouncedSearchQuery || '',
        }).toString();

        try {
            const endpoint = (userRole === "admin" || userRole === "campus") ? "programs"
                : (userRole === "zoneAdmin" || userRole === "zonecampus") ? "zoneprograms"
                : (userRole === "campusAdmin" || userRole === "campusJudge") ? "campusprograms"
                : "";
            
            if (!endpoint) {
                throw new Error("User role is not authorized to view programs.");
            }

            let response: ProgramApiResponse;
            
                response = await getProgramsbyStatusandPagination("pending", query, endpoint);
            

            dispatch({ type: 'FETCH_SUCCESS', payload: { programs: response.data || [], total: response.total || 0 } });
        } catch (error) {
            console.error("Error fetching programs:", error);
            dispatch({ type: 'FETCH_FAILURE', payload: error instanceof Error ? error.message : "An unknown error occurred." });
        }
    }, [state.pagination, debouncedSearchQuery, userRole, campusId]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);
    
    useEffect(() => {
        dispatch({ type: 'RESET_PAGINATION' });
    }, [debouncedSearchQuery, state.filters.type]);


    const handleOpenModalWithTopics = useCallback(async (program: Program, action: 'edit' | 'view') => {
        dispatch({ type: 'OPEN_MODAL', payload: { type: action, program } });
        dispatch({ type: 'MODAL_FETCH_TOPICS_INIT' });
        try {
            const response = await getTopicsByProgram(program.id);
            if (response.success) {
                dispatch({ type: 'MODAL_FETCH_TOPICS_SUCCESS', payload: response.data });
            } else {
                throw new Error("Failed to fetch topics.");
            }
        } catch (error) {
            console.error("Error fetching topics for modal:", error);
            dispatch({ type: 'MODAL_FETCH_TOPICS_FAILURE' });
            showMessage("Could not load topics for this program.", "error");
        }
    }, []);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        dispatch({ type: 'SET_PAGINATION', payload: { page: e.page + 1, rows: e.rows } });
    };
    
    const handleApplyFilters = () => {
        showMessage("Filters has been disabled due to a security concern", "info");
    };

    const renderContent = () => {
        if (state.status === 'loading') {
            return (
                <div className='bg-pink-50 flex items-center justify-center w-full h-60 rounded-lg border border-pink-200'>
                    <LDRloader />
                </div>
            );
        }

        if (state.status === 'failed') {
             return (
                <div className="flex gap-5 w-full bg-red-50 rounded-xl min-h-60 border border-red-200 items-center justify-center flex-col p-10">
                    <div className="p-5 rounded-full bg-red-100 text-red-600"><IconInfoHexagon size="50" /></div>
                    <p className="font-semibold text-red-700">Failed to load programs</p>
                    <p className="text-red-600">{state.error}</p>
                </div>
             );
        }

        if (state.status === 'succeeded' && state.programs.length === 0) {
            return (
                <div className="flex gap-5 w-full bg-blue-50 rounded-xl min-h-60 border border-blue-200 items-center justify-center flex-col p-10">
                    <div className="p-5 rounded-full bg-blue-100 text-blue-600"><IconInfoHexagon size="50" /></div>
                    No Programs Found
                </div>
            );
        }
        
        return (
             <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{state.totalRecords}</span> Centers</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            Showing {(state.pagination.page - 1) * state.pagination.rows + 1}-
                            {Math.min(state.pagination.page * state.pagination.rows, state.totalRecords)} of {state.totalRecords}
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topics</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {state.programs.map((program) => (
                                <tr key={program.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://placehold.co/40x40/FEC5F6/B33791?text=${getFirstLastInitials(program.name)}`}
                                                alt={program.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-900">{program.name}</p>
                                                <div className="text-sm text-gray-500">ID: #GT0{program.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.topics > 0 ? `${program.topics} Topics` : 'No Topics'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {program.topics > 0 ? (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleOpenModalWithTopics(program, 'view')}
                                                    className="p-2 rounded-lg gap-2 px-3 pr-4 text-white flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-opacity"
                                                >
                                                    <IconMaximizeSquare size="18" />View
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModalWithTopics(program, 'edit')}
                                                    className="rounded-lg p-2 px-4 bg-gradient-to-tr from-pink-400 to-pink-600 text-white flex items-center w-fit cursor-pointer hover:opacity-90 transition-opacity"
                                                >
                                                    Edit Topic
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'add', program } })}
                                                className="rounded-lg p-2 px-4 bg-gradient-to-tr from-red-400 to-red-600 text-white flex w-fit cursor-pointer hover:opacity-90 transition-opacity"
                                            >
                                                Add Topic
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="px-6 w-full border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm flex text-gray-700">
                        Page {state.pagination.page} of {Math.ceil(state.totalRecords / state.pagination.rows)}
                    </div>
                    <div className="w-fit"><Paginator
                        first={(state.pagination.page - 1) * state.pagination.rows}
                        rows={state.pagination.rows}
                        totalRecords={state.totalRecords}
                        rowsPerPageOptions={[10, 15, 20]}
                        onPageChange={onPageChange}
                        className="w-fit"
                    /></div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-purple-200 p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className='col-span-1 md:col-span-2'>
                        <label htmlFor="search-centers" className="block text-sm font-medium text-gray-700 mb-2">Search Centers</label>
                        <input
                            id="search-centers"
                            type="text"
                            placeholder="Search by name or location..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={state.filters.searchQuery}
                            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { filter: 'searchQuery', value: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            id="type-filter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={state.filters.type}
                            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { filter: 'type', value: e.target.value } })}
                        >
                            <option value="all">All Types</option>
                            <option value="stage">Stage</option>
                            <option value="off">Off</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
            
            {renderContent()}

            {/* Modal Rendering */}
            {state.modal.type && state.modal.program && (
                <>
                    {state.modal.type === 'view' && (
                        <ViewTopic
                            view={{program:state.modal.program, topics: state.modal.topics}}
                            close={() => dispatch({ type: 'CLOSE_MODAL' })}
                            fetch={() => {
                                dispatch({ type: 'CLOSE_MODAL' });
                                fetchPrograms();
                            }}
                        />
                        // <ViewTopic close={setView} fetch={fetchPrograms} view={view}/>
                    )}
                     {state.modal.type === 'edit' && (
                        <AddTopic
                            edit={{program:state.modal.program, topics: state.modal.topics}}
                            data={state.modal.topics}
                            close={() => dispatch({ type: 'CLOSE_MODAL' })}
                            fetch={() => {
                                dispatch({ type: 'CLOSE_MODAL' });
                                fetchPrograms();
                            }}
                        />
                    )}
                    {state.modal.type === 'add' && (
                        <AddTopic
                            data={state.modal.program}
                            close={() => dispatch({ type: 'CLOSE_MODAL' })}
                            fetch={() => {
                                dispatch({ type: 'CLOSE_MODAL' });
                                fetchPrograms();
                            }}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default TopicList;
