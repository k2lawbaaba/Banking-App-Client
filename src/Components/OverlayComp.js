import React from "react";

function OverlayComponent({ component, onClose }) {
  return (
    <div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <div>{component}</div>
    </div>
  );
}

export default OverlayComponent;
