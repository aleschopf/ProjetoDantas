import type { IExercise } from '../interfaces/exercise.interface'; // Importando a interface
import { Tag } from './tag.entity';
import { Video } from './video.entity';

export class Exercise implements IExercise {
    public id: string;
    constructor(
        public name: string,
        public tags: Tag[],
        public videos: Video[]
    ) { this.id = "" }

    static get table(): string {
        return 'exercises';
    }
}
