class Enemy {
  constructor(name, health, attack, zeni, exp) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.zeni = zeni;
    this.exp = exp;
  }
  _takeDamage(damage) {
    this.health -= damage;
  }
}

export default Enemy;
