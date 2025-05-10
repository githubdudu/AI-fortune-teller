import { Button, Fieldset, TextField, SelectList } from 'gestalt';
import { DatePicker } from 'gestalt-datepicker';
import { useState, useContext, useEffect } from 'react';

import NationalityInputBox from '$/components/NationalityInputBox';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContextProvider';

function UserDetailsForm() {
  const { saveUserInfo } = useContext(AppContext);

  const GENDER_OPTIONS = [
    { label: 'Female', value: 0 },
    { label: 'Male', value: 1 },
    { label: 'Other', value: 2 },
  ];

  const [FNErrorMessage, setFNErrorMessage] = useState('');
  const [LNErrorMessage, setLNErrorMessage] = useState('');
  const [DOBErrorMessage, setDOBErrorMessage] = useState('');
  const [nationalityErrorMessage, setNationalityErrorMessage] = useState('');
  const [POBErrorMessage, setPOBErrorMessage] = useState('');

  const [FNValue, setFNValue] = useState('');
  const [LNValue, setLNValue] = useState('');
  const [DOBValue, setDOBValue] = useState('');
  const [genderValue, setGenderValue] = useState(null);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [POBValue, setPOBValue] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Clear the Context when the component mounts
    saveUserInfo(null);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!FNValue) {
      setFNErrorMessage('This field is required');
    } else {
      setFNErrorMessage('');
    }

    if (!LNValue) {
      setLNErrorMessage('This field is required');
    } else {
      setLNErrorMessage('');
    }

    if (!DOBValue) {
      setDOBErrorMessage('This field is required');
    } else {
      setDOBErrorMessage('');
    }

    if (!nationalityValue) {
      setNationalityErrorMessage('This field is required');
    } else {
      setNationalityErrorMessage('');
    }

    if (!POBValue) {
      setPOBErrorMessage('This field is required');
    } else {
      setPOBErrorMessage('');
    }

    console.log({
      FNValue,
      LNValue,
      DOBValue,
      genderID: genderValue,
      nationalityValue,
      nationalityID: nationalityValue?.value,
      POBValue,
      POBID: POBValue?.value,
    });

    // Saved in Context for later use
    saveUserInfo({
      firstName: FNValue,
      lastName: LNValue,
      dateOfBirth: DOBValue,
      genderID: genderValue,
      nationalityID: nationalityValue?.value,
      placeOfBirthID: POBValue?.value,
    });

    if (!FNValue || !LNValue || !DOBValue || !nationalityValue || !POBValue) {
      return;
    } else {
      navigate('/fortune');
    }
  }

  function handleNameChange(event) {
    const { value } = event;
    const { id } = event.event.target;
    console.log(event);

    if (id === 'firstName') {
      if (value.length > 50) {
        setFNErrorMessage('Name should not exceed 50 characters');
        return;
      } else {
        setFNErrorMessage('');
      }
      setFNValue(value);
    } else if (id === 'lastName') {
      if (value.length > 50) {
        setLNErrorMessage('Name should not exceed 50 characters');
        return;
      } else {
        setLNErrorMessage('');
      }
      setLNValue(value);
    }
  }

  function handleDateChange({ value }) {
    if (!value || !(value instanceof Date)) {
      setDOBErrorMessage('Invalid date');
      return;
    }
    //  iso 8601 format
    setDOBValue(value.toISOString());
    setDOBErrorMessage('');
  }

  function handleGenderChange({ value }) {
    setGenderValue(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-[600px] max-w-[788px] w-[calc(100vw-4.5rem)]"
    >
      <Fieldset legend="type your details" legendDisplay="hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full ">
              <FirstName />
            </div>
            <div className="w-full ">
              <LastName />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <DateOfBirth />
            </div>
            <div className="flex-1">
              <Gender />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <PlaceOfBirth />
            </div>
            <div className="flex-1">
              <Residency />
            </div>
          </div>
          <ProceedButton />
        </div>
      </Fieldset>
    </form>
  );

  function FirstName() {
    return (
      <TextField
        id="firstName"
        label="First Name"
        placeholder="Please enter your first name"
        name="firstName"
        size="lg"
        onChange={handleNameChange}
        onBlur={() => {
          setFNErrorMessage('');
        }}
        errorMessage={FNErrorMessage}
        value={FNValue}
      />
    );
  }

  function LastName() {
    return (
      <TextField
        id="lastName"
        name="lastName"
        label="Last Name"
        placeholder="Please enter your last name"
        size="lg"
        onChange={handleNameChange}
        onBlur={() => {
          setLNErrorMessage('');
        }}
        errorMessage={LNErrorMessage}
        value={LNValue}
      />
    );
  }

  /* A date picker for the date of birth */
  function DateOfBirth() {
    return (
      <DatePicker
        id="DOB"
        label="Date of Birth"
        placeholder="DD/MM/YYYY"
        onChange={handleDateChange}
        maxDate={new Date()}
        errorMessage={DOBErrorMessage}
        value={DOBValue}
      />
    );
  }

  /* A gender option box */
  function Gender() {
    return (
      <SelectList
        id="gender"
        label="Gender"
        placeholder="Please select"
        size="lg"
        onChange={handleGenderChange}
        value={genderValue}
      >
        {GENDER_OPTIONS.map(({ label, value }) => (
          <SelectList.Option key={value} value={value} label={label} />
        ))}
      </SelectList>
    );
  }

  function PlaceOfBirth() {
    return (
      <NationalityInputBox
        id="nationality"
        name="nationality"
        label="The Country You Are Born In"
        placeholder="Please type and select"
        selected={nationalityValue}
        setSelected={setNationalityValue}
        errorMessage={nationalityErrorMessage}
        setErrorMessage={setNationalityErrorMessage}
      />
    );
  }

  function Residency() {
    return (
      <NationalityInputBox
        id="residency"
        name="residency"
        label="The Country You Are Residing In"
        placeholder="Please type and select"
        selected={POBValue}
        setSelected={setPOBValue}
        errorMessage={POBErrorMessage}
        setErrorMessage={setPOBErrorMessage}
      />
    );
  }

  function ProceedButton() {
    return <Button text="Proceed" type="submit" size="lg" color="red" />;
  }
}

export default UserDetailsForm;
