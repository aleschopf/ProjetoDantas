import type { IVideo } from '../interfaces/video.interface';
import { TargetAudience } from './target-audience.entity';

export class Video implements IVideo {
    public id: string;
    constructor(
        public link: string,
        public level: "facil" | "medio" | "dificil",
        public targetAudiences: TargetAudience[]
    ) {
        this.id = "";
    }

    static get table(): string {
        return 'videos';
    }
}
