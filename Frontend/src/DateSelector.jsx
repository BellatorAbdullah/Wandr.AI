import { useState, useMemo } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { getMonthDays } from './utils/calendarHelpers';

export default function DateSelector({ value, onSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = useMemo(() => getMonthDays(currentDate), [currentDate]);

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</button>
        <span className="month-label">{format(currentDate, 'MMMM yyyy')}</span>
        <button className="nav-btn" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {['S','M','T','W','T','F','S'].map(d => (
          <div key={d} className="day-name">{d}</div>
        ))}
        
        {days.map((day) => (
          <button 
            key={day.key}
            onClick={() => {
              if (day.isCurrentMonth) onSelect(format(day.date, 'MMMM d, yyyy'));
            }}
            className={`date-btn ${value === format(day.date, 'MMMM d, yyyy') ? 'selected' : ''} ${!day.isCurrentMonth ? 'empty' : ''}`}
          >
            {format(day.date, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
}