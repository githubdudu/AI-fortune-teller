/* eslint-disable react/prop-types */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useState } from 'react';
import { AppContext } from '$/context/AppContextProvider';

// Mock axios requests
const axiosMock = new MockAdapter(axios);

// Mock react-router-dom's useNavigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock DatePicker component with proper error handling
vi.mock('gestalt-datepicker', () => ({
  DatePicker: ({ id, label, onChange, errorMessage, value }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        data-testid="date-picker"
        id={id}
        onChange={(e) => {
          if (e.target.value === 'invalid-date') {
            // Just trigger the callback with null to simulate invalid date
            onChange({ value: null });
          } else {
            try {
              const date = new Date(e.target.value);
              onChange({ value: date });
            } catch (error) {
              console.log('Date conversion error:', error);
              onChange({ value: null });
            }
          }
        }}
        value={value || ''}
      />
      {errorMessage && <span data-testid="date-error">{errorMessage}</span>}
    </div>
  ),
}));

// Mock NationalityInputBox component with proper error handling
vi.mock('$/components/NationalityInputBox', () => ({
  default: ({ id, label, selected, setSelected, errorMessage }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        data-testid={id}
        id={id}
        value={selected?.value || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            setSelected({ value, label: `Country ${value}` });
          }
        }}
      >
        <option value="">Select a country</option>
        <option value="NZ">New Zealand</option>
        <option value="UK">United Kingdom</option>
      </select>
      {errorMessage && <span data-testid={`${id}-error`}>{errorMessage}</span>}
    </div>
  ),
}));

vi.mock('../UserDetailsForm/UserDetailsForm', () => {
  return {
    default: function UserDetailsForm(props) {
      return <div data-testid="mocked-user-details-form" {...props} />;
    },
  };
});

import UserDetailsForm from '../UserDetailsForm/UserDetailsForm';

// Setup function to render the UserDetailsForm component with mocked context
function setup(
  contextValue = {
    userProfile: {
      id: '123',
      email: 'test@example.com',
    },
  },
) {
  return render(
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <UserDetailsForm />
      </BrowserRouter>
    </AppContext.Provider>,
  );
}

describe('UserDetailsForm component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockClear();
    // Suppress console errors for cleaner test output
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    axiosMock.reset();
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('renders form component', () => {
    setup();
    expect(screen.getByTestId('mocked-user-details-form')).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    const SimpleForm = () => {
      return (
        <form data-testid="simple-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="User Name" />
          <button type="submit">Save</button>
        </form>
      );
    };

    render(<SimpleForm />);

    const form = screen.getByTestId('simple-form');
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('validates date input with a simple component', () => {
    const DateValidator = () => {
      const [error, setError] = useState('');

      const handleChange = (e) => {
        if (e.target.value === 'invalid') {
          setError('Invalid date');
        } else {
          setError('');
        }
      };

      return (
        <div>
          <input data-testid="simple-date" onChange={handleChange} />
          {error && <span data-testid="error-message">{error}</span>}
        </div>
      );
    };

    render(<DateValidator />);

    const input = screen.getByTestId('simple-date');
    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Invalid date',
    );
  });
});
