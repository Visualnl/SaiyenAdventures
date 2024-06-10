"use strict";
import PlayerObject from "./playerobject.js";
import Enemy from "./enemy.js";
import Battle from "./battle.js";
import { enemiesList } from "./enemieslist.js";
import { quests } from "./quests.js";

const buttonAddExp = document.querySelector(".button-addExp");
const statsDisplay = document.querySelector(".statsDisplay");
const allItemsElement = document.querySelector(".allitems");
const namedisplayElement = document.querySelector(".nameDisplay");
const buttonStartBattle = document.querySelector(".button-startBattle");
const buttonEndBattle = document.querySelector(".button-stopBattle");
const selectEnemyELement = document.querySelector(".selectEnemies");
const selectedEnemyElement = document.getElementById("enemies");
const inventoryContent = document.querySelector(".inventoryContent");
const questListContent = document.querySelector(".questListContent");

class App {
  constructor() {
    this._loadLocalStorage();
    buttonStartBattle.addEventListener(
      "click",
      this._handleStartBattle.bind(this)
    );
    buttonEndBattle.addEventListener("click", this._handleEndBattle.bind(this));
    this._renderEnemiesList();
    this._renderInventory();
    this._renderQuestList();
  }

  _renderStatsDisplay() {
    statsDisplay.textContent = `level:${this.player._getLevel(
      this.player.exp
    )} Zeni: ${this.player.zeni}`;
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

    this.enemy = new Enemy(
      enemy.name,
      enemy.health,
      enemy.attackDmg,
      enemy.zeni,
      enemy.exp,
      enemy.loot
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

    const battleLogElement = document.querySelector(".battleLogContent");
    battleLogElement.insertAdjacentHTML("afterbegin", `<p>  ${message}</p>`);
  }

  _handleEndBattle() {
    this.battle._endIdleBattle();
    buttonEndBattle.classList.add("hidden");
    buttonStartBattle.classList.remove("hidden");
    this._setLocalStorage();
    this._renderInventory();
    this._renderQuestList();
  }
  _renderInventory() {
    inventoryContent.innerHTML = "";
    this.player.inventory.forEach((item) =>
      inventoryContent.insertAdjacentHTML(
        "beforeend",
        `<div class="p-2 border border-gray-300 rounded-lg bg-gray-200 flex justify-center items-center">
   ${item.name}(${item.quantity})
  </div> `
      )
    );
  }

  _renderQuestList() {
    questListContent.innerHTML = "";
    quests.forEach((quest) => {
      const questItem = document.createElement("div");
      let hasRequiredItems = true;

      quest.required.forEach((requiredItem) => {
        const playerItem = this.player.inventory.find(
          (item) => item.name === requiredItem.name
        );
        if (!playerItem || playerItem.quantity < requiredItem.quantity) {
          hasRequiredItems = false;
        }
      });

      questItem.classList.add(
        "p-2",
        "border",
        "border-gray-300",
        "rounded-lg",
        hasRequiredItems ? "bg-green-500" : "bg-red-500"
      );

      questItem.textContent = `${quest.name} by ${quest.trainer}`;

      const requiredItems = quest.required
        .map((item) => `${item.quantity} ${item.name}`)
        .join(", ");
      const requiredItemsElement = document.createElement("div");
      requiredItemsElement.textContent = ` ${requiredItems}`;
      questItem.appendChild(requiredItemsElement);
      questListContent.insertAdjacentElement("beforeend", questItem);
    });
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
      this.player.loot = data.loot || [];
    }

    this.player._regen();
    this._renderStatsDisplay();
    this._renderNameDisplay();
  }
}

const app = new App();
