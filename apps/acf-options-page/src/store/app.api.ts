import { ManifestService } from '@dhruv-techapps/core-service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NO_EXTENSION_ERROR } from '../util/constants';

export const getManifest = createAsyncThunk('app/getManifest', async () => {
  if (window.chrome?.runtime) {
    const manifest = await ManifestService.values(['name', 'version']);
    return manifest;
  }
  throw new Error(NO_EXTENSION_ERROR[0]);
});
