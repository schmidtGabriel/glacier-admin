import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
import enumToArray from "../../helpers/EnumsToArray";
import getUser from "../../services/users/getUser";
import { saveUser } from "../../services/users/saveUser";
import { sendInviteFriend } from "../../services/users/sendInviteFriend";
import { updateUser } from "../../services/users/updateUser";
import { selectSessionUser } from "../../store/reducers/session";
import { useAppSelector } from "../../store/store";

type UserFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  organization?: string;
};

export default function UserForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();
  const logUser = useAppSelector(selectSessionUser);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get("uuid");
  const [loading, setLoading] = useState(false);
  // const [organizations, setOrganizations] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});

  const featchUser = async (uuid?: string) => {
    if (!uuid) return;

    setLoading(true);
    getUser(uuid)
      .then((item: any) => {
        if (item) {
          reset({
            name: item.name,
            email: item.email,
            password: "",
            phone: item.phone,
            role: item.role,
          });
          setUser(item);
        } else {
          console.error("User not found");
        }
      })
      .catch((error: any) => {
        console.error("Error fetching reaction:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const getOrganizations = async () => {
  //   const res = await listOrganizations();

  //   if (res) {
  //     setOrganizations(res);
  //   }
  // };

  useEffect(() => {
    Promise.all([featchUser(uuid ?? undefined)]);
  }, [uuid]);

  const onSubmit = async (data: UserFormData) => {
    if (!uuid) {
      await saveUser({ logUser, data });
    } else {
      await updateUser({ ...data, uuid });
    }
    // TODO: send data to Firebase
    navigate("/users");
  };

  const inviteFriend = async () => {
    if (!uuid) return;

    await sendInviteFriend({ userId: logUser.uuid, user: user });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">
        {uuid ? "Edit User" : "Create User"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2">
          Name:
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.name.message}
            </p>
          )}
        </label>

        <label className="block mb-2">
          Phone:
          <input
            {...register("phone", { required: "Phone is required" })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter phone"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.phone.message}
            </p>
          )}
        </label>
        <label className="block mb-2 mt-4">
          Email:
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.email.message}
            </p>
          )}
        </label>

        <label className="block mb-2 mt-4">
          Password:
          <input
            type="password"
            {...register("password", {
              required: uuid ? false : "Password is required",
            })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter a password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.password.message}
            </p>
          )}
        </label>

        {logUser && logUser.role === UserRoleEnum.Admin && (
          <label className="block mb-2 mt-4">
            Role:
            <select
              {...register("role", {
                required:
                  logUser.role === UserRoleEnum.Admin
                    ? "Role is required"
                    : false,
              })}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            >
              <option value="">Select a user</option>
              {enumToArray(UserRoleEnum).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                {errors.role.message}
              </p>
            )}
          </label>
        )}

        {/* {logUser && logUser.role === UserRoleEnum.Admin && (
          <label className="block mb-2">
            Organization:
            <select
              {...register("organization", {
                required:
                  logUser.role === UserRoleEnum.Admin
                    ? "Organization is required"
                    : false,
              })}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            >
              <option value="">Select a organization</option>
              {organizations.map((org) => (
                <option key={org.uuid} value={org.uuid}>
                  {org.name}
                </option>
              ))}
            </select>
            {errors.organization && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                {errors.organization.message}
              </p>
            )}
          </label>
        )} */}

        <div className="flex flex-row justify-end items-center gap-4">
          {uuid && (
            <button
              type="button"
              onClick={() => inviteFriend()}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 cursor-pointer"
            >
              Invite friend
            </button>
          )}

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
