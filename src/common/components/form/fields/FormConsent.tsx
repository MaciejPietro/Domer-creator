import type { FormApi } from '@tanstack/react-form';
import Checkboxes from '../../inputs/Checkboxes';
import FieldError from '../FieldError';
import { Link } from '@tanstack/react-router';
import type { FormValues } from '@/Items/components/ItemForm';
import ExternalLinkIcon from '@/Common/assets/icons/external-link.svg?react';

const FormConsent = ({ form }: { form: FormApi<FormValues> }) => {
    return (
        <>
            <h3 className='text-base '>Warunki dodania ogłoszenia</h3>
            <div className='mt-2'>
                <form.Field
                    name='acceptTerms'
                    validators={{
                        onSubmit: ({ value }: { value: boolean }) => {
                            if (!value) return 'To pole jest wymagane';
                            return undefined;
                        },
                    }}>
                    {(field) => (
                        <div className='relative'>
                            <Checkboxes.CheckboxItem
                                item={{
                                    code: 'acceptTerms',
                                    name: (
                                        <>
                                            Akceptuję warunki dodania ogłoszenia, które znajdują się w naszej{' '}
                                            {/* @ts-expect-error find why ? */}
                                            <Link
                                                to='/polityka-prywatnosci'
                                                className='underline hover:text-gray-600 transition-colors inline-flex gap-0.5 items-center'>
                                                polityce prywatności
                                                <ExternalLinkIcon className='size-4' />
                                            </Link>
                                        </>
                                    ),
                                }}
                                handleChange={(_, value) => {
                                    field.handleChange(value);
                                }}
                            />
                            {field.state.meta.errors && (
                                <div className='relative h-1 ml-3'>
                                    <FieldError errors={field.state.meta.errors} />
                                </div>
                            )}
                        </div>
                    )}
                </form.Field>
            </div>
        </>
    );
};

export default FormConsent;
