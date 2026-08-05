import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'gestalt';

/**
 * Error message component for displaying API and application errors
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {string} props.type - Error type ('warning', 'error', 'info')
 * @param {boolean} props.withIcon - Whether to show an icon
 */
const ErrorMessage = ({ message, type = 'error', withIcon = true }) => {
  if (!message) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'warning':
        return { icon: '⚠️', color: 'orange' };
      case 'info':
        return { icon: 'ℹ️', color: 'blue' };
      case 'error':
      default:
        return { icon: '❌', color: 'red' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Box
      marginTop={2}
      marginBottom={2}
      padding={2}
      rounding={2}
      color={
        color === 'red'
          ? 'errorBase'
          : color === 'orange'
            ? 'warningBase'
            : 'infoBase'
      }
    >
      <Box display="flex" alignItems="center" gap={2}>
        {withIcon && (
          <Text color="inverse" size="md">
            {icon}
          </Text>
        )}
        <Text color="inverse" size="md" weight="bold">
          {message}
        </Text>
      </Box>
    </Box>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'error', 'info']),
  withIcon: PropTypes.bool,
};

export default ErrorMessage;
