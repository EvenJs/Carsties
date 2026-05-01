"use client";

import { Button, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import Input from "../components/Input";
import { useEffect } from "react";

export default function AuctionForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    setFocus("make");
  }, [setFocus]);

  function onSubmit(data: FieldValues) {
    console.log(data);
  }
  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="make"
        label="Make"
        control={control}
        rules={{ required: "Make is quired!" }}
      />
      <Input
        name="model"
        label="Model"
        control={control}
        rules={{ required: "Model is required" }}
      />
      <Input
        name="color"
        label="Color"
        control={control}
        rules={{ required: "Color is required" }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          name="year"
          label="Year"
          type="number"
          control={control}
          rules={{ required: "Year is required" }}
        />
        <Input
          name="mileage"
          label="Mileage"
          control={control}
          rules={{ required: "Mileage is required" }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          name="reservePrice"
          label="Reserve Price(enter 0 for no reserve)"
          type="number"
          control={control}
          rules={{ required: "Reserve price is required" }}
        />
        <Input
          name="auctionEnd"
          label="Auction End Date/Time"
          type="datetime-local"
          control={control}
          rules={{ required: "Auction end date is required" }}
        />
      </div>
      <div className="flex justify-between">
        <Button color="alternative" onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button
          outline
          color="green"
          disabled={!isDirty || !isValid}
          type="submit"
        >
          {isSubmitting && <Spinner size="sm" light={true} />}
          Submit
        </Button>
      </div>
    </form>
  );
}
