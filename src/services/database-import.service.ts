import { Tags } from '../entities/tag.entity';
import { TargetAudience } from '../entities/target-audience.entity';
import { Video } from '../entities/video.entity';
import { Exercise } from '../entities/exercise.entity';

export async function importDatabase(fileContent: string): Promise<{ success: boolean; message: string }> {
    try {
        const data = JSON.parse(fileContent);

        if (data.tags) {
            localStorage.setItem(Tags.table, JSON.stringify(data.tags));
        }

        if (data.targetAudiences) {
            localStorage.setItem(TargetAudience.table, JSON.stringify(data.targetAudiences));
        }

        if (data.videos) {
            localStorage.setItem(Video.table, JSON.stringify(data.videos));
        }

        if (data.exercises) {
            localStorage.setItem(Exercise.table, JSON.stringify(data.exercises));
        }

        return { success: true, message: 'Database imported successfully.' };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: `Error importing database: ${error.message}` };
        }
        return { success: false, message: 'Unknown error occurred during database import.' };
    }
}
