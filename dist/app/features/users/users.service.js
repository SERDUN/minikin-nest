export class UsersService {
    users = new Map();
    currentId = 1;
    findAll(search) {
        if (search) {
            return Array.from(this.users.values()).filter(user => user.name.includes(search) || user.email.includes(search));
        }
        return Array.from(this.users.values());
    }
    findOne(id) {
        const user = this.users.get(id);
        if (!user) {
            throw new Error(`User ${id} not found`);
        }
        return user;
    }
    create(user) {
        const id = this.currentId++;
        this.users.set(id, { id, ...user });
        return { id, ...user };
    }
    delete(id) {
        const deleted = this.users.delete(id);
        return deleted ? `User ${id} deleted` : `User ${id} not found`;
    }
}
