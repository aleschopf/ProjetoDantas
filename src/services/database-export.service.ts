import { saveAs } from 'file-saver';
import { tagRepo } from '../repositories/tag.repository';
import { targetAudienceRepo } from '../repositories/target-audience.repository';
import { videoRepo } from '../repositories/video.repository';
import { exerciseRepo } from '../repositories/exercise.repository';

export async function exportDatabase(): Promise<{ success: boolean; message: string }> {
    try {
        const tags = tagRepo.find();
        const targetAudiences = targetAudienceRepo.find();
        const videos = videoRepo.find();
        const exercises = exerciseRepo.find();

        const data = {
            tags,
            targetAudiences,
            videos,
            exercises
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        saveAs(blob, 'database.json');

        return { success: true, message: 'Database exported successfully as database.json.' };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: `Error exporting database: ${error.message}` };
        }
        return { success: false, message: 'Unknown error occurred during database export.' };
    }
}
