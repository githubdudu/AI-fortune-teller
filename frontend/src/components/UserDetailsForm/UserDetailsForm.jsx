import { Button, Fieldset, TextField, SelectList } from 'gestalt';
import { DatePicker } from 'gestalt-datepicker';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import NationalityInputBox from '$/components/NationalityInputBox';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContextProvider';
import { API_CONFIG } from '../../constants/config';
import { COUNTRY_LIST } from '../../constants/nationality';

function UserDetailsForm() {
  const { userProfile } = useContext(AppContext);

  /**
   * options {label: string, value: string}[]
   * @type {Array<{label: string, value: string}>}
   * https://gestalt.pinterest.systems/web/selectlist#SelectList.OptionProps
   */
  const GENDER_OPTIONS = [
    { label: 'Female', value: '0' },
    { label: 'Male', value: '1' },
    { label: 'Other', value: '-1' },
  ];

  const [FNErrorMessage, setFNErrorMessage] = useState('');
  const [DOBErrorMessage, setDOBErrorMessage] = useState('');
  const [nationalityErrorMessage, setNationalityErrorMessage] = useState('');
  const [POBErrorMessage, setPOBErrorMessage] = useState('');

  const [FNValue, setFNValue] = useState('');
  const [DOBValue, setDOBValue] = useState('');
  const [genderValue, setGenderValue] = useState(null);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [POBValue, setPOBValue] = useState(null);
  const [requestErrorMessage, setRequestErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setFNValue(userProfile?.displayName ?? '');
    setDOBValue(userProfile?.dateOfBirth ?? '');
    setGenderValue(userProfile?.gender?.toString() ?? null);
    setNationalityValue(
      COUNTRY_LIST.find(
        ({ label }) => label === userProfile?.residenceCountry,
      ) || null,
    );
    setPOBValue(
      COUNTRY_LIST.find(({ label }) => label === userProfile?.bornCountry) ||
        null,
    );
  }, [userProfile]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!FNValue) {
      setFNErrorMessage('This field is required');
    } else {
      setFNErrorMessage('');
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

    const requestBody = {
      email: userProfile?.email,
      displayName: FNValue,
      dateOfBirth: DOBValue,
      gender: genderValue,
      residenceCountry: nationalityValue.label,
      bornCountry: POBValue.label,
    };
    console.log({ requestBody });

    if (!FNValue || !DOBValue || !nationalityValue || !POBValue) {
      return;
    }

    try {
      await putUserRequest(requestBody);
      navigate('/');
    } catch (error) {
      console.error('Error putting user request:', error);
      setRequestErrorMessage(
        'An error occurred while updating your profile. Please try again later.',
      );
      return;
    }
  }

  async function putUserRequest(requestBody) {
    const USER_PUT_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}${
      userProfile?.id ? `/${userProfile.id}` : ''
    }`;
    const response = await axios.put(USER_PUT_URL, {
      ...requestBody,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: true,
    });
    if (response.status !== 200 && response.status !== 204) {
      throw new Error('Error calling the "put user" endpoint');
    }
  }

  function handleNameChange(event) {
    const { value } = event;
    console.log(event);

    if (value.length > 50) {
      setFNErrorMessage('Name should not exceed 50 characters');
      return;
    } else {
      setFNErrorMessage('');
    }
    setFNValue(value);
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

  ErrorMessage.propTypes = {
    message: PropTypes.string,
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset legend="type your details" legendDisplay="hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">{UserName()}</div>
            <div className="flex-1">{Gender()}</div>
            <div className="flex-1">{DateOfBirth()}</div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <PlaceOfBirth />
            </div>
            <div className="flex-1">
              <Residency />
            </div>
          </div>
          <ErrorMessage message={requestErrorMessage} />
          {ProceedButton()}
        </div>
      </Fieldset>
    </form>
  );

  function UserName() {
    return (
      <TextField
        id="UserName"
        label="User Name"
        placeholder="Please enter your user name"
        name="username"
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

  function ErrorMessage({ message }) {
    return (
      <div className="flex flex-col gap-4">
        {message && (
          <div className="text-red-500 text-sm text-center">{message}</div>
        )}
      </div>
    );
  }

  function ProceedButton() {
    return (
      <Button
        text="Save and Continue"
        type="submit"
        name="edit-button"
        size="lg"
        color="red"
      />
    );
  }
}

export default UserDetailsForm;
