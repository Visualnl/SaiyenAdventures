"use strict";
import PlayerObject from "./playerobject.js";
import Enemy from "./enemy.js";
import Battle from "./battle.js";
import { enemiesList } from "./enemieslist.js";

const buttonAddExp = document.querySelector(".button-addExp");
const statsDisplay = document.querySelector(".statsDisplay");
const allItemsElement = document.querySelector(".allitems");
const namedisplayElement = document.querySelector(".nameDisplay");
const buttonStartBattle = document.querySelector(".button-startBattle");
const buttonEndBattle = document.querySelector(".button-stopBattle");
const selectEnemyELement = document.querySelector(".selectEnemies");
const selectedEnemyElement = document.getElementById("enemies");

class App {
  constructor() {
    this._loadLocalStorage();
    buttonStartBattle.addEventListener(
      "click",
      this._handleStartBattle.bind(this)
    );
    buttonEndBattle.addEventListener("click", this._handleEndBattle.bind(this));
    this._renderEnemiesList();
  }

  _renderStatsDisplay() {
    statsDisplay.textContent = `level:${this.player._getLevel(
      this.player.exp
    )} Zeni: ${this.player.zeni}`;
  }

  _renderAllItems() {
    let html = "";
    items.forEach((i) => {
      html += `
     <span class="test">${i.name}
     `;
    });
    allItemsElement.insertAdjacentHTML("afterend", html);
  }
  _renderNameDisplay() {
    namedisplayElement.innerHTML = `${this.player.name} <span class="editName text-xs text-black-500 cursor-pointer underline ml-2">change</span>`;
    const editNameElement = document.querySelector(".editName");
    editNameElement.addEventListener("click", this._handleEditName.bind(this));
  }

  _handleEditName() {
    const overlayElement = document.getElementById("overlay");
    overlayElement.classList.remove("hidden");
    const inputNewName = document.getElementById("newNameInput");
    inputNewName.placeholder = this.player.name;

    const buttonSaveNewName = document.getElementById("changeNameBtn");
    buttonSaveNewName.addEventListener("click", () => {
      const newName = inputNewName.value;
      this.player._setName(newName);
      this._renderNameDisplay();
      this._setLocalStorage();
      overlayElement.classList.add("hidden");
    });
    console.log(this.player);
  }

  _renderEnemiesList() {
    enemiesList.forEach((enemy) =>
      selectEnemyELement.insertAdjacentHTML(
        "beforeend",
        `<option value="${enemy.name}">${enemy.name}</option>`
      )
    );
  }
  _handleStartBattle() {
    const selectedEnemy = selectedEnemyElement.value;
    const enemy = enemiesList.find(({ name }) => name === selectedEnemy);
    console.log(enemy);

    this.enemy = new Enemy(
      enemy.name,
      enemy.health,
      enemy.attackDmg,
      enemy.zeni,
      enemy.exp
    );
    this.battle = new Battle(
      this.player,
      this.enemy,
      this._renderBattleLogDisplay.bind(this)
    );
    this.battle._startIdleBattle();
    buttonStartBattle.classList.add("hidden");
    buttonEndBattle.classList.remove("hidden");
    this._setLocalStorage();
  }

  _renderBattleLogDisplay(message) {
    this._renderStatsDisplay();
    console.log(this.player);
    const battleLogElement = document.querySelector(".battleLogContent");
    battleLogElement.insertAdjacentHTML("afterbegin", `<p>  ${message}</p>`);
  }

  _handleEndBattle() {
    this.battle._endIdleBattle();
    buttonEndBattle.classList.add("hidden");
    buttonStartBattle.classList.remove("hidden");
    this._setLocalStorage();
  }

  _setLocalStorage() {
    localStorage.setItem("player", JSON.stringify(this.player));
  }
  _loadLocalStorage() {
    const data = JSON.parse(localStorage.getItem("player"));
    if (!data) {
      this.player = new PlayerObject();
    } else {
      this.player = new PlayerObject(
        data.name,
        data.exp,
        data.zeni,
        data.health,
        data.attackDmg
      );
      this.player.inventory = data.inventory || [];
      this.player.questsFinished = data.questsFinished || [];
      this.player.enemiesDefeated = data.enemiesDefeated || [];
      this.player.regen = data.regen || 0;
    }

    this.player._regen();
    this._renderStatsDisplay();
    this._renderNameDisplay();
  }
}

const app = new App();
