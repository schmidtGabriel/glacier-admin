import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import getUser from "../../services/users/getUser";
import { saveUser } from "../../services/users/saveUser";
import { updateUser } from "../../services/users/updateUser";

type UserFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export default function UserForm() {
  const { register, handleSubmit, reset } = useForm<UserFormData>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get("uuid");
  const [loading, setLoading] = useState(false);
  const [ setSelectedUser] = useState<any>(null);

  const fetchReaction = async (uuid?: string) => {
    if (!uuid) return;

    setLoading(true);
    getUser(uuid)
      .then((item: any) => {
        if (item) {
          setSelectedUser(item);
          reset({
            name: item.name,
            email: item.email,
            password: "",
            phone: item.phone,
          });
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

  useEffect(() => {
    fetchReaction(uuid ?? undefined);
  }, [uuid]);

  const onSubmit = (data: UserFormData) => {
    if (!uuid) {
      saveUser(data);
    } else {
      updateUser({...data, uuid });
    }
    // TODO: send data to Firebase
    navigate("/users");
  };
  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">{uuid?'Edit User': 'Create User'}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2">
          Name:
          <input
            {...register("name", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter name"
          />
        </label>

        <label className="block mb-2">
          Phone:
          <input
            {...register("phone", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter phone"
          />
        </label>
        <label className="block mb-2 mt-4">
          Email:
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter email"
          />
        </label>

        <label className="block mb-2 mt-4">
          Password:
          <input
            type="password"
            {...register("password")}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter a password"
          />
        </label>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
