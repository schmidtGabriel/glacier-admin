import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import getReaction from "../../services/reactions/getReaction";
import { saveReaction } from "../../services/reactions/saveReaction";
import { updateReaction } from "../../services/reactions/updateReaction";
import { listUsers } from "../../services/users/ListUsers";

type ReactionFormData = {
  user: string;
  title: string;
  url: string;
  status: string;
  type_video:string;
  due_date: string;
};

export default function ReactionForm() {
  const { register, handleSubmit, reset } = useForm<ReactionFormData>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get("uuid");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedReaction, setSelectedReaction] = useState<any>(null);

  const fetchReaction = async (uuid?: string) => {
    if (!uuid) return;

    setLoading(true);
    getReaction(uuid)
      .then((reaction) => {
        if (reaction) {
          setSelectedReaction(reaction);
          reset({
            user: reaction.user,
            title: reaction.title,
            url: reaction.url,
            status: reaction.status,
            type_video: reaction.type_video,
            due_date: reaction.due_date?.toDate
              ? reaction.due_date.toDate().toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
          });
        } else {
          console.error("Reaction not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching reaction:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUsers = async () => {
    const res = await listUsers();

    if (res) {
      setUsers(res);
    }
  };

  const onSubmit = (data: ReactionFormData) => {
    console.log("Submitted data:", data);
    if (!uuid) {
      saveReaction(data);
    } else {
      updateReaction(data, selectedReaction);
    }
    // TODO: send data to Firebase
    navigate("/reactions");
  };

  useEffect(() => {
    Promise.all([getUsers(), fetchReaction(uuid ?? undefined)]);
  }, [uuid]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Create Reaction</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2">
          User:
          <select
            {...register("user", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.uuid} value={user.uuid}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

           <label className="block mb-2">
          Title:
          <input
            {...register("title", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Video URL:
          <input
            {...register("url", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="https://example.com"
          />
        </label>
         <label className="block mb-2 mt-4">
          Video Type:
          <select
            {...register("type_video", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="">Select type</option>
            <option value="1">Video Link</option>
            <option value="2">Social Video</option>
          </select>
        </label>
        <label className="block mb-2 mt-4">
          Status:
          <select
            {...register("status", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="">Select status</option>
            <option value="0">Pending</option>
            <option value="10">Approved</option>
            <option value="-10">Rejected</option>
          </select>
        </label>
        <label className="block mb-2 mt-4">
          Due Date:
          <input
            type="datetime-local"
            {...register("due_date", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
            min={new Date().toISOString().slice(0, 16)}
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
