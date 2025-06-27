import React from 'react';
// import { Triangle } from 'react-loader-spinner'
import BarLoader from "react-spinners/BarLoader";
const Loader = () => {
  return (
    <div className="opacity-div">
      <BarLoader
        visible="true"
        // height="80"
        // width="80"
        color="#8a725d"
        aria-label="triangle-loading"
        wrapperstyle={{}}
        wrapperclass=""
      />
    </div>
  )
}

export default Loader