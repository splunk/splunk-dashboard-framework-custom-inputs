import React from 'react';

import layout from '@splunk/react-page';
import { SplunkThemeProvider } from '@splunk/themes';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';
import DashboardCore from '@splunk/dashboard-core';
import { DashboardContextProvider } from '@splunk/dashboard-context';
import EnterprisePreset from '@splunk/dashboard-presets/EnterprisePreset';

import { FlightWidget } from './FlightWidget';

// Dashboard Definition Files
import attemptOne from './attempt_one.json';
import attemptTwo from './attempt_two.json';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');

const preset = {
    ...EnterprisePreset,
    inputs: {
        ...EnterprisePreset.inputs,
        'input.flightwidget': FlightWidget,
    },
};

layout(
    <SplunkThemeProvider {...themeProviderSettings}>
        <DashboardContextProvider>
            <DashboardCore width="100%" height="100%" preset={preset} definition={attemptTwo} />
        </DashboardContextProvider>
    </SplunkThemeProvider>
);
