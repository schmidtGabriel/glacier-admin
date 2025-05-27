import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { UserResource } from "../../resources/UserResource";
import { listUsers } from "../../services/users/listUsers";
import Button from "../ui/Button";
import { Select } from "../ui/Select";

interface CompleteOrganizationProps {
  onSubmit: (data: { organization: string; members: string[] }) => void;
  goBack?: () => void;
}

export const CompleteOrganizationForm: React.FC<CompleteOrganizationProps> = ({
  onSubmit,
  goBack,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const { control, handleSubmit, reset } = useForm<{
    name: string;
    members: string[];
  }>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserResource[]>([]);
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  useEffect(() => {
    const featchUsers = async () => {
      const res = await listUsers();
      setAvailableUsers(res);
    };

    featchUsers();
  }, []);

  const handleOnSubmit = (data: any) => {
    const finalData = {
      organization: data.name,
      members: selectedUsers,
    };
    onSubmit(finalData);
    setActiveStep(0); // Reset to first step after submission
    reset(); // Reset form fields
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
      <div className="flex flex-row items-center justify-start gap-4 mb-4">
        {goBack && (
          <Button variant="outline" className="" onClick={() => goBack()}>
            Back
          </Button>
        )}

        <h1 className="text-2xl font-bold">Complete Your Organization</h1>
      </div>

      <div className="flex items-center mb-6 space-x-4">
        <div
          className={`flex-1 text-center border-b-4 pb-2 cursor-pointer transition-all duration-300 ${
            activeStep === 0
              ? "border-blue-600 font-bold text-black"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveStep(0)}
        >
          Detail
        </div>
        <div
          className={`flex-1 text-center border-b-4 pb-2 transition-all duration-300 ${
            activeStep === 1
              ? "border-blue-600 font-bold text-black"
              : "border-transparent text-gray-400 opacity-50 cursor-not-allowed"
          }`}
          onClick={() => {
            if (activeStep === 1) setActiveStep(1);
          }}
        >
          Members
        </div>
      </div>

      <form onSubmit={handleSubmit(handleOnSubmit)}>
        {activeStep === 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  {...field}
                />
              )}
            />
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Members
            </label>
            <Select
              multiple
              searchable
              placeholder="Members"
              value={selectedUsers}
              onChange={(val: string | string[]) =>
                setSelectedUsers(Array.isArray(val) ? val : [val])
              }
              options={availableUsers.map((user) => ({
                id: user.uuid,
                name: user.name ?? "",
              }))}
            />
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
          {activeStep < 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
          {activeStep === 1 && (
            <Button
              type="submit"
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
