'use client';

import { useState, useEffect, FC, ReactNode } from 'react';
import { getDates, getProgramsbyDate } from './func';
// Assuming your API functions are in a separate file

// --- Type Definitions ---
// Updated to include all possible categories from your API response
type ApiEventCategory = 'Keynote' | 'Workshop' | 'Competition' | 'Performance' | 'Ceremony' | 'general' | 'senior' | 'junior' | 'hss';
type UiEventCategory = 'Keynote' | 'Workshop' | 'Competition' | 'Performance' | 'Ceremony';


interface ScheduleEvent {
  id: number;
  venue: string;
  program_id: number | null;
  title: string | null;
  category: ApiEventCategory;
  start_time: string;
  end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
}

interface Venues {
  [venue: string]: ScheduleEvent[];
}

interface ScheduleData {
  [date: string]: Venues;
}

// --- Helper Functions & Components ---

// Maps the new API categories to the categories our UI understands
const mapApiCategoryToUiCategory = (apiCategory: ApiEventCategory): UiEventCategory => {
    const lowerCaseCategory = apiCategory.toLowerCase();
    switch (lowerCaseCategory) {
        case 'senior':
        case 'junior':
        case 'hss':
            return 'Competition';
        case 'general':
            return 'Performance';
        case 'keynote':
        case 'workshop':
        case 'competition':
        case 'performance':
        case 'ceremony':
            return apiCategory as UiEventCategory;
        default:
            return 'Performance'; // A safe default
    }
};

const getDurationInMinutes = (start: string, end: string): number => (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60);
const formatTime = (date: Date): string => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
const getEventStatus = (start_time: string, end_time: string, now: Date): 'past' | 'live' | 'future' => {
  const start = new Date(start_time);
  const end = new Date(end_time);
  if (now > end) return 'past';
  if (now >= start && now <= end) return 'live';
  return 'future';
};
const calculateDeviation = (planned: string, actual: string): string => {
    const diff = Math.round((new Date(actual).getTime() - new Date(planned).getTime()) / (1000 * 60));
    if (diff === 0) return "On time";
    return diff > 0 ? `Started ${diff} min late` : `Started ${Math.abs(diff)} min early`;
};
const getAccuracyColor = (planned: string, actual?: string): string => {
    if (!actual) return 'bg-gray-400';
    const diff = (new Date(actual).getTime() - new Date(planned).getTime()) / (1000 * 60);
    if (diff === 0) return 'bg-green-500';
    if (diff > 0 && diff <= 10) return 'bg-yellow-500';
    return 'bg-primary-500'; // Use primary for significant delays
};

interface ModalProps { show: boolean; onClose: () => void; title: string; children: ReactNode; }
const Modal: FC<ModalProps> = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4"><h3 className="text-xl font-semibold text-gray-800">{title}</h3><button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button></div>
                <div>{children}</div>
            </div>
        </div>
    );
};

interface EventBlockProps { event: ScheduleEvent; dayStartHour: number; status: 'past' | 'live' | 'future'; isConflicting: boolean; isFocused: boolean; isFilteredOut: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void; }
const EventBlock: FC<EventBlockProps> = ({ event, dayStartHour, status, isConflicting, isFocused, isFilteredOut, onClick, onMouseEnter, onMouseLeave }) => {
  const { start_time, end_time, actual_start_time, actual_end_time, category } = event;
  const displayStart = actual_start_time || start_time;
  const displayEnd = actual_end_time || end_time;
  const start = new Date(displayStart);
  const duration = getDurationInMinutes(displayStart, displayEnd);
  const scale = 60; // Fixed scale: 60px per hour
  const top = ((start.getHours() - dayStartHour) * 60 + start.getMinutes()) * (scale / 60);
  const height = duration * (scale / 60);
  const uiCategory = mapApiCategoryToUiCategory(category);

  let color = 'bg-blue-500'; // Default for non-competition
  if (isConflicting) {
      color = 'bg-red-600'; // Highest priority for conflicts
  } else if (status === 'past') {
      if (uiCategory === 'Competition' && actual_start_time) {
        color = getAccuracyColor(start_time, actual_start_time);
      } else {
        color = 'bg-blue-500'; // Default past color for non-competitions
      }
  } else if (uiCategory === 'Competition') {
      color = 'bg-rose-600';
  }

  const statusStyles = { past: 'saturate-50', live: 'ring-4 ring-offset-2 ring-red-500 animate-pulse', future: 'hover:-translate-y-1 hover:shadow-lg' };
  const focusStyle = isFocused ? 'opacity-100' : isFilteredOut ? 'opacity-30' : 'opacity-100';

  const hasDeviation = actual_start_time && status === 'past';
  const plannedStartOffset = hasDeviation ? (new Date(start_time).getTime() - new Date(actual_start_time!).getTime()) / (1000 * 60) * (scale / 60) : 0;

  return (
    <div
      className={`absolute w-full p-2 rounded-lg text-white overflow-hidden transition-all duration-300 cursor-pointer ${color} ${statusStyles[status]} ${focusStyle}`}
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
    >
      {isConflicting && <div className="absolute top-1 right-1 text-yellow-300 bg-gray-800 bg-opacity-50 rounded-full p-0.5">⚠️</div>}
      {hasDeviation && <div className="absolute left-0 w-full border-t-2 border-dashed border-white/70" style={{ top: `${plannedStartOffset}px` }}></div>}
      <div className="relative z-10">
        <p className="font-bold text-sm">{event.title || `Program ${event.program_id}`}</p>
        <p className="text-xs opacity-90">{formatTime(new Date(start_time))} - {formatTime(new Date(end_time))}</p>
      </div>
    </div>
  );
};

