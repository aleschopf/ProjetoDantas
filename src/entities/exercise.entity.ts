import type { IExercise } from '../interfaces/exercise.interface'; // Importando a interface
import { Tags } from './tag.entity';
import { Video } from './video.entity';

export class Exercise implements IExercise {
    public id: string;
    constructor(
        public name: string,
        public tags: Tags[],
        public videos: Video[]
    ) { this.id = "" }

    static get table(): string {
        return 'exercises';
    }
}
