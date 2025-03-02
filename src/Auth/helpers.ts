export const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

//   export const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString("pl-PL", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   export const formatTime = (date: string) => {
//     const inputDate = new Date(date);
//     const today = new Date();

//     // Check if the input date is today
//     const isToday = inputDate.toDateString() === today.toDateString();

//     if (isToday) {
//       return inputDate.toLocaleTimeString("pl-PL", {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } else {
//       return inputDate.toLocaleString("pl-PL", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       });
//     }
//   };

//   export const getTime = (date: string) => {
//     const inputDate = new Date(date);
//     return inputDate.toLocaleTimeString("pl-PL", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };
