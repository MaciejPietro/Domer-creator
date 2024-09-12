export const _t = (string: string) => {
    return string;
};

export type TranslationFunction = typeof _t;

const useTranslation = () => {
    return _t;
};

export default useTranslation;
