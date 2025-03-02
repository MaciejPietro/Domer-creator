// type ReviewReviewer = {
//     id: number;
//     username: string;
//     avatar: string | null;
//   };

//   type ReviewReviewed = {
//     id: number;
//     username: string;
//   };

//   export type Review = {
//     id: number;
//     reviewer: ReviewReviewer;
//     reviewedUser: ReviewReviewed;
//     rating: number;
//     comment: string;
//     createdAt: string;
//   };

//   export type GetReviewsListResponse = Array<Review>;

//   export type SendReviewPayload = {
//     reviewedUserId: number;
//     rating: number;
//     comment: string;
//   };

//   export type UserDetails = {
//     id: number;
//     firstName: string;
//     lastName: string;
//     username: string;
//     avatar: string | null;
//     createdAt: string;
//   };

//   export type GetUserDetailsResponse = {
//     data: UserDetails;
//   };

//   export type GetUserProfileResponse = {
//     id: number;
//     username: string;
//     name: string;
//     email: string;
//     avatarUrl: string | null;
//     createdAt: string;
//   };

//   export type UpdateUserProfilePayload = {
//     name: string;
//     username: string;
//     email: string;
//     currentPassword: string;
//   };

//   export type UpdateUserPasswordPayload = {
//     newPassword: string;
//     currentPassword: string;
//   };

//   export type DeleteAccountPayload = {
//     password: string;
//   };

//   export type UpdateUserAvatarPayload =
//     | FormData
//     | {
//         avatar: File;
//       };
