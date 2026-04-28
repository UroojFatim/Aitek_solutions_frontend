import React from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex space-x-8 border-b border-light-border dark:border-dark-border">
        {tabs.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`
              py-4 px-2 relative
              ${activeTab === value 
                ? 'text-primary font-medium' 
                : 'text-light-text dark:text-dark-text hover:text-primary/70'}
            `}
          >
            {label}
            {activeTab === value && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Tabs; 