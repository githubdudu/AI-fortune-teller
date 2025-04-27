import { Button, Fieldset, TextField, ComboBox } from 'gestalt';
import { DatePicker } from 'gestalt-datepicker';
import { useState } from 'react';
import { useSessionStorage } from 'react-use';

import NationalityInputBox from './NationalityInputBox';
import { useNavigate } from 'react-router-dom';

function UserDetailsForm() {
  const [FNErrorMessage, setFNErrorMessage] = useState('');
  const [LNErrorMessage, setLNErrorMessage] = useState('');
  const [DOBErrorMessage, setDOBErrorMessage] = useState('');
  const [nationalityErrorMessage, setNationalityErrorMessage] = useState('');
  const [POBErrorMessage, setPOBErrorMessage] = useState('');

  const [FNValue, setFNValue] = useSessionStorage('firstName', '');
  const [LNValue, setLNValue] = useSessionStorage('lastName', '');
  const [DOBValue, setDOBValue] = useSessionStorage('dateOfBirth', '');
  const [nationalityValue, setNationalityValue] = useSessionStorage(
    'nationality',
    '',
  );
  const [POBValue, setPOBValue] = useSessionStorage('placeOfBirth', '');

  const navigate = useNavigate();

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
      nationalityValue,
      POBValue,
    });

    if (!FNValue || !LNValue || !DOBValue || !nationalityValue || !POBValue) {
      return;
    } else {
      navigate('/selection');
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

  function handlePlaceOfBirthChange(event) {
    const { value } = event;
    if (value.length > 200) {
      setPOBErrorMessage('Place of Birth should not exceed 200 characters');
      return;
    }
    setPOBErrorMessage('');
    setPOBValue(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[788px] w-[calc(100vw-4.5rem)]"
    >
      <Fieldset legend="type your details" legendDisplay="hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full ">
              <TextField
                id="firstName"
                name="firstName"
                placeholder="First Name"
                size="lg"
                onChange={handleNameChange}
                onBlur={() => {
                  setFNErrorMessage('');
                }}
                errorMessage={FNErrorMessage}
                value={FNValue}
              />
            </div>
            <div className="w-full ">
              <TextField
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                size="lg"
                onChange={handleNameChange}
                onBlur={() => {
                  setLNErrorMessage('');
                }}
                errorMessage={LNErrorMessage}
                value={LNValue}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <DatePicker
                id="DOB"
                placeholder="Date of Birth"
                onChange={(event) => {
                  setDOBValue(event.value);
                  setDOBErrorMessage('');
                }}
                maxDate={new Date()}
                errorMessage={DOBErrorMessage}
                value={DOBValue}
              />
            </div>
            <div className="flex-2">
              <NationalityInputBox
                inputValue={nationalityValue}
                setInputValue={setNationalityValue}
                errorMessage={nationalityErrorMessage}
                setErrorMessage={setNationalityErrorMessage}
              />
            </div>
          </div>

          <div>
            <TextField
              id="placeOfBirth"
              name="placeOfBirth"
              placeholder="Place of Birth"
              size="lg"
              onChange={handlePlaceOfBirthChange}
              onBlur={() => {
                setPOBErrorMessage('');
              }}
              errorMessage={POBErrorMessage}
              value={POBValue}
            />
          </div>
          <Button text="Proceed" type="submit" size="lg" color="red" />
        </div>
      </Fieldset>
    </form>
  );
}

export default UserDetailsForm;
