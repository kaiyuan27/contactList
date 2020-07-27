import React from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EmailIcon from "@material-ui/icons/Email";

export const AccordianData = (props) => {
  const { name, mobile, gender, email, onEdit, onDelete, index } = props;
  return (
    <Accordion className="accordian-container">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className="circle-icon">
          {name && name !== "" ? name.charAt(0) : ""}
        </div>
        <div className="accordianData-header-value-container">
          <label className="accordianData-header-value">{name}</label>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="accordian-desc-value-container">
          <div className="accordian-desc-value">
            <div id="openAccordianData-value">
              <a href={`tel:${mobile}`}>{mobile}</a>
            </div>
            <div id="openAccordianData-desc">Mobile</div>
          </div>
          <a href={`tel:${mobile}`}>
            <PhoneIcon />
          </a>
        </div>
        <div className="accordian-desc-value-container">
          <div className="accordian-desc-value">
            <div id="openAccordianData-value">{gender}</div>
            <div id="openAccordianData-desc">Gender</div>
          </div>
          <PersonIcon />
        </div>
        {email && email !== "" && (
          <div className="accordian-desc-value-container">
            <div className="accordian-desc-value">
              <div id="openAccordianData-value">
                <a href={`mailto:${email}`}>{email}</a>
              </div>
              <div id="openAccordianData-desc">Email</div>
            </div>
            <a href={`mailto:${email}`}>
              <EmailIcon />
            </a>
          </div>
        )}
        <div className="button-container">
          <Button
            className="button"
            startIcon={<DeleteIcon />}
            onClick={() => props.onDelete(index)}
          >
            Delete
          </Button>
          <Button
            className="button"
            startIcon={<EditIcon />}
            onClick={() => onEdit(index)}
          >
            Edit
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
