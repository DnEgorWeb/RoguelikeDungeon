import React, { Component } from 'react';
import Cell from './Cell';
import map from '../data/map';

class GameField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dungeon: this.props.dungeon,
            light: this.props.light
        };

        this._dungeonRender = this._dungeonRender.bind(this);
        this._renderItems = this._renderItems.bind(this);
        this._randomInteger = this._randomInteger.bind(this);
        this._moveCharacter = this._moveCharacter.bind(this);
        this._blackOut = this._blackOut.bind(this);
    }

    render() {
        const arr = [];

        for (let i=0; i<4000; i++) {
            arr.push(i);
        }

        return (
            <div className="roguelike-field">
                {arr.map((item, i) => <Cell key={item} id={i} />)}
            </div>
        );
    }

    componentDidMount() {
        if (!this.isRendered) {
            this.isRendered = true;
            
            window.addEventListener('keydown', (event) => this._moveCharacter(event.keyCode));

            this._dungeonRender();
            this._renderItems();
            this._blackOut();
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.dungeon !== this.state.dungeon) {
            const cells = document.querySelectorAll('.roguelike-field>div');
            cells.forEach(item => item.className = 'rogue-cell');
            
            this.setState({
                dungeon: nextProps.dungeon
            }, () => {
                this._dungeonRender();
                this._renderItems();
                this._blackOut();

                if (this.state.light) {
                    const cells = document.querySelectorAll('.roguelike-field>div');
                    cells.forEach(item => item.classList.remove('rogue-cell__dark'));
                } else {
                    this._blackOut();
                }
            });
        }
        if (nextProps.light !== this.state.light) {
            this.setState({
                light: !this.state.light
            });

            if (nextProps.light) {
                const cells = document.querySelectorAll('.roguelike-field>div');
                cells.forEach(item => item.classList.remove('rogue-cell__dark'));
            } else {
                this._blackOut();
            }
        }
    }

    _dungeonRender() {
        const cells = document.querySelectorAll('.roguelike-field>div');
        map(this.state.dungeon).forEach(item => {
            for (let j=item.y*100; j<item.h*100; j=j+100) {
                for (let i=item.x; i<item.w; i++) {
                    cells[i + j].className = 'rogue-cell__floor'
                }
            }
        })
    }

    _renderItems() {
        const self = this;
        const cells = document.querySelectorAll('.rogue-cell__floor');

        const enemies = [];

        if (self.state.dungeon === 4) {
            let randomCell = this._randomInteger(0, cells.length);
            cells[randomCell].className = 'rogue-cell__boss';
            let randomCell2 = this._randomInteger(0, cells.length);
            cells[randomCell2].className = 'rogue-cell__hero';
        } else {
            for (let i=0; i<=16; i++) {
                if (i === 7) {
                    let randomCell = this._randomInteger(0, cells.length);
                    cells[randomCell].className = 'rogue-cell__hero';
                } else if (i>7 && i<11) {
                    let randomCell = this._randomInteger(0, cells.length);
                    cells[randomCell].className = 'rogue-cell__weapon';
                } else if (i===12) {
                    let randomCell = this._randomInteger(0, cells.length);
                    cells[randomCell].className = 'rogue-cell__teleport';
                } else if (i>12) {
                    let randomCell = this._randomInteger(0, cells.length);
                    cells[randomCell].className = 'rogue-cell__heal';
                } else {
                    let index = this._randomInteger(0, cells.length);
                    enemies.push(index);
                }
            }

            enemies.forEach((item, i) => {
                cells[item].className = 'rogue-cell__enemy';
            });
        }
    }

    _randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    _moveCharacter(code) {
        const self = this;
        const character = document.querySelector('.rogue-cell__hero');

        const cells = document.querySelectorAll('.roguelike-field>div');
        let pos;
        cells.forEach((item, i) => {
           if (item.className === 'rogue-cell__hero') {
               pos = i;
           }
        });
        
        switch (code) {
            case 38:
                if (pos<100) return;
                const top = cells[pos-100];
                move(top, pos);
                if (!self.state.light) {
                    self._blackOut();
                }
                checkWeapon(top, pos);
                checkHeal(top, pos);
                checkEnemy(top, pos);
                checkTeleport(top, pos);
                checkBoss(top, pos);

                break;

            case 40:
                if (pos>3900) return;
                const bottom = cells[pos+100];
                move(bottom, pos);
                if (!self.state.light) {
                    self._blackOut();
                }
                checkWeapon(bottom, pos);
                checkHeal(bottom, pos);
                checkEnemy(bottom, pos);
                checkTeleport(bottom, pos);
                checkBoss(bottom, pos);

                break;

            case 37:
                if (pos%100===0) return;
                const left = cells[pos-1];
                move(left, pos);
                if (!self.state.light) {
                    self._blackOut();
                }
                checkWeapon(left, pos);
                checkHeal(left, pos);
                checkEnemy(left, pos);
                checkTeleport(left, pos);
                checkBoss(left, pos);

                break;

            case 39:
                if (pos%100===99) return;
                const right = cells[pos+1];
                move(right, pos);
                if (!self.state.light) {
                    self._blackOut();
                }
                checkWeapon(right, pos);
                checkHeal(right, pos);
                checkEnemy(right, pos);
                checkTeleport(right, pos);
                checkBoss(right, pos);

                break;
        }

        function move(direction, pos) {
            if (direction.classList.contains('rogue-cell__floor')) {
                direction.classList.add('rogue-cell__hero');
                direction.classList.remove('rogue-cell__floor');
                cells[pos].classList.add('rogue-cell__floor');
                cells[pos].classList.remove('rogue-cell__hero');
            }
        }

        function checkWeapon(direction, pos) {
            if (direction.className === 'rogue-cell__weapon') {
                direction.className = 'rogue-cell__hero';
                cells[pos].className = 'rogue-cell__floor';
                self.props.weaponPicked();
            }
        }

        function checkHeal(direction, pos) {
            if (direction.className === 'rogue-cell__heal') {
                direction.className = 'rogue-cell__hero';
                cells[pos].className = 'rogue-cell__floor';
                self.props.healPicked();
            }
        }

        function checkEnemy(direction, pos) {
            if (direction.className === 'rogue-cell__enemy') {

                if (!self['enemy' + direction.id]) {
                    (self.state.dungeon>1) ?
                        self['enemy' + direction.id] = 35 * self.state.dungeon
                        :
                        self['enemy' + direction.id] = 30;
                }

                self['enemy' + direction.id] = self.props.metEnemy(self['enemy' + direction.id]);

                if (self['enemy' + direction.id]<=0) {
                    direction.className = 'rogue-cell__hero';
                    cells[pos].className = 'rogue-cell__floor';
                    self.props.getXP(20);
                } else {
                    (self.state.dungeon>1) ?
                        self.props.enemyAttacks(25*self.state.dungeon)
                        :
                        self.props.enemyAttacks(25);
                }
            }
        }

        function checkTeleport(direction, pos) {
            if (direction.className === 'rogue-cell__teleport') {
                self.props.teleportPicked();
            }
        }

        function checkBoss(direction, pos) {
            if (direction.className === 'rogue-cell__boss') {

                if (!self['enemy' + direction.id]) {
                    self['enemy' + direction.id] = 400;
                }

                self['enemy' + direction.id] = self.props.metEnemy(self['enemy' + direction.id]);

                if (self['enemy' + direction.id]<=0) {
                    direction.className = 'rogue-cell__hero';
                    cells[pos].className = 'rogue-cell__floor';

                    const div = document.createElement('div');
                    div.className = 'rogue-gameWin';
                    document.getElementById('root').style.opacity = 0.1;
                    document.body.appendChild(div);

                    setTimeout(() => location.reload(), 2000);
                } else {
                    self.props.enemyAttacks(90);
                }
            }
        }
    }

    _blackOut() {
        const cells = document.querySelectorAll('.roguelike-field>div');
        cells.forEach(item => item.classList.add('rogue-cell__dark'));

        const hero = document.getElementsByClassName('rogue-cell__hero')[0];
        hero.classList.toggle('rogue-cell__dark');

        for (let i=1; i<5; i++) {
            if (cells[hero.id-i]) cells[hero.id-i].classList.toggle('rogue-cell__dark');
            if (cells[Number(hero.id)+i]) cells[Number(hero.id)+i].classList.toggle('rogue-cell__dark');
        }
        for (let i=1; i<4; i++) {
            if (cells[hero.id - 100 - i]) cells[hero.id - 100 - i].classList.toggle('rogue-cell__dark');

            if (cells[hero.id - 100 + i]) cells[hero.id - 100 + i].classList.toggle('rogue-cell__dark');

            if (cells[Number(hero.id) + 100 + i]) cells[Number(hero.id) + 100 + i].classList.toggle('rogue-cell__dark');
            if (cells[Number(hero.id) + 100 - i]) cells[Number(hero.id) + 100 - i].classList.toggle('rogue-cell__dark');
        }
        if (cells[hero.id - 100]) cells[hero.id - 100].classList.toggle('rogue-cell__dark');
        if (cells[Number(hero.id) + 100]) cells[Number(hero.id) + 100].classList.toggle('rogue-cell__dark');
        for (let i=1; i<3; i++) {
            if (cells[hero.id - 200 - i]) cells[hero.id - 200 - i].classList.toggle('rogue-cell__dark');
            if (cells[hero.id - 200 + i]) cells[hero.id - 200 + i].classList.toggle('rogue-cell__dark');
            if (cells[Number(hero.id) + 200 + i]) cells[Number(hero.id) + 200 + i].classList.toggle('rogue-cell__dark');
            if (cells[Number(hero.id) + 200 - i]) cells[Number(hero.id) + 200 - i].classList.toggle('rogue-cell__dark');
        }
        if (cells[hero.id - 200]) cells[hero.id - 200].classList.toggle('rogue-cell__dark');
        if (cells[Number(hero.id) + 200]) cells[Number(hero.id) + 200].classList.toggle('rogue-cell__dark');
        for (let i=1; i<2; i++) {
            if (cells[hero.id - 300 - i]) cells[hero.id - 300 - i].classList.toggle('rogue-cell__dark');
            if (cells[hero.id - 300 + i]) cells[hero.id - 300 + i].classList.toggle('rogue-cell__dark');
            if (cells[Number(hero.id) + 300 + i]) cells[Number(hero.id) + 300 + i].classList.toggle('rogue-cell__dark');
            if (cells[Number(hero.id) + 300 - i]) cells[Number(hero.id) + 300 - i].classList.toggle('rogue-cell__dark');
        }
        if (cells[hero.id - 300]) cells[hero.id - 300].classList.toggle('rogue-cell__dark');
        if (cells[Number(hero.id) + 300]) cells[Number(hero.id) + 300].classList.toggle('rogue-cell__dark');
        if (cells[hero.id - 400]) cells[hero.id - 400].classList.toggle('rogue-cell__dark');
        if (cells[Number(hero.id) + 400]) cells[Number(hero.id) + 400].classList.toggle('rogue-cell__dark');
    }
}

export default GameField;