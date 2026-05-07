// src/utils/calendarHelpers.js
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth 
} from 'date-fns';

export const getMonthDays = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ 
    start: startDate, 
    end: endDate 
  });

  return calendarDays.map(day => ({
    key: day.toISOString(),
    date: day,
    isCurrentMonth: isSameMonth(day, monthStart)
  }));
};