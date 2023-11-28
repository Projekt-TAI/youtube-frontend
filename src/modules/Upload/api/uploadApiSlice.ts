import { baseApi } from "src/base-api";

import { UploadFormModel } from "../models";

export const uploadApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation<void, UploadFormModel>({
      query: (form) => {
        const { file, title, description } = form;

        const formData = new FormData();

        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        
        return {
          url: '/videos/upload',
          method: 'POST',
          body: formData,
          formData: true
        }
      }
    })
  })
});

export const {
  useUploadMutation
} = uploadApiSlice;