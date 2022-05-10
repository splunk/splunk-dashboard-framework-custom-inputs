import React from 'react';
import { render } from 'react-dom';

import { SplunkThemeProvider } from '@splunk/themes';
import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';

import MyReactComponent from '../src/MyReactComponent';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');

const containerEl = document.getElementById('main-component-container');
render(
    <SplunkThemeProvider {...themeProviderSettings}>
        <MyReactComponent name="World" />
    </SplunkThemeProvider>,
    containerEl
);
