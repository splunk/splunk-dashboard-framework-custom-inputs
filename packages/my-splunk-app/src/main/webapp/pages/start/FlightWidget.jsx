import React, { useState, useCallback, useMemo } from 'react';
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
    // tripType within our component is 'one-way' or 'round-trip', but the token
    // value we set is 'Yes' or 'No'. We need to convert that to our local state
    let tripTypeLocal = tripType;
    if (tripType === 'Yes') {
        tripTypeLocal = 'round-trip';
    } else if (tripType === 'No') {
        tripTypeLocal = 'one-way';
    }
    return `${origin},${destination},${tripTypeLocal},${priceMax}`;
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

const FlightWidget = ({ onValueChange, value, dataSources }) => {
    const parsedValue = parseValue(value);
    const [open, setOpen] = useState(false);
    const [origin, setOrigin] = useState(parsedValue.origin || '');
    const [destination, setDestination] = useState(parsedValue.destination || '');
    const [tripType, setTripType] = useState(parsedValue.tripType || '');
    const [priceMax, setPriceMax] = useState(parsedValue.priceMax || 0);

    const data = useMemo(
        () => dataSources?.primary?.data?.columns || {},
        [dataSources?.primary?.data?.columns]
    );
    const uniqueOriginOptions = useMemo(() => {
        const uniqueOrigins = [...new Set(data?.[0])];
        return uniqueOrigins.map((o) => <ComboBox.Option key={o} value={o} />);
    }, [data]);
    const uniqueDestinationOptions = useMemo(() => {
        const uniqueDestinations = [...new Set(data?.[1])];
        return uniqueDestinations.map((d) => <ComboBox.Option key={d} value={d} />);
    }, [data]);
    const maximumPrice = useMemo(() => Math.max(...(data?.[2] || [])), [data]);

    const closeReasons = Dropdown.possibleCloseReasons.filter(
        (reason) => reason !== 'contentClick'
    );
    const toggle = (
        <Button appearance="toggle" label={value || 'Select Flight Parameters'} isMenu />
    );

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
                        {uniqueOriginOptions}
                    </ComboBox>
                </ControlGroup>
                <ControlGroup label="Destination" labelPosition="top">
                    <ComboBox inline onChange={handleChangeDestination} value={destination}>
                        {uniqueDestinationOptions}
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
                        max={maximumPrice}
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
        [`${token}.tripType`]: tripType === 'round-trip' ? 'Yes' : 'No',
        [`${token}.priceMax`]: priceMax == null ? undefined : `${priceMax}`,
    };
};

FlightWidget.tokensToValue = ({ tokens, tokenNamespace, tokenName }) => {
    const origin = tokens?.[tokenNamespace]?.[`${tokenName}.origin`];
    const destination = tokens?.[tokenNamespace]?.[`${tokenName}.destination`];
    const tripType = tokens?.[tokenNamespace]?.[`${tokenName}.tripType`];
    const priceMax = tokens?.[tokenNamespace]?.[`${tokenName}.priceMax`];

    return toValue({ origin, destination, tripType, priceMax });
};

FlightWidget.propTypes = {
    ...BaseInput.propTypes,
    // define our own props such as options
};

FlightWidget.defaultProps = {
    ...BaseInput.defaultProps,
};

export default withInputWrapper(FlightWidget);
