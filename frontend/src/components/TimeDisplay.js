import React from 'react';
import { getRelativeTime } from '../utils/relativeTime';

const TimeDisplay = ({ timestamp }) => {
    return (
        <div>
            {getRelativeTime(timestamp)}
        </div>
    );
};

export default TimeDisplay;