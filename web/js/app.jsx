import React from 'react';
import { render } from 'react-dom'
import RaccoonApp from './components/RaccoonApp.react';


// Render RaccoonApp Controller View
render(
    <RaccoonApp />,
    document.getElementsByClassName('content')[0]
);