import { LocalStorageRepository } from './local-storage.repository';
import { TargetAudience } from '../entities/target-audience.entity';

export const targetAudienceRepo = new LocalStorageRepository<TargetAudience>(TargetAudience.table);

export function saveTargetAudience(targetAudience: TargetAudience) {
    const items = targetAudienceRepo.find();
    const nameExists = items.some(existing => existing.name.toLowerCase() === targetAudience.name.toLowerCase());

    if (nameExists) {
        return { success: false, message: 'Já existe um Público Alvo com esse nome.' };
    }

    return targetAudienceRepo.save(targetAudience);
}

export function updateTargetAudience(id: string, updateData: Partial<TargetAudience>) {
    const items = targetAudienceRepo.find();
    if (updateData.name && items.some(existing => existing.name.toLowerCase() === updateData.name?.toLowerCase() && existing.id !== id)) {
        return { success: false, message: 'Já existe um Público Alvo com esse nome.' };
    }

    return targetAudienceRepo.update(id, updateData);
}
