import React, { useMemo } from 'react';
import SplunkVisualization from '@splunk/visualizations/common/SplunkVisualization';
import { ResponsiveCalendar } from '@nivo/calendar';

const CalendarViz = (props) => {
    const { width, height, dataSources } = props;
    const style = useMemo(
        () => ({
            height,
            width,
            overflow: 'auto',
        }),
        [width, height]
    );

    const data = useMemo(() => {
        const dates = dataSources?.primary?.data?.columns[0] || [];
        const prices = dataSources?.primary?.data?.columns[1] || [];

        return dates.map((date, idx) => ({ day: date, value: prices[idx] }));
    }, [dataSources?.primary?.data?.columns]);

    return (
        <div style={style}>
            <ResponsiveCalendar
                data={data}
                from="2022-01-02"
                to="2022-12-30"
                minValue="auto"
                emptyColor="#eeeeee"
                colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                monthBorderColor="#ffffff"
                dayBorderWidth={2}
                dayBorderColor="#ffffff"
                monthSpacing={10}
            />
        </div>
    );
};

CalendarViz.propTypes = {
    ...SplunkVisualization.propTypes,
};
CalendarViz.defaultProps = {
    ...SplunkVisualization.defaultProps,
};

export default CalendarViz;
