import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listUsers } from "../../services/user/ListUsers";

// type User = {
//   uuid: string;
//   email: string | null;
//   name: string | null;
//   role: number;
//   disabled: boolean;
// };

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const usersData = await listUsers();
      setUsers(usersData);
      setLoading(false);
    }

    fetchUsers();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/users/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Reaction
        </button>
      </div>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr
              key={item.uuid}
              className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
            >
              <td className="p-3">{item.name || "—"}</td>
              <td className="p-3">{item.email}</td>
              <td className="p-3">{item.role == 10 ? "User" : "Admin"}</td>
              <td className="p-3">
                <button
                  onClick={() => navigate(`/users/edit?uuid=${item.uuid}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
