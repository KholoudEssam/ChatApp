class User {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        const user = { id, name, room };
        this.users.push(user);
        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id);
    }
    getUsers(room) {
        return this.users
            .filter((user) => user.room === room)
            .map((u) => u.name);
    }
    removeUser(id) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        const user = this.users[userIndex];
        this.users.splice(userIndex, 1);
        return user;
    }
    checkUserExist(username) {
        const user = this.users.filter((user) => user.name === username);
        return user.length > 0;
    }
}

module.exports = User;
