import useUser from '@/User/hooks/useUser';
import useResendEmailConfirmation from '@/User/hooks/useResendEmailConfirmation';
import { Button } from '@mantine/core';
import { IconCircle0, IconExclamationCircle } from '@tabler/icons-react';

const ConfirmEmailField = () => {
    const user = useUser();
    const { mutate, isPending } = useResendEmailConfirmation();

    const handleResendEmailConfirmation = () => {
        mutate();
    };

    return (
        <>
            {user?.isEmailConfirmed ? (
                <p className="text-sm text-gray-400 flex gap-2 items-center">
                    <IconCircle0 className="w-4 h-4 text-green-500" />
                    Adres email dla tego konta został potwierdzony.
                </p>
            ) : (
                <>
                    <p className="text-sm text-red-400 flex gap-2 items-center">
                        <IconExclamationCircle className="w-4 h-4" />
                        Potwierdź swój adres email, aby móc w przyszłości przypomnieć hasło.
                    </p>

                    <div className="flex gap-4 items-center text-xs mt-4">
                        <p className="text-gray-400">Nie otrzymałeś wiadomość z linkiem aktywacyjnym?</p>
                        <Button
                            variant="transparent"
                            color="black"
                            size="xs"
                            onClick={handleResendEmailConfirmation}
                            loading={isPending}
                        >
                            <span className="font-medium text-gray-400 hover:text-gray-600">Wyślij ponownie</span>
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export default ConfirmEmailField;
