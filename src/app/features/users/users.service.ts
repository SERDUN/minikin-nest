export class UsersService {
    private users = new Map<number, any>();
    private currentId = 1;

    findAll(search?: string) {
        if (search) {
            return Array.from(this.users.values()).filter(user =>
                user.name.includes(search) || user.email.includes(search)
            );
        }
        return Array.from(this.users.values());
    }

    findOne(id: number) {
        const user = this.users.get(id);
        if (!user) {
            throw new Error(`User ${id} not found`);
        }
        return user;
    }

    create(user: any) {
        const id = this.currentId++;
        this.users.set(id, {id, ...user});
        return {id, ...user};
    }

    delete(id: number) {
        const deleted = this.users.delete(id);
        return deleted ? `User ${id} deleted` : `User ${id} not found`;
    }
}