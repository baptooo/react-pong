import React from 'react';

export const TRACK_WIDTH = 15;
export const TRACK_HEIGHT = 120;

const Track = ({
  x = 0,
  y = 0
}) => (
  <rect
    width={TRACK_WIDTH}
    height={TRACK_HEIGHT}
    y={-TRACK_HEIGHT / 2}
    transform={`translate(${x}, ${y})`}
  />
);

export default Track;
