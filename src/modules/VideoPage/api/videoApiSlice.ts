import { baseApi } from "src/base-api";

import { PaginatedQueryParams, PaginatedResponse } from "src/models";
import { User } from "src/modules/shared/models";
import { VideoComment, AddVideoComment, VideoDetails, VideoCommentQueryParams } from "../models";

export const videoApiSlice = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		videoDetails: builder.query<VideoDetails, { videoId: number }>({
			keepUnusedDataFor: 0,
			query: ({ videoId }) => `/videos/${videoId}/details`,
		}),
		getVideoComments: builder.query<PaginatedResponse<VideoComment>, VideoCommentQueryParams>({
			keepUnusedDataFor: 0,
			query: (query) => {
				const { videoId, ...queryParams } = query;
				const params = new URLSearchParams(queryParams as never);

				return {
					url: `/videos/${videoId}/comments?${params}`,
				}
			},
			serializeQueryArgs: ({ endpointName, queryArgs: { videoId } }) => {
				return endpointName + videoId;
			},
			merge: (currentCache, newItems) => {
				const { data, ...rest } = newItems;

				currentCache.data.push(...newItems.data);

				currentCache = {
					...currentCache,
					...rest
				}
			},
			forceRefetch({ currentArg, previousArg }) {
				return (currentArg?.pageNumber ?? 0) > (previousArg?.pageNumber ?? 0) ||
					currentArg?.pageSize !== previousArg?.pageSize;
			}
		}),
		addVideoComment: builder.mutation<VideoComment, { videoId: number, body: AddVideoComment, user?: User }>({
			query: ({ videoId, body }) => ({
				url: `/videos/${videoId}/comments`,
				method: 'POST',
				body
			}),
			async onQueryStarted({ videoId, body: { data }, user }, { dispatch, queryFulfilled }) {
				const { fullName, id: userId } = user ?? { fullName: '', id: -1 };

				const item: VideoComment = {
					userId,
					videoId,
					data,
					fullName,
					createdAt: (new Date()).toString(),
					profilePictureSrc: null,
					isEdited: false
				};

				const patchResult = dispatch(
					videoApiSlice.util.updateQueryData('getVideoComments', { videoId } as VideoCommentQueryParams, draft => {
						draft.data.unshift(item);
						draft.count += 1;
					})
				)

				try {
					const queryResult = await queryFulfilled;

					dispatch(videoApiSlice.util.updateQueryData('getVideoComments', { videoId } as VideoCommentQueryParams, draft => {
						const newData = draft.data.map(x => {
							if (x.createdAt === item.createdAt && x.id === undefined) {
								return { ...x, ...queryResult.data }
							}

							return x;
						});

						draft.data = newData;
					}));
				} catch {
					patchResult.undo();
				}
			}
		}),
		editVideoComment: builder.mutation<VideoComment, { id: number, videoId: number, body: AddVideoComment }>({
			query: ({ id, videoId, body }) => ({
				url: `/videos/${videoId}/comments/${id}`,
				method: 'PATCH',
				body
			}),
			async onQueryStarted({ id, videoId, body: { data } }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					videoApiSlice.util.updateQueryData('getVideoComments', { videoId } as VideoCommentQueryParams, draft => {
						const newData = draft.data.map(x => {
							if (x.id === id) {
								return { ...x, data, isEdited: true }
							}

							return x;
						});

						draft.data = newData;
					})
				)

				try {
					const result = await queryFulfilled;

					dispatch(
						videoApiSlice.util.updateQueryData('getVideoComments', { videoId } as VideoCommentQueryParams, draft => {
							const newData = draft.data.map(x => {
								if (x.id === result.data.id) {
									return { ...x, ...result.data }
								}

								return x;
							});

							draft.data = newData;
						})
					);
				} catch {
					patchResult.undo();
				}
			}
		}),
		deleteVideoComment: builder.mutation<VideoComment, { id: number, videoId: number }>({
			query: ({ id, videoId }) => ({
				url: `/videos/${videoId}/comments/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted({ id, videoId }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					videoApiSlice.util.updateQueryData('getVideoComments', { videoId } as VideoCommentQueryParams, draft => {
						const newData = draft.data.filter(x => x.id !== id);

						draft.data = newData;
						draft.count -= 1;
					})
				)

				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			}
		}),
		likeVideo: builder.mutation<Pick<VideoDetails, 'isLiked' | 'isDisliked'>, { videoId: number, value: number }>({
			query: ({ videoId, value }) => ({
				url: `/videos/${videoId}/like`,
				method: 'POST',
				body: {
					value
				}
			}),
			async onQueryStarted({ videoId, value }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					videoApiSlice.util.updateQueryData('videoDetails', { videoId }, draft => {
						if (value >= 0) {
							//reset dislikes
							draft.dislikes -= +draft.isDisliked;
							draft.isDisliked = false;

							//set likes
							draft.isLiked = true;
							draft.likes += 1;
						}
						else if (value <= 0) {
							//reset likes
							draft.likes -= +draft.isLiked;
							draft.isLiked = false;

							//set dislikes
							draft.isDisliked = true;
							draft.dislikes += 1;
						}
					})
				)
				try {
					const result = await queryFulfilled;

					dispatch(
						videoApiSlice.util.updateQueryData('videoDetails', { videoId }, draft => {
							draft.isLiked = result.data.isLiked;
							draft.isDisliked = result.data.isDisliked;
						})
					)
				} catch {
					patchResult.undo();
				}
			}
		}),
		deleteLikeFromVideo: builder.mutation<void, { videoId: number, isLike: boolean }>({
			query: ({ videoId }) => ({
				url: `/videos/${videoId}/like`,
				method: 'DELETE'
			}),
			async onQueryStarted({ videoId, isLike }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					videoApiSlice.util.updateQueryData('videoDetails', { videoId }, draft => {
						if (isLike) {
							draft.likes -= +draft.isLiked;
							draft.isLiked = false;
						}
						else {
							draft.dislikes -= +draft.isDisliked;
							draft.isDisliked = false;
						}
					})
				)
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			}
		}),
		shareVideo: builder.mutation<void, { videoId: number, userId: number }>({
			query: ({ videoId, userId }) => ({
				url: `/videos/${videoId}/share/${userId}`,
				method: 'POST'
			})
		})
	})
});

export const {
	useVideoDetailsQuery,
	useGetVideoCommentsQuery,
	useAddVideoCommentMutation,
	useEditVideoCommentMutation,
	useDeleteVideoCommentMutation,
	useLikeVideoMutation,
	useDeleteLikeFromVideoMutation,
	useShareVideoMutation
} = videoApiSlice;