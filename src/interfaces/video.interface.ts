import { TargetAudience } from '../entities/target-audience.entity';

export interface IVideo {
    id: string;
    link: string;
    level: "facil" | "medio" | "dificil";
    targetAudiences: TargetAudience[];
}