class Battle {
  turn = 0;
  battleID = null;
  constructor(player, enemy) {
    this.player = player;
  }

  _startIdleBattle() {
    this.battleID = setInterval(() => {
      this._battleLoop();
    }, 1000);
  }

  _endIdleBattle() {
    clearInterval(this.battleID);
  }

  _battleLoop() {
    this._playerAttack();
    this.enemy._takeDamage(this.player.attack);
    console.log(
      `${this.player.name} has attacked with ${this.player.attack} damage | enemy health : ${this.enemy.health}`
    );
    // this.turn = this.turn === 0 ? 1 : 0;
  }
  _playerAttack() {}
}

export default Battle;
