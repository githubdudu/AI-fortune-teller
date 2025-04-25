import { useState } from 'react';
import { ComboBox } from 'gestalt';

import { COUNTRY_OPTIONS } from '../../constants/nationality';
function NationalityInputBox() {
  const [errorMessage, setErrorMessage] = useState();

  const handleBlur = (event) => {
    const value = event?.value;
    if (
      value !== '' &&
      !COUNTRY_OPTIONS.some((option) => option.value === value)
    ) {
      setErrorMessage('Invalid country selected');
    }
  };

  const resetErrorMessage = () => {
    if (errorMessage) {
      setErrorMessage();
    }
  };

  return (
    <ComboBox
      id="nationality"
      noResultText="No results"
      onBlur={handleBlur}
      onChange={resetErrorMessage}
      onClear={resetErrorMessage}
      options={COUNTRY_OPTIONS}
      placeholder="Nationality"
      size="lg"
    />
  );
}

export default NationalityInputBox;
