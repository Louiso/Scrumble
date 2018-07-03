import { observable } from "mobx"

class Store {
    @observable user = null;
    @observable posts = [];
}

export const store = new Store();