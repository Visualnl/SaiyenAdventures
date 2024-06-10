class Enemy {
  constructor(name, health, attackDmg, zeni, exp, loot) {
    this.name = name;
    this.health = health;
    this.attackDmg = attackDmg;
    this.zeni = zeni;
    this.exp = exp;
    this.loot = loot;
  }
  _takeDamage(damage) {
    this.health -= damage;
    return this;
  }
}

export default Enemy;
