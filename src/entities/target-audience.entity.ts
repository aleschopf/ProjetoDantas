import type { ITargetAudience } from '../interfaces/target-audience.interface';

export class TargetAudience implements ITargetAudience {
    public id: string;
    constructor(
        public name: string,
        public color: string
    ) {
        this.id = "";
    }

    static get table(): string {
        return 'target_audiences';
    }
}
