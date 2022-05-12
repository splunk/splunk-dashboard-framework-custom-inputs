import React, { useState, useCallback } from 'react';
import { BaseInput, withInputWrapper } from '@splunk/dashboard-inputs';
import Dropdown from '@splunk/react-ui/Dropdown';
import Button from '@splunk/react-ui/Button';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import ComboBox from '@splunk/react-ui/ComboBox';
import Switch from '@splunk/react-ui/Switch';
import Slider from '@splunk/react-ui/Slider';

const menuStyle = { padding: 20, width: 300 };

const toValue = ({ origin, destination, priceMax, tripType } = {}) => {
    if (!origin || !destination || priceMax == null || !tripType) {
        return '';
    }
    return `${origin},${destination},${tripType},${priceMax}`;
};

const parseValue = (value) => {
    if (typeof value !== 'string') {
        return {};
    }
    const values = value.split(',');

    if (values.length < 4) {
        return {};
    }

    return {
        origin: values[0].trim(),
        destination: values[1].trim(),
        tripType: values[2].trim(),
        priceMax: Number(values[3].trim()),
    };
};

const FlightWidget = ({ onValueChange, value }) => {
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

    const handleAppy = useCallback(
        (e) => {
            const val = toValue({ origin, destination, priceMax, tripType });
            setOpen(false);
            onValueChange(e, val);
        },
        [destination, onValueChange, origin, priceMax, tripType]
    );

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
                <Button inline={false} label="Apply" appearance="primary" onClick={handleAppy} />
            </div>
        </Dropdown>
    );
};

// token is "flight" or whatever value it gets in the definition
// value is comma separated string of values that we save in handleApply
FlightWidget.valueToTokens = (value, { token }) => {
    if (!token) {
        return {};
    }
    // need to parse 'origin,destination,tripType,priceMax` into 4 variables
    const { origin, destination, tripType, priceMax } = parseValue(value);

    return {
        [`${token}.origin`]: origin,
        [`${token}.destination`]: destination,
        [`${token}.tripType`]: tripType,
        [`${token}.priceMax`]: priceMax == null ? undefined : `${priceMax}`,
    };
};

FlightWidget.propTypes = {
    ...BaseInput.propTypes,
    // define our own props such as options
};

FlightWidget.defaultProps = {
    ...BaseInput.defaultProps,
};

export default withInputWrapper(FlightWidget);
