import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header';
import Status from './components/Status';
import ToggleLight from './components/ToggleLight';
import GameField from './components/GameField';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attack: 7,
            weapon: 'stick',
            health: 100,
            xpToNextLevel: 60,
            nextLevelXP: 90,
            dungeon: 1,
            level: 0,
            light: false
        };

        this.increaseAttack = this.increaseAttack.bind(this);
        this.increaseHealth = this.increaseHealth.bind(this);
        this.fight = this.fight.bind(this);
        this.decreaseHealth = this.decreaseHealth.bind(this);
        this.decreaseXpCount = this.decreaseXpCount.bind(this);
        this.changeDungeon = this.changeDungeon.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.switchLight = this.switchLight.bind(this);
    }

    render() {
        return (
            <div>
                <Header/>
                <Status attack={this.state.attack}
                        weapon={this.state.weapon}
                        health={this.state.health}
                        xp={this.state.xpToNextLevel}
                        dungeon={this.state.dungeon}
                        level={this.state.level} />
                <ToggleLight onLightClicked={this.switchLight}/>
                <GameField dungeon={this.state.dungeon}
                           weaponPicked={this.increaseAttack}
                           healPicked={this.increaseHealth}
                           metEnemy={this.fight}
                           enemyAttacks={this.decreaseHealth}
                           getXP={this.decreaseXpCount}
                           teleportPicked={this.changeDungeon}
                           light={this.state.light}/>
            </div>
        );
    }

    increaseAttack() {
        let newWeapon;
        const currentAttack = this.state.attack;

        if (currentAttack <= 7) {
            newWeapon = 'knife';
        } else if (currentAttack <= 20) {
            newWeapon = 'sword';
        } else if (currentAttack <= 60) {
            newWeapon = 'axe';
        } else if (currentAttack <= 120) {
            newWeapon = 'hammer';
        } else if (currentAttack <= 200) {
            newWeapon = 'gun';
        } else {
            newWeapon = 'machinegun';
        }

        this.setState({
            attack: this.state.attack+10,
            weapon: [newWeapon]
        })
    }

    increaseHealth() {
        this.setState({
            health: this.state.health + (20*this.state.dungeon)
        })
    }

    fight(enemyHealth) {
        if (enemyHealth > this.state.attack) {
            return enemyHealth - this.state.attack;
        } else {
            return 0;
        }
    }

    decreaseHealth(value) {
        let newHealth = this.state.health - value;

        if (newHealth < 0 ) {
            this.gameOver();
        } else {
            this.setState({
                health: newHealth
            });
        }
    }

    decreaseXpCount(value) {
        const self = this;

        this.setState({
            xpToNextLevel: [this.state.xpToNextLevel - value]
        }, () => checkXP());

        function checkXP() {
            if (self.state.xpToNextLevel <= 0) {
                self.setState({
                    xpToNextLevel: self.state.nextLevelXP,
                    nextLevelXP: self.state.nextLevelXP*2,
                    attack: self.state.attack + 10,
                    level: self.state.level + 1
                });
            }
        }
    }

    changeDungeon(value) {
        this.setState({
            dungeon: this.state.dungeon + 1
        })
    }

    gameOver() {
        const div = document.createElement('div');
        div.className = 'rogue-gameOver';
        document.getElementById('root').style.opacity = 0.1;
        document.body.appendChild(div);

        setTimeout(() => location.reload(), 2000);
    }

    switchLight() {
        this.setState({
            light: !this.state.light
        });
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));