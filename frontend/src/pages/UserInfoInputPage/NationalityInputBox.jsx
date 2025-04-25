import { useState } from 'react';
import { ComboBox } from 'gestalt';
import PropTypes from 'prop-types';

import { COUNTRY_OPTIONS } from '../../constants/nationality';

function NationalityInputBox({ inputValue, setInputValue }) {
  const [selected, setSelected] = useState();
  const [suggestedOptions, setSuggestedOptions] = useState(COUNTRY_OPTIONS);

  const handleOnChange = ({ value }) => {
    setSelected();
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
      }}
      onChange={handleOnChange}
      onClear={() => {
        setInputValue('');
        setSelected();
        setSuggestedOptions(COUNTRY_OPTIONS);
      }}
      onSelect={handleSelect}
      options={suggestedOptions}
      placeholder="Nationality"
      selectedOption={selected}
      size="lg"
    />
  );
}

NationalityInputBox.propTypes = {
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
};

export default NationalityInputBox;
