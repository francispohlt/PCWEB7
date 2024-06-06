import React from 'react';
import moment from 'moment'; // Import moment

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToMonthView = () => {
    toolbar.onView('month');
  };

  const goToWeekView = () => {
    toolbar.onView('week');
  };

  const goToYearView = () => {
    toolbar.onView('year');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span>
        <b>{date.format('MMMM')}</b>
        <span> {date.format('YYYY')}</span>
      </span>
    );
  };

  return (
    <div className="custom-toolbar">
      <button onClick={goToBack}>Back</button>
      <button onClick={goToCurrent}>Today</button>
      <button onClick={goToNext}>Next</button>
      <button onClick={goToMonthView}>Month</button>
      <button onClick={goToWeekView}>Week</button>
      <div className="label">{label()}</div>
    </div>
  );
};

export default CustomToolbar;
