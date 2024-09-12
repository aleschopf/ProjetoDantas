import { LocalStorageRepository } from './local-storage.repository';
import { Video } from '../entities/video.entity';

export const videoRepo = new LocalStorageRepository<Video>(Video.table);

export function saveVideo(video: Video) {
    return videoRepo.save(video);
}

export function updateVideo(id: string, updateData: Partial<Video>) {
    return videoRepo.update(id, updateData);
}

export function deleteVideo(id: string) {
    return videoRepo.delete(id);
}
