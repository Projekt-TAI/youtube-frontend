import { baseApi } from "src/base-api";
import { PaginatedQueryParams, PaginatedResponse } from "src/models";
import { Video } from "src/modules/shared/models";

export const allVideosApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allVideos: builder.query<Video[], PaginatedQueryParams>({
      query: (queryParams) => {
				const params = new URLSearchParams(queryParams as never);

				return {
					url: `/videos?${params}`,
				}
			},
      serializeQueryArgs: ({ endpointName, queryArgs: { pageSize } }) => {
        return endpointName + pageSize;
      },
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg!.pageNumber > (previousArg?.pageNumber ?? 0) || currentArg?.pageSize !== previousArg?.pageSize;
      }
    })
  })
});

export const {
  useAllVideosQuery
} = allVideosApiSlice;