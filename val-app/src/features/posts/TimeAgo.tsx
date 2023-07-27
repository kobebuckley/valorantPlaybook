import React from 'react';
import { parseISO, formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  timestamp: string; 
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  let timeAgo = '';
  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago `;
  }

  return (
    <div>
        <span title={timestamp}>
        &nbsp; <i>{timeAgo}</i>
        </span>
    </div>
  );
};
