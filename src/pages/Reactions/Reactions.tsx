import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listReactions } from "../../services/reactions/ListReactions";

export default function Reactions() {
  const [reactions, setReactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReactions() {
      setLoading(true);
      const data = await listReactions();
      setReactions(data);
      setLoading(false);
    }

    fetchReactions();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/reactions/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Reaction
        </button>
      </div>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="p-3">URL</th>
            <th className="p-3">User</th>
            <th className="p-3">status</th>
            <th className="p-3">Due_date</th>
            <th className="p-3">Created_at</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reactions.map((item) => (
            <tr
              key={item.uuid}
              className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
            >
              <td className="p-3">{item.url || "—"}</td>
              <td className="p-3">{item.user.name}</td>
              <td className="p-3">{item.status == 10 ? "User" : "Admin"}</td>
              <td className="p-3">{item.due_date}</td>
              <td className="p-3">{item.created_at}</td>
              <td className="p-3">
                <button
                  onClick={() => navigate(`/reactions/edit?uuid=${item.uuid}`)}
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
