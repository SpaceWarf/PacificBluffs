import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function deleteProfilePicture(filename: string) {
  try {
    await deleteObject(ref(storage, `profile-pictures/${filename}`));
  } catch (e: any) {
    if (e.code === 'storage/object-not-found') {
      console.error('Could not delete profile picture.');
      return;
    }
    throw new Error(e);
  }
}

export async function uploadProfilePicture(file: File, filename: string) {
  await uploadBytes(ref(storage, `profile-pictures/${filename}`), file);
}

export async function getProfilePictureUrl(filename: string): Promise<string> {
  try {
    return await getDownloadURL(ref(storage, `profile-pictures/${filename}`));
  } catch (e: any) {
    if (e.code === 'storage/object-not-found') {
      console.error('Could not load profile picture.');
      return Promise.resolve('');
    }
    throw new Error(e);
  }
}