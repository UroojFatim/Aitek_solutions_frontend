import React from 'react';
import PropTypes from 'prop-types';

const TabContent = ({ activeTab, tabs, className = '' }) => {
  const activeContent = tabs.find(tab => tab.value === activeTab)?.content;

  return (
    <div className={`mt-6 ${className}`}>
      {activeContent}
    </div>
  );
};

TabContent.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default TabContent; 