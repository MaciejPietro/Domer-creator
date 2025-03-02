import type { FormApi } from "@tanstack/react-form";
import InputTag from "../../inputs/InputTag";

type ComponentProps = {
  form: FormApi<any, undefined>;
  name: string;
  required?: boolean;
  placeholder?: string;
};

const FormTagInput = ({
  form,
  name,
  required = false,
  placeholder,
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
          <InputTag
            value={field.getValue() ? field.getValue().split(", ") : []}
            onChange={(tags) => {
              field.handleChange(tags.join(", "));
            }}
            placeholder={placeholder}
          />
        </div>
      )}
    </form.Field>
  );
};

export default FormTagInput;
