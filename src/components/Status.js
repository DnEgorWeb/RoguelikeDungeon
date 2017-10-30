import React, { Component } from 'react';

function Status(props) {
    return (
        <div className="status-bar">
            <div>Health: {props.health}</div>
            <div>Weapon: {props.weapon}</div>
            <div>Attack: {props.attack}</div>
            <div>Level: {props.level}</div>
            <div>Next Level: {props.xp} XP</div>
            <div>Dungeon: {props.dungeon}</div>
        </div>
    );
}

export default Status;