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
import { isValidPhoneNumber } from "react-phone-number-input";
import codes from "country-calling-code";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const ContactList = (props) => {
  // Declare of state
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
  const [emailIsValid, setemailIsValid] = useState(true);
  const [duplicateCheck, setDuplicateCheck] = useState(false);
  const [fromEdit, setFromEdit] = useState(false);
  const [tempDataObj, setTempObj] = useState({});

  // Open the pop up
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

  //Close the pop up
  const handleClose = () => {
    if (!fromEdit) {
      deleteData(viewEditId);
    } else if (fromEdit) {
      addDataObj({
        ...dataObj,
        [`id${viewEditId}`]: {
          ...tempDataObj,
        },
      });
    }
    setIsAddModalOpen(false);
    setFromEdit(false);
    setnameIsValid(true);
    setmobileIsValid(true);
    setgenderIsValid(true);
    setemailIsValid(true);
    setDuplicateCheck(false);
  };

  // Adding of new data
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
        countryCode: "65",
      },
    });
  };

  // Delete of data
  const deleteData = (id) => {
    // remove id count
    const index = dataObjId.indexOf(id);
    setViewId(0);
    addDataObjId([...dataObjId.slice(0, index), ...dataObjId.slice(index + 1)]);

    // remove id object
    let newstate = dataObj;
    delete newstate[`id${id}`];

    addDataObj(newstate);
  };

  // Eidting of select existing data
  const editData = (id) => {
    setTempObj(dataObj[`id${id}`]);
    setFromEdit(true);
    setViewId(id);
    setIsAddModalOpen(true);
  };

  // Text field on change handling
  const handleOnChange = (e, field) => {
    const name = e.target.name;
    const value = e.target.value;
    addDataObj({
      ...dataObj,
      [`id${viewEditId}`]: {
        ...dataObj[`id${viewEditId}`],
        [name]: value,
      },
    });

    if (name === "name") {
      setnameIsValid(true);
    }

    if (name === "mobile" || name === "country") {
      setmobileIsValid(true);
    }

    if (name === "email") {
      setemailIsValid(true);
    }

    setDuplicateCheck(false);
  };

  // Gender change of data
  const handleGenderClick = (value) => {
    addDataObj({
      ...dataObj,
      [`id${viewEditId}`]: {
        ...dataObj[`id${viewEditId}`],
        gender: value,
      },
    });

    setgenderIsValid(true);
    setDuplicateCheck(false);
  };

  // Validation Check
  const checkValidation = (value) => {
    let errorCode = 0;
    const name = dataObj[`id${viewEditId}`].name;
    const gender = dataObj[`id${viewEditId}`].gender;
    const email = dataObj[`id${viewEditId}`].email;
    const fullNumber = `+${getCountryCallingCode(
      dataObj[`id${viewEditId}`].country
    )}${dataObj[`id${viewEditId}`].mobile}`;

    if (name === "") {
      setnameIsValid(false);
      errorCode++;
    }

    if (gender === "") {
      setgenderIsValid(false);
      errorCode++;
    }

    if (
      dataObj[`id${viewEditId}`].modile === "" &&
      !isValidPhoneNumber(fullNumber)
    ) {
      setmobileIsValid(false);
      errorCode++;
    }

    if (
      email &&
      email !== "" &&
      !emailRegex.test(dataObj[`id${viewEditId}`].email)
    ) {
      setemailIsValid(false);
      errorCode++;
    }

    dataObjId.map((x) => {
      const nameX = dataObj[`id${x}`].name;
      const genderX = dataObj[`id${x}`].gender;
      const emailX = dataObj[`id${x}`].email;
      const fullNumberX = `+${getCountryCallingCode(
        dataObj[`id${x}`].country
      )}${dataObj[`id${x}`].mobile}`;

      if (
        x !== viewEditId &&
        nameX === name &&
        genderX === gender &&
        emailX === email &&
        fullNumberX === fullNumber
      ) {
        errorCode++;
        setDuplicateCheck(true);
      }
    });

    return errorCode;
  };

  // Saving data
  const handleSave = () => {
    if (checkValidation() === 0) {
      addDataObj({
        ...dataObj,
        [`id${viewEditId}`]: {
          ...dataObj[`id${viewEditId}`],
          savedData: true,
        },
      });

      setIsAddModalOpen(false);
    }
  };

  // Get country calling code
  const getCountryCallingCode = (value) => {
    const countryData = codes.find((x) => x.isoCode2 === value);
    return countryData.countryCodes[0];
  };

  // Pop up for adding details and edititng
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
                value={dataObj[`id${viewEditId}`].mobile}
              />
            </div>

            <div className="modal-spacing-btw" />
            <div style={{ height: "20px" }} />
            <InputLabel error={!emailIsValid}>
              {!emailIsValid ? "Email*" : "Email"}
            </InputLabel>
            <Input
              id="email-input"
              name="email"
              onChange={handleOnChange}
              value={dataObj[`id${viewEditId}`].email}
              error={!emailIsValid}
            />
          </div>
          {duplicateCheck && (
            <div className="duplicate-error">
              **There is a duplicate/existing contact with the same details
              entered
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // Display contact list
  const dataView = () => {
    let array = [];
    dataObjId.map((x, i) => {
      array.push(
        <AccordianData
          key={i}
          name={dataObj[`id${x}`].name}
          mobile={`+${getCountryCallingCode(dataObj[`id${x}`].country)}${
            dataObj[`id${x}`].mobile
          }`}
          gender={dataObj[`id${x}`].gender}
          email={dataObj[`id${x}`].email}
          index={x}
          onDelete={(index) => deleteData(index)}
          onEdit={(index) => editData(index)}
        />
      );
      return array;
    });

    return array;
  };

  // HTML render
  return (
    <div>
      <Header onClickAdd={() => handleOpen()} />
      {dataObjId.length > 0 && modalAdd()}
      <div className="data-section">
        {dataObjId.length > 0 &&
          dataObj[`id${dataObjId[0]}`].savedData &&
          dataView()}
      </div>

      {dataObjId.length === 0 && (
        <div className="no-contact-header"> No Contact </div>
      )}
    </div>
  );
};
