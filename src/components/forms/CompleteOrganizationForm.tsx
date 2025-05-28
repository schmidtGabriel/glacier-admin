import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { UserResource } from "../../resources/UserResource";
import { listUsers } from "../../services/users/listUsers";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Select } from "../ui/Select";

interface CompleteOrganizationProps {
  onSubmit: (data: { organization: string; members: string[] }) => void;
  goBack?: () => void;
}

export const CompleteOrganizationForm: React.FC<CompleteOrganizationProps> = ({
  onSubmit,
  goBack,
}) => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<{
    name: string;
    members: string[];
  }>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserResource[]>([]);

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
    reset(); // Reset form fields
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
      <div className="flex flex-row items-center justify-start gap-4 mb-4">
        <h1 className="text-2xl font-bold">Complete Your Organization</h1>
      </div>

      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div>
          <div>
            <Input
              label="Organization Name"
              type="name"
              placeholder="Organization Name"
              error={errors.name?.message}
              autoComplete="name"
              {...register("name", {
                required: "Name is required",
              })}
            />
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
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
        <div className="mt-6 flex justify-between items-center">
          {goBack && (
            <Button variant="outline" className="" onClick={() => goBack()}>
              Back
            </Button>
          )}

          <Button
            type="submit"
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
