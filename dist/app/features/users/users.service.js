export class UsersService {
    users = new Map();
    findAll() {
        return Array.from(this.users.values());
    }
    findOne(id) {
        return this.users.get(id) ?? `User ${id} not found`;
    }
    create(user) {
        const id = Date.now().toString();
        this.users.set(id, { id, ...user });
        return { id, ...user };
    }
    delete(id) {
        const deleted = this.users.delete(id);
        return deleted ? `User ${id} deleted` : `User ${id} not found`;
    }
}
