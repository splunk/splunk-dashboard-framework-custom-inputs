import React from 'react';

import layout from '@splunk/react-page';
import { SplunkThemeProvider } from '@splunk/themes';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';
import { DashboardCore } from '@splunk/dashboard-core';
import { DashboardContextProvider } from '@splunk/dashboard-context';
import EnterprisePreset from '@splunk/dashboard-presets/EnterprisePreset';

import FlightWidget from './FlightWidget';
import CalendarViz from './CalendarViz';

// Dashboard Definition Files
import attemptOne from './attempt_one.json';
import attemptTwo from './attempt_two.json';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');

const preset = {
    ...EnterprisePreset,
    visualizations: {
        ...EnterprisePreset.visualizations,
        'splunk.calendar': CalendarViz,
    },
    inputs: {
        ...EnterprisePreset.inputs,
        'input.flightwidget': FlightWidget,
    },
};

layout(
    <SplunkThemeProvider {...themeProviderSettings}>
        <DashboardContextProvider preset={preset} initialDefinition={attemptTwo}>
            <DashboardCore width="100%" height="100%" />
        </DashboardContextProvider>
    </SplunkThemeProvider>
);
