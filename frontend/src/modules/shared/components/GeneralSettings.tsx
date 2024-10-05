import { FormEvent, useState } from "react";
import { Form, useNavigation, useSubmit } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import Button from "./Button";
import InputField from "./InputField";
import { capitalizeFirstLetter } from "../utils/helpers";
import { fieldNames } from "../constants/inputNames";

export default function GeneralSettings({
  inputFields,
  description,
}: {
  inputFields: string[];
  description?: string;
}) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";
  const [atleastOneFilled, setAtleastOneFilled] = useState(false);

  const isSeller = inputFields.includes(fieldNames.name);
  const fieldsLength = inputFields.length;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    submit(e.currentTarget);
    e.currentTarget.reset();
    setAtleastOneFilled(false);
  }

  function handleFormChange(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    for (const key in data) {
      if (data[key] !== "") {
        setAtleastOneFilled(true);
        return;
      }

      setAtleastOneFilled(false);
    }
  }

  return (
    <div className={customStyles.outerContainer}>
      <Form
        onChange={(e) => handleFormChange(e)}
        method="PATCH"
        className={customStyles.form}
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className={customStyles.h1}>General Settings</h1>

        <div className={`flex gap-3 ${fieldsLength <= 1 ? "flex-col" : ""}`}>
          <div className={`flex gap-1 ${fieldsLength > 1 ? "flex-col" : ""}`}>
            {inputFields.map((inputField) => (
              <div key={inputField} className={customStyles.inputContainer}>
                <label className="w-fit">
                  {capitalizeFirstLetter(inputField)}
                </label>
                <div className="flex gap-2">
                  <InputField inputField={inputField} hasLabel={true} />
                  {fieldsLength <= 1 && (
                    <Button
                      disabled={isSubmitting || !atleastOneFilled}
                      onClick={() => console.log("clicked", isSubmitting)}
                      className="w-full rounded-lg bg-background-button px-2 py-2 font-bold text-white duration-200 hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
                      type="submit"
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {fieldsLength > 1 && (
              <Button
                type="submit"
                onClick={() => console.log("clicked", isSubmitting)}
                disabled={isSubmitting || !atleastOneFilled}
                className="mt-1 rounded-lg px-2 py-2 font-bold duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update
              </Button>
            )}
          </div>
          {isSeller && (
            <div className="flex flex-col gap-2">
              <label className="w-fit pt-6">Description</label>
              <p className="py-2">{description}</p>
            </div>
          )}
        </div>
      </Form>
      {!isSeller && (
        <CircleUserRound size={300} color="#d1d5db" strokeWidth={1.25} />
      )}
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);

  return null;
}

const customStyles = {
  outerContainer:
    "flex items-center gap-40 border-2 border-borders-primary px-16 py-8",
  h1: "w-fit border-b-2 border-b-borders-bottomBorder pb-1 ",
  form: "flex flex-col justify-between gap-10 text-text-primary",
  inputContainer: "flex max-w-fit flex-col justify-center gap-2 mt-4",
};
