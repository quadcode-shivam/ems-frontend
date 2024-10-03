import React, { useEffect, useState } from 'react';
import { Atom, Mosaic } from 'react-loading-indicators';

const Loader = ({ color = "white", size = "medium", onHide }) => {
  const [visible, setVisible] = useState(true);
  
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onHide) {
        onHide(); // Call the onHide function if provided
      }
    }, 2000); // 2000ms = 2 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onHide]);

  if (!visible) return null; // Hide loader if not visible

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backdropFilter: 'blur(3px)',
        background: 'transparent',
        position: "absolute",
        width: "100%",
        zIndex: "9999"
      }}
    >
      <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} size={getSize()} />
    </div>
  );
};

export default Loader;
