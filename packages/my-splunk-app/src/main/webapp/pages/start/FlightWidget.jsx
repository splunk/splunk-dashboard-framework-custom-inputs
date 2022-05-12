import React, { useState, useCallback } from 'react';
import { BaseInput, withInputWrapper } from '@splunk/dashboard-inputs';
import Dropdown from '@splunk/react-ui/Dropdown';
import Button from '@splunk/react-ui/Button';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import ComboBox from '@splunk/react-ui/ComboBox';
import Switch from '@splunk/react-ui/Switch';
import Slider from '@splunk/react-ui/Slider';

const menuStyle = { padding: 20, width: 300 };

const FlightWidget = () => {
    const [open, setOpen] = useState(false);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [tripType, setTripType] = useState('');
    const [priceMax, setPriceMax] = useState(0);

    const closeReasons = Dropdown.possibleCloseReasons.filter(
        (reason) => reason !== 'contentClick'
    );
    const toggle = <Button appearance="toggle" label="Select Flight Parameters" isMenu />;

    const handleChangeOrigin = useCallback((e, { value: val }) => {
        setOrigin(val);
    }, []);

    const handleChangeDestination = useCallback((e, { value: val }) => {
        setDestination(val);
    }, []);
    const handleChangeTripType = useCallback((e, { selected }) => {
        const newVal = selected ? 'one-way' : 'round-trip';
        setTripType(newVal);
    }, []);
    const handleChangePriceMax = useCallback((e, { value: val }) => {
        setPriceMax(val);
    }, []);

    const handleRequestClose = useCallback(({ reason }) => {
        if (reason !== 'contentClick') {
            setOpen(false);
        }
    }, []);

    const handleRequestOpen = useCallback(() => {
        setOpen(true);
    }, []);

    return (
        <Dropdown
            toggle={toggle}
            retainFocus
            closeReasons={closeReasons}
            open={open}
            onRequestClose={handleRequestClose}
            onRequestOpen={handleRequestOpen}
        >
            <div style={menuStyle}>
                <ControlGroup label="Origin" labelPosition="top">
                    <ComboBox inline onChange={handleChangeOrigin} value={origin}>
                        <ComboBox.Option value="Toronto" />
                        <ComboBox.Option value="San Francisco" />
                    </ComboBox>
                </ControlGroup>
                <ControlGroup label="Destination" labelPosition="top">
                    <ComboBox inline onChange={handleChangeDestination} value={destination}>
                        <ComboBox.Option value="Toronto" />
                        <ComboBox.Option value="San Francisco" />
                    </ComboBox>
                </ControlGroup>
                <ControlGroup label="Round-trip" labelPosition="top">
                    <Switch
                        selected={tripType === 'round-trip'}
                        appearance="toggle"
                        onClick={handleChangeTripType}
                    />
                </ControlGroup>
                <ControlGroup label="Price Max($USD)" labelPosition="top">
                    <Slider
                        inline
                        min={0}
                        minLabel={null}
                        displayValue={`$${priceMax}`}
                        max={1000}
                        maxLabel={`$${priceMax}`}
                        step={10}
                        onChange={handleChangePriceMax}
                        value={priceMax}
                    />
                </ControlGroup>
            </div>
        </Dropdown>
    );
};

FlightWidget.propTypes = {
    ...BaseInput.propTypes,
    // define our own props such as options
};

FlightWidget.defaultProps = {
    ...BaseInput.defaultProps,
};

export default withInputWrapper(FlightWidget);
