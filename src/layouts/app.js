import React from 'react';
import { Link } from 'react-router';

require('normalize.scss/normalize.scss');
require('assets/styles/layout.scss');

export default ({children}) => {
  return (
  	<div>
      
      <div>
        {children}
      </div>
    </div>
  )
}
