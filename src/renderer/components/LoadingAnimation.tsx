import React from "react";
import "./LoadingAnimation.scss";

const LoadingAnimation: React.FC<{ className?: string }> = ({ className }) => {
  return <span className={`loader ${className}`}></span>;
};

export default LoadingAnimation;
