import React from 'react';
import { Atom, Mosaic } from 'react-loading-indicators';

const Loader = ({ color = "white", size = "medium" }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 24; // Adjust if needed
      case 'medium':
        return 40; // Adjust if needed
      case 'large':
        return 56; // Adjust if needed
      default:
        return 40; // Fallback to medium
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backdropFilter: 'blur(3px)',
        background: 'transparent',
        position:"absolute",
        width:"100%",
        zIndex:"9999"
      }}
    >
      <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
    </div>
  );
};

export default Loader;
