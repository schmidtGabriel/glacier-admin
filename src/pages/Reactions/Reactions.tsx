import { Eye, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactionStatusEnum,
  ReactionStatusLabel,
} from "../../enums/ReactionStatusEnum";
import { VideoTypeLabel } from "../../enums/VideoTypeEnum";
import { listReactions } from "../../services/reactions/listReactions";
import { selectSessionUser } from "../../store/reducers/session";
import { useAppSelector } from "../../store/store";

export default function Reactions() {
  const [reactions, setReactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const logUser = useAppSelector(selectSessionUser);
  useEffect(() => {
    async function fetchReactions() {
      setLoading(true);
      const data = await listReactions(logUser);
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
      <table className="table-auto w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Title
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Video Path
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              User
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Status
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Type
            </th>
            <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              Due date
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
          {reactions.length === 0 && (
            <tr>
              <td colSpan={9} className="p-4 text-center">
                No reactions found
              </td>
            </tr>
          )}
          {reactions.map((item) => (
            <tr
              key={item.uuid}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="p-4">{item.title || "—"}</td>
              <td className="p-4">{item.url || "—"}</td>
              <td className="p-4">{item.user.name}</td>
              <td className="p-4">
                {item.status in ReactionStatusEnum
                  ? ReactionStatusLabel[
                      item.status as keyof typeof ReactionStatusLabel
                    ]
                  : "Unknown"}
              </td>
              <td className="p-4">
                {item.type_video in VideoTypeLabel
                  ? VideoTypeLabel[
                      item.type_video as keyof typeof VideoTypeLabel
                    ]
                  : "Unknown"}
              </td>
              <td className="p-4">{item.due_date}</td>
              <td className="p-4">{item.created_at}</td>
              <td className="p-4 flex flex-row gap-2">
                <button
                  onClick={() => navigate(`/reactions/edit?uuid=${item.uuid}`)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200/20 rounded"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() =>
                    navigate(`/reactions/detail?uuid=${item.uuid}`)
                  }
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200/20 rounded"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
