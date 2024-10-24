import { TargetAudience } from '../entities/target-audience.entity';

export interface IVideo {
    id: string;
    youtube_id: string;
    level: "facil" | "medio" | "dificil";
    targetAudiences: TargetAudience[];
}