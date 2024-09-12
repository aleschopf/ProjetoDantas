import { Tag } from '../entities/tag.entity';
import { Video } from '../entities/video.entity';

export interface IExercise {
    id: string;
    name: string;
    tags: Tag[];
    videos: Video[];
}