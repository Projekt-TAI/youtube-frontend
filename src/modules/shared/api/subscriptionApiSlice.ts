import { baseApi } from "src/base-api";

import { Subscription } from "../models";
import { videoApiSlice } from "src/modules/VideoPage/api/videoApiSlice";
import { userPageApiSlice } from "src/modules/UserPage/api";

export const subscriptionApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserSubscriptions: builder.query<Subscription[], {}>({
      query: () => ({
        url: '/subscriptions/me',
      }),
      transformResponse: (data: Subscription[]) => data.map((x) => ({ ...x, isSubscribed: true }))
    }),
    postSubscription: builder.mutation<Omit<Subscription, 'isSubscribed'>, Omit<Subscription, 'isSubscribed'> & { videoId?: number }>({
      query: ({ userId }) => ({
				url: `/subscriptions/user/${userId}/subscribe`,
				method: 'POST'
			}),
      async onQueryStarted({ userFullName, userId, videoId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionApiSlice.util.updateQueryData('getUserSubscriptions', {}, draft => {
            draft ??= [];

            const arrayIndex = draft.findIndex(x => x.userId === userId);

            if (arrayIndex >= 0) {
              draft[arrayIndex] = {
                ...draft[arrayIndex],
                isSubscribed: true
              }
            }
            else {
              draft.push({
                userId,
                userFullName,
                isSubscribed: true
              });
            }
          })
        )

        const videoPatchResult = dispatch(
          videoApiSlice.util.updateQueryData('videoDetails', { videoId: videoId! }, draft => {
            draft.subscriptions += 1;
          })
        )

        const userPatchResult = dispatch(
          userPageApiSlice.util.updateQueryData('getUserDetails', userId, draft => {
            draft.isSubscribed = true;
            draft.subscriptions += 1;
          })
        )
        
        try {
          const result = await queryFulfilled;

          dispatch(
            subscriptionApiSlice.util.updateQueryData('getUserSubscriptions', {}, draft => {
              const arrayIndex = draft.findIndex(x => x.userId === userId);
  
              if (arrayIndex >= 0) {
                draft[arrayIndex] = {
                  ...draft[arrayIndex],
                  ...result.data
                }
              }
            })
          )
        } catch {
          patchResult.undo();
          videoPatchResult.undo();
          userPatchResult.undo();
        }
      },
      
    }),
    deleteSubscription: builder.mutation<void, Pick<Subscription, 'userId'> & { videoId?: number }>({
      query: ({ userId }) => ({
				url: `/subscriptions/user/${userId}/subscribe`,
				method: 'DELETE'
			}),
      async onQueryStarted({ userId, videoId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionApiSlice.util.updateQueryData('getUserSubscriptions', {}, draft => {
            const indexToModify = draft.findIndex(x => x.userId === userId)

            if (indexToModify >= 0) {
              draft[indexToModify].isSubscribed = false;
            }
          })
        )

        const videoPatchResult = dispatch(
          videoApiSlice.util.updateQueryData('videoDetails', { videoId: videoId! }, draft => {
            draft.subscriptions -= 1;
          })
        )

        const userPatchResult = dispatch(
          userPageApiSlice.util.updateQueryData('getUserDetails', userId, draft => {
            draft.isSubscribed = false;
            draft.subscriptions -= 1;
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo();
          videoPatchResult.undo();
          userPatchResult.undo();
        }
      }
    })
  })
});

export const {
  useGetUserSubscriptionsQuery,
  useLazyGetUserSubscriptionsQuery,
  usePostSubscriptionMutation,
  useDeleteSubscriptionMutation
} = subscriptionApiSlice;