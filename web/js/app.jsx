import React from 'react';
import { render } from 'react-dom'

import WebSocketConnection from './utils/WebSocketConnection';
import RaccoonApp from './components/RaccoonApp.react';

let wsConnection = new WebSocketConnection();

// Render RaccoonApp Controller View
render(
    <RaccoonApp />,
    document.getElementById('raccoon-app')
);
