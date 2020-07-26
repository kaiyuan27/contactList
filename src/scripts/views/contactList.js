import React, { useState } from "react";
import { Header } from "../base/header";
import { AccordianData } from "../components/accordian";
import {
  Modal,
  Input,
  ButtonGroup,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import codes from "country-calling-code";

export const ContactList = (props) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [dataObjId, addDataObjId] = useState([]);
  const [dataObj, addDataObj] = useState({
    id0: {
      name: "",
      gender: "",
      modile: "",
      savedData: false,
    },
  });
  const [viewEditId, setViewId] = useState(dataObjId.length);
  const [nameIsValid, setnameIsValid] = useState(true);
  const [genderIsValid, setgenderIsValid] = useState(true);
  const [mobileIsValid, setmobileIsValid] = useState(true);

  const handleOpen = (value) => {
    switch (value) {
      case "view":
        setIsViewModalOpen(true);
        break;

      default:
        setIsAddModalOpen(true);
        handleAddData();
    }
  };

  const handleClose = (value) => {
    switch (value) {
      case "view":
        setIsViewModalOpen(false);
        break;

      default:
        setIsAddModalOpen(false);
    }
  };

  const handleAddData = () => {
    const array = dataObjId;
    array.push(dataObjId.length + 1);
    addDataObjId(array);
    setViewId(dataObjId.length);
    addDataObj({
      ...dataObj,
      [`id${dataObjId.length}`]: {
        name: "",
        gender: "",
        modile: "",
        country: "SG",
      },
    });
  };

  const handleOnChange = (e, field) => {
    const name = e.target.name;
    const value = e.target.value;
    addDataObj({
      ...dataObj,
      [`id${dataObjId.length}`]: {
        ...dataObj[`id${dataObjId.length}`],
        [name]: value,
      },
    });

    if (name === "name") {
      setnameIsValid(true);
    }

    if (name === "mobile") {
      setmobileIsValid(true);
    }
  };

  const handleGenderClick = (value) => {
    addDataObj({
      ...dataObj,
      [`id${dataObjId.length}`]: {
        ...dataObj[`id${dataObjId.length}`],
        gender: value,
      },
    });

    setgenderIsValid(true);
  };

  const handleSave = (value) => {
    let status = false;
    if (dataObj[`id${viewEditId}`].name === "") {
      setnameIsValid(false);
      status = true;
    }

    if (dataObj[`id${viewEditId}`].gender === "") {
      setgenderIsValid(false);
      status = true;
    }

    const fullNumber = `+${getCountryCallingCode(
      dataObj[`id${viewEditId}`].country
    )}${dataObj[`id${viewEditId}`].mobile}`;
    if (
      dataObj[`id${viewEditId}`].modile === "" &&
      !isValidPhoneNumber(fullNumber)
    ) {
      setmobileIsValid(false);
      status = true;
    }

    if (status === false) {
      addDataObj({
        ...dataObj,
        [`id${viewEditId}`]: {
          ...dataObj[`id${viewEditId}`],
          savedData: true,
        },
      });
    }
    setIsAddModalOpen(status);
  };

  const modalAdd = () => {
    return (
      <Modal open={isAddModalOpen}>
        <div className="modal-container">
          <div className="modal-container-header">
            <Button onClick={handleClose}>cancel</Button>
            <Button onClick={handleSave}>done</Button>
          </div>
          <div className="modal-container-fields">
            <InputLabel error={!nameIsValid}>
              {!nameIsValid ? "Name*" : "Name"}
            </InputLabel>
            <Input
              id="name-input"
              name="name"
              error={!nameIsValid}
              onChange={handleOnChange}
              value={dataObj[`id${viewEditId}`].name}
            />
            <div className="modal-spacing-btw" />
            <InputLabel className="label" error={!genderIsValid}>
              {!genderIsValid ? "Gender*" : "Gender"}
            </InputLabel>
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                onClick={() => handleGenderClick("male")}
                disabled={dataObj[`id${viewEditId}`].gender === "male"}
              >
                Male
              </Button>
              <Button
                onClick={() => handleGenderClick("female")}
                disabled={dataObj[`id${viewEditId}`].gender === "female"}
              >
                Female
              </Button>
            </ButtonGroup>

            <div className="modal-spacing-btw" />

            <InputLabel className="label" error={!mobileIsValid}>
              {!mobileIsValid ? "Phone*" : "Phone"}
            </InputLabel>
            <div className="mobile-input">
              <div className="mobile-code-container">
                <img
                  alt="flag"
                  src={`http://catamphetamine.gitlab.io/country-flag-icons/3x2/${
                    dataObj[`id${viewEditId}`].country
                  }.svg`}
                />
                <Select
                  value={dataObj[`id${viewEditId}`].country}
                  onChange={(event) => handleOnChange(event)}
                  name="country"
                  className="country-selection"
                  renderValue={() => {
                    return `+${getCountryCallingCode(
                      dataObj[`id${viewEditId}`].country
                    )}`;
                  }}
                  error={!mobileIsValid}
                >
                  {codes.map((x, i) => (
                    <MenuItem key={i} value={x.isoCode2}>
                      {x.country} +{x.countryCodes[0]}
                    </MenuItem>
                  ))}

                </Select>
              </div>
              <div style={{ width: "20px" }} />
              <Input
                type="tel"
                id="mobile-input"
                name="mobile"
                onChange={handleOnChange}
                error={!mobileIsValid}
              />
            </div>

            <div className="modal-spacing-btw" />
            <div style={{ height: "20px" }} />
            <InputLabel>Email</InputLabel>
            <Input
              id="email-input"
              name="email"
              onChange={handleOnChange}
              value={dataObj[`id${viewEditId}`].email}
            />
          </div>
        </div>
      </Modal>
    );
  };

  const dataView = () => {
    let array = [];
    dataObjId.map((x, i) => {
      array.push(
        <AccordianData
          key={i}
          name={dataObj[`id${x}`].name}
          mobile={dataObj[`id${x}`].mobile}
          gender={dataObj[`id${x}`].gender}
          email={dataObj[`id${x}`].email}
          index={x}
        />
      );

      return array;
    });
    return array;
  };

  return (
    <div>
      <Header onClickAdd={() => handleOpen()} />
      {modalAdd()}
      {dataObjId.length > 0 &&
        dataObj[`id${dataObjId[0]}`].savedData &&
        dataView()}
      {dataObjId.length === 0 && "No Contact"}
    </div>
  );
};
