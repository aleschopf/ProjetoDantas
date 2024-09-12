import type { ITag } from '../interfaces/tag.interface'; // Importando a interface

export class Tag implements ITag {
    public id: string;
    constructor(
        public name: string,
        public color: string
    ) {
        this.id = ""
    }

    static get table(): string {
        return 'tags';
    }
}