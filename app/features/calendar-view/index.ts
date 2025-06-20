/**
 * Calendar View Feature
 * Public API exports for calendar view feature following FSD structure
 */

// UI Components
export { CalendarView } from './ui/calendar-view.page';
export { CalendarEvent } from './ui/CalendarEvent';

// Hooks
export {
  useCalendar,
  useCalendarEvents,
  useTaskDragDrop,
  useCalendarFilters,
  type CalendarEvent as CalendarEventType,
} from './hooks';

// API
export * from './api';
