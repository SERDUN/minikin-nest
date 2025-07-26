export class UsersService {
    private users = new Map<string, any>();

    findAll() {
        return Array.from(this.users.values());
    }

    findOne(id: string) {
        return this.users.get(id) ?? `User ${id} not found`;
    }

    create(user: any) {
        const id = Date.now().toString();
        this.users.set(id, {id, ...user});
        return {id, ...user};
    }

    delete(id: string) {
        const deleted = this.users.delete(id);
        return deleted ? `User ${id} deleted` : `User ${id} not found`;
    }
}
