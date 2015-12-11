import React from 'react';
import { render } from 'react-dom'
import RaccoonApp from './components/RaccoonApp.react';
import Connector from './utils/Connector';


let connector = new Connector();

// Render RaccoonApp Controller View
render(
    <RaccoonApp />,
    document.getElementById('raccoon-app')
);
