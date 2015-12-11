import React from 'react';
import { render } from 'react-dom'

import Connector from './utils/Connector';
import RaccoonApp from './components/RaccoonApp.react';

let connector = new Connector();

// Render RaccoonApp Controller View
render(
    <RaccoonApp />,
    document.getElementById('raccoon-app')
);
