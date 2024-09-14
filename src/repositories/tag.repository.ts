import { LocalStorageRepository } from './local-storage.repository';
import { Tags } from '../entities/tag.entity';

export const tagRepo = new LocalStorageRepository<Tags>(Tags.table);

export function saveTag(tag: Tags) {
    const items = tagRepo.find();
    const nameExists = items.some(existingTag => existingTag.name.toLowerCase() === tag.name.toLowerCase());

    if (nameExists) {
        return { success: false, message: 'Já existe uma Tag com esse nome.' };
    }

    return tagRepo.save(tag);
}

export function updateTag(id: string, updateData: Partial<Tags>) {
    const items = tagRepo.find();
    if (updateData.name && items.some(existingTag => existingTag.name.toLowerCase() === updateData.name?.toLowerCase() && existingTag.id !== id)) {
        return { success: false, message: 'Já existe uma Tag com esse nome.' };
    }

    return tagRepo.update(id, updateData);
}
