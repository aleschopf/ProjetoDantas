import { LocalStorageRepository } from './local-storage.repository';
import { Tag } from '../entities/tag.entity';

export const tagRepo = new LocalStorageRepository<Tag>(Tag.table);

export function saveTag(tag: Tag) {
    const items = tagRepo.find();
    const nameExists = items.some(existingTag => existingTag.name === tag.name);

    if (nameExists) {
        return { success: false, message: 'Já existe um Tag com esse nome.' };
    }

    return tagRepo.save(tag);
}

export function updateTag(id: string, updateData: Partial<Tag>) {
    const items = tagRepo.find();
    if (updateData.name && items.some(existingTag => existingTag.name === updateData.name && existingTag.id !== id)) {
        return { success: false, message: 'Já existe um Tag com esse nome.' };
    }

    return tagRepo.update(id, updateData);
}
