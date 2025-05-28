import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
import { listUsers } from "../../services/users/listUsers";
import { selectSessionUser } from "../../store/reducers/session";
import { useAppSelector } from "../../store/store";

export default function Users() {
  const loggedUser = useAppSelector(selectSessionUser);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchUsers = async () => {
    setLoading(true);
    const usersData = await listUsers(loggedUser);
    setUsers(() => usersData);
    setLoading(false);
  };

  useEffect(() => {
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
          Add User
        </button>
      </div>
      <table className="table-auto w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Name
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Email
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Role
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Created at
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="p-3 text-center">
                No users found
              </td>
            </tr>
          )}
          {users.map((item) => (
            <tr
              key={item.uuid}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="p-4">{item.name || "—"}</td>
              <td className="p-4">{item.email}</td>
              <td className="p-4">{UserRoleEnum[item.role]}</td>
              <td className="p-4">{item.created_at}</td>

              <td className="p-4 flex-1">
                <button
                  onClick={() => navigate(`/users/edit?uuid=${item.uuid}`)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200/20 rounded"
                >
                  <Pencil size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
