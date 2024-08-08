import React from 'react';

import HealthInfo from "../components/HealthInfo";

const HealthInfoScreen = ({ route }) => {
    const { userData } = route.params || {};
    console.log("HomeScreen userData:", userData);
    return (
        <HealthInfo route={route} />
    );
};

export default HealthInfoScreen;