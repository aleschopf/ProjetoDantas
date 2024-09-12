import { LocalStorageRepository } from './local-storage.repository';
import { Exercise } from '../entities/exercise.entity';

export const exerciseRepo = new LocalStorageRepository<Exercise>(Exercise.table);

export function saveExercise(exercise: Exercise): { success: boolean; message: string } {
    return exerciseRepo.save(exercise);
}

export function updateExercise(id: string, updateData: Partial<Exercise>): { success: boolean; message: string } {
    return exerciseRepo.update(id, updateData);
}

export function deleteExercise(id: string): { success: boolean; message: string } {
    return exerciseRepo.delete(id);
}
