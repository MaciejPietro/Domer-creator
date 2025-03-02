export const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

export const hasUpperCase = (password: string) => {
    return /[A-Z]/.test(password);
};

export const hasLowerCase = (password: string) => {
    return /[a-z]/.test(password);
};

export const hasNumber = (password: string) => {
    return /\d/.test(password);
};

export const validateEmail = (email: string): string | undefined => {
    if (!email) {
        return 'Adres e-mail jest wymagany';
    }
    if (!isValidEmail(email)) {
        return 'Nieprawidłowy adres e-mail';
    }
    return undefined;
};

export const validatePassword = (password: string): string | undefined => {
    if (!password) {
        return 'Hasło jest wymagane';
    }
    if (!hasUpperCase(password)) {
        return 'Hasło nie spełnia wymagań';
    }
    if (!hasLowerCase(password)) {
        return 'Hasło musi zawierać małą literę';
    }
    if (!hasNumber(password)) {
        return 'Hasło musi zawierać cyfrę';
    }
    return undefined;
};

export const validatePasswordConfirmation = (password: string, passwordConfirmation: string): string | undefined => {
    if (!passwordConfirmation) {
        return 'Powtórz hasło';
    }
    if (password !== passwordConfirmation) {
        return 'Hasła nie są takie same';
    }
    return undefined;
};

export const validateUsername = (username: string): string | undefined => {
    if (username && username.length < 3) {
        return 'Nazwa użytkownika musi mieć co najmniej 3 znaki';
    }

    return undefined;
};

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
