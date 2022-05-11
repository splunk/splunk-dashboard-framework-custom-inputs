import React from 'react';

import layout from '@splunk/react-page';
import { SplunkThemeProvider } from '@splunk/themes';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';
import DashboardCore from '@splunk/dashboard-core';
import { DashboardContextProvider } from '@splunk/dashboard-context';
import EnterprisePreset from '@splunk/dashboard-presets/EnterprisePreset';

// Dashboard Definition Files
import attemptOne from './attempt_one.json';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');

layout(
    <SplunkThemeProvider {...themeProviderSettings}>
        <DashboardContextProvider>
            <DashboardCore
                width="100%"
                height="100%"
                preset={EnterprisePreset}
                definition={attemptOne}
            />
        </DashboardContextProvider>
    </SplunkThemeProvider>
);
