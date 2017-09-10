import React from 'react';

export const BALL_RADIUS = 25;

const Ball = ({
  x = 0,
  y = 0
}) => <circle r={BALL_RADIUS} transform={`translate(${x}, ${y})`} />;

export default Ball;
