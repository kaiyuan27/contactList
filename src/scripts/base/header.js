import React from "react";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

export const Header = (props) => {
  const clickAdd = () => {
    props.onClickAdd()
  }
  return (
    <div className="header-container">
      <div className="header-title"> Contact </div>
      <IconButton className="header-plus" size="medium" onClick={() => clickAdd()}>
        <AddIcon />
      </IconButton>
    </div>
  );
};
