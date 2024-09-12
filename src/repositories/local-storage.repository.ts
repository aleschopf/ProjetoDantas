export class LocalStorageRepository<T extends { id: string }> {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    private hasEmptyFields(dto: Partial<T>): boolean {
        return Object.values(dto).some(value => value === undefined || value === null || value === "");
    }

    find(): T[] {
        const items = localStorage.getItem(this.storageKey);
        return items ? JSON.parse(items) : [];
    }

    save(dto: Partial<T>): { success: boolean; message: string } {
        if (this.hasEmptyFields(dto)) {
            return { success: false, message: 'Todos os campos são obrigatórios e não podem estar vazios.' };
        }

        const items = this.find();
        const newItem: T = { ...dto, id: Date.now().toString() } as T;
        items.push(newItem);
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        return { success: true, message: `${this.storageKey} cadastrado com sucesso.` };
    }

    update(id: string, updateDto: Partial<T>): { success: boolean; message: string } {
        const items = this.find();
        const itemIndex = items.findIndex((item) => item.id === id);

        if (this.hasEmptyFields(updateDto)) {
            return { success: false, message: 'Todos os campos são obrigatórios e não podem estar vazios.' };
        }

        if (itemIndex !== -1) {
            const updatedItem = { ...items[itemIndex], ...updateDto };
            items[itemIndex] = updatedItem;
            localStorage.setItem(this.storageKey, JSON.stringify(items));
            return { success: true, message: `${this.storageKey} atualizado com sucesso.` };
        }
        return { success: false, message: `${this.storageKey} não encontrado.` };
    }

    delete(id: string): { success: boolean; message: string } {
        const items = this.find();
        const newItems = items.filter((item) => item.id !== id);

        if (newItems.length !== items.length) {
            localStorage.setItem(this.storageKey, JSON.stringify(newItems));
            return { success: true, message: `${this.storageKey} deletado com sucesso.` };
        }
        return { success: false, message: `${this.storageKey} não encontrado.` };
    }
}
