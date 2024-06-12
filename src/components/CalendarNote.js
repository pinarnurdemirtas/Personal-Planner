import React from 'react';
import { Calendar, Badge, List, Button } from 'antd';
import moment from 'moment';
import Rutin from './Rutin';

const getListData = (value) => {
  if (!value) return []; // Null check and return empty array
  
  let listData;
  if (value.month() === 6 && value.date() === 8) { 
    listData = [
      { type: 'warning', content: 'This is a warning event.' },
      { type: 'success', content: 'This is a usual event.' },
    ];
  }
  if (value.month() === 5 && value.date() === 17) { 
    listData = [
      { type: 'warning', content: 'This is a warning event.' },
      { type: 'success', content: 'This is a usual event.' },
    ];
  }
  if (value.month() === 7 && value.date() === 2) { 
    listData = [
      { type: 'warning', content: 'This is a warning event.' },
      { type: 'success', content: 'This is a usual event.' },
    ];
  }
  if (value.month() === 6 && value.date() === 8) { 
    listData = [
      { type: 'warning', content: 'This is a warning event.' },
      { type: 'success', content: 'This is a usual event.' },
    ];
  }
  if (value.month() === 2 && value.date() === 8) { 
    listData = [
      { type: 'warning', content: 'This is a warning event.' },
      { type: 'success', content: 'This is a usual event.' },
    ];
  }
  return listData || [];
};

const dateCellRender = (value) => {

  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map((item, index) => (
        <li key={index}>
          <span className={`event-${item.type}`}>{item.content}</span>
        </li>
      ))}
    </ul>
  );
};

const CalendarNote = (todos) => {
  const renderDateCell = (value) => dateCellRender(value);
  console.log("to", todos);
  return (
    <div className="site-calendar-demo-card">
      <Calendar dateCellRender={renderDateCell} />
    </div>
  );
};

export default CalendarNote;
