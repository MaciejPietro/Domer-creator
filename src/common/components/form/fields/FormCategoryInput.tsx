import type { FormApi } from "@tanstack/react-form";
import { Dropdown } from "primereact/dropdown";
import useCategories from "@/Items/hooks/useCategories";
import type { ApiResponse } from "@/Common/api/types";
import type { GetCategoriesResponse } from "@/Items/types/api";
import FieldError from "../FieldError";
import clsx from "clsx";

type ComponentProps = {
  form: FormApi<any, undefined>;
  name: string;
  label?: string;
  disabled?: boolean;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
};

const prepareCategories = (
  data: ApiResponse<GetCategoriesResponse> | undefined
) => {
  if (!data?.data) return [];

  return data.data
    .map((category) => {
      return [
        { name: category.name, code: category.id },
        ...category.children.map((category) => ({
          name: category.name,
          code: category.id,
        })),
      ];
    })
    .flat();
};

const FormCategoryInput = ({
  form,
  name,
  required = false,
}: ComponentProps) => {
  const { data } = useCategories();

  const options = prepareCategories(data);

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
          <Dropdown
            value={field.state.value}
            onChange={(e) => {
              field.handleChange(e.value);
            }}
            options={options}
            optionLabel="name"
            optionValue="code"
            placeholder="Wybierz kategorię"
            filter
            className={clsx(
              "w-full bg-gray-100 border rounded-xl px-4 py-1",
              field.state.meta.errors.length
                ? " border-red-500"
                : "border-transparent"
            )}
          />
          <div className="relative h-2 -mt-2">
            {field.state.meta.errors && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        </div>
      )}
    </form.Field>
  );
};

export default FormCategoryInput;
