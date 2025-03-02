import type { FormApi } from "@tanstack/react-form";
import { forwardRef } from "react";
import InputImages from "../../inputs/InputImages";
import type { ImageMedia } from "@/Common/types";

type ComponentProps = {
  form: FormApi<any, undefined>;
  name: string;
  required?: boolean;
  initialValue?: Array<ImageMedia>;
  onDelete?: (id: number) => void;
};

const FormInput = forwardRef<HTMLInputElement, ComponentProps>(
  ({
    form,
    name,
    required = false,
    initialValue,
    onDelete,
  }: ComponentProps) => {
    return (
      <form.Field
        name={name}
        validators={{
          onSubmit: ({ value }: { value: string }) => {
            if (required && !value) return "To pole jest wymagane";
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="col-span-full mt-2 relative">
            <InputImages
              initialValue={initialValue}
              onChange={(e, isNew) => {
                if (isNew) {
                  field.handleChange(e);
                }
              }}
              onDelete={(id) => {
                onDelete?.(+id);
              }}
            />
          </div>
        )}
      </form.Field>
    );
  }
);

export default FormInput;
