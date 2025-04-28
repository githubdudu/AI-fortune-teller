import { useState } from 'react';
import { ComboBox } from 'gestalt';
import PropTypes from 'prop-types';

import { COUNTRY_LIST } from '../../constants/nationality';

const COUNTRY_OPTIONS = COUNTRY_LIST.map((item) => ({
  value: item.id,
  label: item.label,
}));

function NationalityInputBox({
  selected,
  setSelected,
  errorMessage = '',
  setErrorMessage = () => {},
}) {
  const [inputValue, setInputValue] = useState();
  const [suggestedOptions, setSuggestedOptions] = useState(COUNTRY_OPTIONS);

  const handleOnChange = ({ value }) => {
    setSelected();
    setErrorMessage();
    if (value) {
      setInputValue(value);
      const filteredOptions = COUNTRY_OPTIONS.filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestedOptions(filteredOptions);
    } else {
      setInputValue(value);
      setSuggestedOptions(COUNTRY_OPTIONS);
    }
  };

  const handleSelect = ({ item }) => {
    setErrorMessage();
    setInputValue(item.label);
    setSuggestedOptions(COUNTRY_OPTIONS);
    setSelected(item);
  };

  return (
    <ComboBox
      accessibilityClearButtonLabel="Clear the current value"
      id="nationality"
      inputValue={inputValue}
      noResultText="No results"
      onBlur={() => {
        if (!selected) setInputValue('');
        setSuggestedOptions(COUNTRY_OPTIONS);
        setErrorMessage();
      }}
      onChange={handleOnChange}
      onClear={() => {
        setInputValue('');
        setSelected();
        setErrorMessage();
        setSuggestedOptions(COUNTRY_OPTIONS);
      }}
      onSelect={handleSelect}
      options={suggestedOptions}
      label="The Country You Are Born In"
      placeholder="Please type and select"
      selectedOption={selected}
      errorMessage={errorMessage}
      size="lg"
    />
  );
}

NationalityInputBox.propTypes = {
  selected: PropTypes.shape({
    value: PropTypes.number,
    label: PropTypes.string,
  }).isRequired,
  setSelected: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
};

export default NationalityInputBox;
