import React, { Component } from 'react';

function ToggleLight(props) {
    return (
        <button className="toggle-light" onClick={props.onLightClicked}>
            Toggle light
        </button>
    );
}

export default ToggleLight;