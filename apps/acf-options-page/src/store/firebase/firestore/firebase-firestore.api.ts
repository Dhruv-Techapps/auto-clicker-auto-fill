import { FirebaseFirestoreService } from '@dhruv-techapps/shared-firebase-firestore';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const profileGetAPI = createAsyncThunk('profile/get', async () => {
  const result = await FirebaseFirestoreService.getProfile();
  return result;
});

export const profileSetAPI = createAsyncThunk('profile/set', async (profile: boolean) => {
  const result = await FirebaseFirestoreService.setProfile(profile);
  return result;
});
