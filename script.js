"use strict";

import { items } from "./items.js";

class PlayerObject {
  inventory = [];
  constructor(name = "player", exp = 0, zeni = 500) {
    this.name = name;
    this.exp = exp;
    this.zeni = zeni;
  }
  _addExp(amount) {
    this.exp += amount;
  }
  _addZeni(amount) {
    this.zeni += amount;
  }
  _addInventory(item) {
    this.inventory.push(item);
  }
  _setName(name) {
    return (this.name = name);
  }
}

const buttonAddExp = document.querySelector(".button-addExp");
const statsDisplay = document.querySelector(".statsDisplay");
const allItemsElement = document.querySelector(".allitems");
const namedisplayElement = document.querySelector(".nameDisplay");

class App {
  constructor() {
    this._loadLocalStorage();
    buttonAddExp.addEventListener("click", this._handleAddExp.bind(this));
  }
  _handleAddExp() {
    this._addExp(10);
  }

  _addExp(amount) {
    this.player._addExp(amount);
    this._renderStatsDisplay();
    this._renderNameDisplay();
    this._setLocalStorage();
  }
  _renderStatsDisplay() {
    statsDisplay.textContent = `Player Experience: ${this.player.exp} Zeni: ${this.player.zeni}`;
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
    namedisplayElement.innerHTML = `${this.player.name} <span class="editName text-xs text-black-500 cursor-pointer underline ml-2">Change</span>`;
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

  _setLocalStorage() {
    localStorage.setItem("player", JSON.stringify(this.player));
  }
  _loadLocalStorage() {
    const data = JSON.parse(localStorage.getItem("player"));
    if (!data) {
      this.player = new PlayerObject();
      this._renderStatsDisplay();
      this._renderNameDisplay();
      return;
    }

    this.player = new PlayerObject(data.name, data.exp, data.zeni);
    this._renderStatsDisplay();
    this._renderNameDisplay();
  }
}

const app = new App();
