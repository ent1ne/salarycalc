import React from 'react';

interface TooltipProps {
    text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
    return (
        <span className="tooltip-container">
            <span className="tooltip-trigger">?</span>
            <span className="tooltip-content">{text}</span>
        </span>
    );
};
