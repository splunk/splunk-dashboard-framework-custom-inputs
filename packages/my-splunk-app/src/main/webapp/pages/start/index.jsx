import React from 'react';

import layout from '@splunk/react-page';
import MyReactComponent from '@splunk/my-react-component';
import { SplunkThemeProvider } from '@splunk/themes';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';

import { StyledContainer, StyledGreeting } from './StartStyles';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');

layout(
    <SplunkThemeProvider {...themeProviderSettings}>
        <StyledContainer>
            <StyledGreeting>Hello, from inside MySplunkApp!</StyledGreeting>
            <div>Your component will appear below.</div>
            <MyReactComponent name="from inside MyReactComponent" />
        </StyledContainer>
    </SplunkThemeProvider>
);