interface TimelineViewProps { venues: Venues; now: Date; isToday: boolean; activeFilter: string; focusedEventId: number | null; onEventClick: (event: ScheduleEvent) => void; onEventHover: (id: number | null) => void; }
const TimelineView: FC<TimelineViewProps> = ({ venues, now, isToday, activeFilter, focusedEventId, onEventClick, onEventHover }) => {
  const allEvents = Object.values(venues).flat();
  if (allEvents.length === 0) return <div className="text-center p-8 text-gray-500">No events scheduled.</div>;

  const startTimes = allEvents.map(e => new Date(e.start_time));
  const dayStartHour = Math.min(...startTimes.map(t => t.getHours()));
  const dayEndHour = Math.max(...allEvents.map(e => new Date(e.end_time).getHours())) + 1;
  const hours = Array.from({ length: Math.max(1, dayEndHour - dayStartHour + 1) }, (_, i) => dayStartHour + i);
  const scale = 60; // Fixed scale
  const nowPosition = ((now.getHours() - dayStartHour) * 60 + now.getMinutes()) * (scale / 60);

  const conflicts = detectConflicts(venues);

  return (
    <div className="flex w-full transition-all duration-300" style={{minWidth: `${Object.keys(venues).length * 180 + 100}px`}}>
      <div className="w-24 text-right pr-4 flex-shrink-0">
        <div style={{ height: `${40}px` }}></div>
        {hours.map(hour => (
            <div key={hour} style={{ height: `${scale}px` }} className="relative -top-3">
                <span className="text-sm text-gray-500">{formatTime(new Date(0, 0, 0, hour))}</span>
            </div>
        ))}
      </div>
      <div className="flex-1 grid gap-4 relative" style={{ gridTemplateColumns: `repeat(${Object.keys(venues).length}, 1fr)` }}>
        {isToday && <div className="absolute w-full h-0.5 bg-red-500 z-20" style={{ top: `${nowPosition}px` }}><div className="absolute -left-3 -top-2.5 w-3 h-3 bg-red-500 rounded-full"></div></div>}
        {Object.entries(venues).map(([venue, events]) => (
          <div key={venue} className="relative">
            <div className="h-10 text-center font-semibold text-gray-700 mb-2 sticky top-0 bg-gray-50 z-10">Stage {venue}</div>
            <div className="absolute w-full top-10 left-0 right-0 -z-10">
                {hours.map(hour => (
                    <div key={`${venue}-${hour}`} style={{ height: `${scale}px` }} className="border-t border-gray-200">
                        <div className="h-1/2 border-t border-dashed border-gray-200"></div>
                    </div>
                ))}
            </div>
            <div className="relative" onMouseLeave={() => onEventHover(null)}>
              {events.map(event => {
                const uiCategory = mapApiCategoryToUiCategory(event.category);
                const isFilteredOut = activeFilter !== 'All' && uiCategory !== activeFilter && focusedEventId === null;
                return (
                    <EventBlock key={event.id} event={event} dayStartHour={dayStartHour} status={getEventStatus(event.start_time, event.end_time, now)} isConflicting={conflicts.has(event.id)} isFocused={focusedEventId === event.id} isFilteredOut={isFilteredOut} onClick={() => onEventClick(event)} onMouseEnter={() => onEventHover(event.id)} onMouseLeave={() => onEventHover(null)} />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const detectConflicts = (venues: Venues): Set<number> => {
    const conflictIds = new Set<number>();
    for (const venue in venues) {
        if (Object.prototype.hasOwnProperty.call(venues, venue)) {
            const eventsInVenue = venues[venue];
            if (!Array.isArray(eventsInVenue)) {
                console.warn(`Data for venue ${venue} is not an array, skipping conflict detection.`);
                continue;
            }
            // Create a shallow copy before sorting to prevent state mutation
            const sortedEvents = [...eventsInVenue].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
            
            for (let i = 0; i < sortedEvents.length; i++) {
                for (let j = i + 1; j < sortedEvents.length; j++) {
                    const eventA_end = new Date(sortedEvents[i].end_time).getTime();
                    const eventB_start = new Date(sortedEvents[j].start_time).getTime();
                    if (eventB_start < eventA_end) {
                        conflictIds.add(sortedEvents[i].id);
                        conflictIds.add(sortedEvents[j].id);
                    }
                }
            }
        }
    }
    return conflictIds;
};

const ScheduleViewer: FC = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
  const [now, setNow] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [focusedEventId, setFocusedEventId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Effect to fetch the list of dates on initial load
  useEffect(() => {
    const fetchDates = async () => {
        setIsLoading(true);
        const response = await getDates();
        if (response && response.success) {
            const dateList: string[] = response.data;
            setDates(dateList);
            const todayStr = new Date().toISOString().split('T')[0];
            setActiveTab(dateList.includes(todayStr) ? todayStr : dateList[0] || null);
        }
        setIsLoading(false);
    };
    fetchDates();
  }, []);

  // Effect to fetch schedule data when the active tab changes
  useEffect(() => {
    if (!activeTab || scheduleData[activeTab]) return; // Don't refetch if data is cached

    const fetchPrograms = async () => {
        setIsContentLoading(true);
        const response = await getProgramsbyDate(activeTab);
        if (response && response.success) {
            setScheduleData(prev => ({...prev, [activeTab!]: response.data}));
        }
        setIsContentLoading(false);
    };
    fetchPrograms();
  }, [activeTab]); // *** BUG FIX: Removed scheduleData from dependency array ***

  const handleEventClick = (event: ScheduleEvent) => { setSelectedEvent(event); setIsModalOpen(true); };
  const categories: UiEventCategory[] = ['Keynote', 'Workshop', 'Competition', 'Performance', 'Ceremony'];
  const todayString = now.toISOString().split('T')[0];

  return (
    <>
    <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setActiveTab(date)}
                className={`px-4 py-2 ${activeTab === date ? "bg-violet-600 text-white shadow-md" : "border border-gray-300 text-gray-700 hover:bg-gray-100"} rounded-lg text-sm transition-all duration-200 font-medium`}
              >
                {date === todayString ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </button>
            ))}
          </div>
        </div>
        </div>
      <div className={`bg-white border border-gray-200 rounded-lg min-h-screen p-4 sm:p-6 lg:p-8 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-full mx-auto">
          {/* <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Event Schedule Timeline</h1>
          </div> */}
          {/* <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">{dates.map(date => <button key={date} onClick={() => setActiveTab(date)} className={`${activeTab === date ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}>{date === todayString ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</button>)}</nav>
          </div> */}
          <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button onClick={() => setActiveFilter('All')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>All</button>
            {categories.map(cat => <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-3 py-1 text-sm rounded-full flex items-center space-x-2 ${activeFilter === cat ? 'ring-2 ring-offset-2 ring-blue-500' : 'bg-white text-gray-700 hover:bg-gray-100'}`}><span>{cat}</span></button>)}
          </div>
          <div className="mt-2 overflow-x-auto">
            {isContentLoading && <div className="text-center p-8">Loading Schedule...</div>}
            {!isContentLoading && activeTab && scheduleData[activeTab] ? <TimelineView venues={scheduleData[activeTab]} now={now} isToday={activeTab === todayString} activeFilter={activeFilter} focusedEventId={focusedEventId} onEventClick={handleEventClick} onEventHover={setFocusedEventId} /> : !isLoading && !isContentLoading && <div className="text-center p-8 text-gray-500">Select a date.</div>}
          </div>
        </div>
      </div>
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedEvent?.title || 'Event Details'}>
        {selectedEvent && (
            <div className="space-y-4 text-gray-700">
                <div><p><strong className="font-semibold text-gray-900">Venue:</strong> Stage {selectedEvent.venue}</p>{selectedEvent.program_id && <p><strong className="font-semibold text-gray-900">Program ID:</strong> {selectedEvent.program_id}</p>}<p><strong className="font-semibold text-gray-900">Category:</strong> {selectedEvent.category}</p></div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div><h4 className="font-semibold text-gray-900 mb-1">Planned</h4><p>{formatTime(new Date(selectedEvent.start_time))} - {formatTime(new Date(selectedEvent.end_time))}</p><p className="text-sm text-gray-500">{getDurationInMinutes(selectedEvent.start_time, selectedEvent.end_time)} minutes</p></div>
                    {selectedEvent.actual_start_time && selectedEvent.actual_end_time ? (<div><h4 className="font-semibold text-gray-900 mb-1">Actual</h4><p>{formatTime(new Date(selectedEvent.actual_start_time))} - {formatTime(new Date(selectedEvent.actual_end_time))}</p><p className="text-sm text-gray-500">{getDurationInMinutes(selectedEvent.actual_start_time, selectedEvent.actual_end_time)} minutes</p></div>) : (<div><h4 className="font-semibold text-gray-900 mb-1">Actual</h4><p className="text-gray-500">Not recorded</p></div>)}
                </div>
                {selectedEvent.actual_start_time && (<div className="border-t pt-4"><h4 className="font-semibold text-gray-900 mb-1">Accuracy</h4><p>{calculateDeviation(selectedEvent.start_time, selectedEvent.actual_start_time)}</p></div>)}
            </div>
        )}
      </Modal>
    </>
  );
}

export default ScheduleViewer;
