import type { FormApi } from "@tanstack/react-form";
import Radio from "@/Common/components/inputs/Radio";

type ComponentProps = {
  form: FormApi<any, undefined>;
  name: string;
  items: Array<{ name: string; code: string }>;
  required?: boolean;
  size?: "sm" | "md";
};

const FormRadio = ({
  form,
  name,
  items,
  required = false,
  size = "sm",
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
          <Radio
            value={field.getValue()}
            size={size}
            errors={field.state.meta.errors}
            onChange={field.handleChange}
            items={items}
          />
        </div>
      )}
    </form.Field>
  );
};

export default FormRadio;
