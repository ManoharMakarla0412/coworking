'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

const mockEvents = [
  {
    id: '1',
    title: 'Twice event For two Days',
    start: '2025-01-03',
    end: '2025-01-04',
    color: 'bg-indigo-500'
  },
  {
    id: '2',
    title: 'Lunch with Mr.Raw',
    start: '2025-01-08',
    color: 'bg-blue-500'
  },
  {
    id: '3',
    title: 'Going For Party of Sahs',
    start: '2025-01-11',
    color: 'bg-blue-500'
  },
  {
    id: '4',
    title: 'Learn ReactJs',
    start: '2025-01-13',
    color: 'bg-emerald-500'
  },
  {
    id: '5',
    title: 'Launching MaterialArt Angular',
    start: '2025-01-17',
    color: 'bg-red-400'
  },
  {
    id: '6',
    title: 'Research of making own Browser',
    start: '2025-01-19',
    end: '2025-01-21',
    color: 'bg-indigo-500'
  },
  {
    id: '7',
    title: 'Learn Ionic',
    start: '2025-01-23',
    end: '2025-01-24',
    color: 'bg-yellow-500'
  }
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2025-01-10'));
  const [view, setView] = useState('month');
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add previous month's days
    for (let i = 0; i < firstDay.getDay(); i++) {
      const day = new Date(year, month, -i);
      days.unshift(day);
    }
    
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month's days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i));
    }
    
    return days;
  };

  const getHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = event.end ? new Date(event.end) : eventStart;
      return date >= eventStart && date <= eventEnd;
    });
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="grid grid-cols-7 border border-slate-700 rounded-lg overflow-hidden">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-sm text-center text-gray-400 border-b border-slate-700 bg-slate-800/50">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const events = getEventsForDate(day);
          const isOtherMonth = day.getMonth() !== currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={cn(
                "min-h-24 p-1 border-r border-b border-slate-700 transition-colors duration-200",
                isOtherMonth ? "opacity-50 bg-slate-800/20" : "hover:bg-slate-800/40",
                isToday ? "bg-slate-800/60" : ""
              )}
            >
              <div className="p-1 text-sm">{day.getDate()}</div>
              <div className="space-y-1">
                {events.map(event => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs p-1 rounded text-white truncate transform transition-all duration-200 hover:scale-105 hover:z-10 cursor-pointer",
                      event.color
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    const hours = getHours();

    return (
      <div className="grid grid-cols-8 border border-slate-700 rounded-lg overflow-hidden">
        <div className="p-2 text-sm text-center text-gray-400 border-b border-r border-slate-700 bg-slate-800/50">
          Time
        </div>
        {days.map((day, index) => (
          <div key={index} className="p-2 text-sm text-center text-gray-400 border-b border-r border-slate-700 bg-slate-800/50">
            {formatDate(day)}
          </div>
        ))}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="p-2 text-sm text-gray-400 border-r border-b border-slate-700">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {days.map((day, dayIndex) => (
              <div key={`${hour}-${dayIndex}`} className="border-r border-b border-slate-700 p-1 transition-colors duration-200 hover:bg-slate-800/40">
                {getEventsForDate(day).map(event => {
                  const eventDate = new Date(event.start);
                  if (eventDate.getHours() === hour) {
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs p-1 rounded text-white transform transition-all duration-200 hover:scale-105",
                          event.color
                        )}
                      >
                        {event.title}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };


  const renderDayView = () => {
    const hours = getHours();

    return (
      <div className="grid grid-cols-1 gap-px">
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-[100px_1fr] border-t border-slate-800">
            <div className="p-2 text-sm text-gray-400">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="p-1">
              {getEventsForDate(currentDate).map(event => {
                const eventDate = new Date(event.start);
                if (eventDate.getHours() === hour) {
                  return (
                    <div
                      key={event.id}
                      className={cn("text-xs p-1 rounded text-white", event.color)}
                    >
                      {event.title}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAgendaView = () => {
    return (
      <div className="space-y-1">
        {mockEvents.map(event => (
          <div
            key={event.id}
            className="grid grid-cols-[200px_1fr] p-2 border-t border-slate-800"
          >
            <div className="text-sm text-gray-400">
              {new Date(event.start).toLocaleDateString()} {event.end && `- ${new Date(event.end).toLocaleDateString()}`}
            </div>
            <div className={cn("text-sm p-1 rounded text-white", event.color)}>
              {event.title}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="flex items-center gap-2 p-4 text-sm">
        <Link href="/" className="text-blue-500 hover:text-blue-400">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-600" />
        <span>Calendar</span>
      </div>

      <div className="p-4 max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Calendar</h1>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-[#2a2a2a] text-white border-gray-700 hover:bg-gray-700"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-[#2a2a2a] text-white border-gray-700 hover:bg-gray-700"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-[#2a2a2a] text-white border-gray-700 hover:bg-gray-700"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {['month', 'week', 'day', 'agenda'].map((v) => (
                <Button
                  key={v}
                  variant={view === v ? 'secondary' : 'outline'}
                  className={cn(
                    "bg-[#2a2a2a] border-gray-700 hover:bg-gray-700",
                    view === v ? 'text-white bg-gray-700' : 'text-gray-300'
                  )}
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
            {view === 'agenda' && renderAgendaView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;