import type { ITag } from '../interfaces/tag.interface';

export class Tags implements ITag {
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
