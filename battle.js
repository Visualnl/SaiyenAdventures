class Battle {
  turn = 0;
  battle = 0;
  battleID;
  battleLogMessage;
  constructor(player, enemy, logCallback) {
    this.player = player;
    this.enemy = enemy;
    this.logCallback = logCallback;
  }

  _startIdleBattle() {
    this.player.regen = 0;
    this.battle = 1;
    this.battleID = setInterval(() => {
      this._battleLoop();
    }, 1000);
  }

  _endIdleBattle() {
    this.battle = 0;
    clearInterval(this.battleID);
  }

  _battleLoop() {
    if (this.turn === 0) {
      this.enemy._takeDamage(this.player.attackDmg);
      this.battleLogMessage = `${this.player.name} attacked ${this.enemy.name} with  ${this.player.attackDmg} | ${this.enemy.name} health: ${this.enemy.health}`;
      this.logCallback(this.battleLogMessage);
      this._checkIfDie();
    } else {
      this.player._takeDamage(this.enemy.attackDmg);
      this.battleLogMessage = `${this.enemy.name} attacked ${this.player.name}  with  ${this.enemy.attackDmg} | ${this.player.name} health: ${this.player.health}`;
      this.logCallback(this.battleLogMessage);
      this._checkIfDie();
    }
    this.turn = this.turn === 0 ? 1 : 0;
  }
  _checkIfDie() {
    if (this.player.health > 0 && this.enemy.health > 0) return;
    if (this.enemy.health <= 0) {
      this.player._addExp(this.enemy.exp)._addZeni(this.enemy.zeni);
      const lootdrop = this._lootdrop(this.enemy.loot);
      this.battleLogMessage = `You defeated ${this.enemy.name} and it dropped ${lootdrop}`;
      this.player._addInventory(lootdrop);
      this.logCallback(this.battleLogMessage);
      this._endIdleBattle();
    }
    if (this.player.health <= 0) {
      this.battleLogMessage = `You Lost!`;
      this.logCallback(this.battleLogMessage);
      this._endIdleBattle();
    }
  }
  _lootdrop(loot) {
    const randomNumber = Math.floor(Math.random() * loot.length);
    return loot[randomNumber];
  }
}

export default Battle;
