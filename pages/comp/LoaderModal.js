import React from "react";
import { ThreeDots } from "react-loader-spinner";

const LoaderModal = ({ active }) => {
  if (!active) return null;
  return (
    <div className="modal">
      <div className="modal__container loader">
        <div className="modal__container--head"></div>
        <div className="modal__container--middle">
          <ThreeDots color="black" ariaLabel="loading-indicator" />
        </div>
        <div className="modal__container--foot">
          Please wait while we are processing...
        </div>
      </div>
    </div>
  );
};

export default LoaderModal;
