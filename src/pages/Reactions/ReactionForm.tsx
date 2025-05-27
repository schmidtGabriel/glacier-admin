import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import UploadVideo from "../../components/UploadFile";
import { UserRoleEnum } from "../../enums/UserRoleEnum";
import { VideoTypeEnum, VideoTypeLabel } from "../../enums/VideoTypeEnum";
import enumToArray from "../../helpers/EnumsToArray";
import { listOrganizations } from "../../services/organizations/listOrganizations";
import getReaction from "../../services/reactions/getReaction";
import { saveReaction } from "../../services/reactions/saveReaction";
import { updateReaction } from "../../services/reactions/updateReaction";
import { listUsers } from "../../services/users/listUsers";
import { selectSessionUser } from "../../store/reducers/session";
import { useAppSelector } from "../../store/store";

type ReactionFormData = {
  user: string;
  title: string;
  url: string;
  status: string;
  type_video: string;
  video_duration: number;
  organization?: string;
  due_date: string;
};

export default function ReactionForm() {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ReactionFormData>();
  const logUser = useAppSelector(selectSessionUser);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get("uuid");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const fetchReaction = async (uuid?: string) => {
    if (!uuid) return;

    setLoading(true);
    getReaction(uuid)
      .then((reaction) => {
        if (reaction) {
          reset({
            user: reaction.user?.uuid || reaction.user?.toString() || "",
            title: reaction.title,
            url: reaction.url,
            status: reaction.status,
            type_video: reaction.type_video,
            due_date: reaction.due_date?.toDate
              ? reaction.due_date.toDate().toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            video_duration: reaction.video_duration,
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

  const getOrganizations = async () => {
    const res = await listOrganizations();

    if (res) {
      setOrganizations(res);
    }
  };

  const getUsers = async () => {
    const res = await listUsers(logUser);

    if (res) {
      setUsers(res);
    }
  };

  const onSubmit = (data: ReactionFormData) => {
    console.log("Submitted data:", data);
    if (!uuid) {
      saveReaction({ logUser, data });
    } else {
      updateReaction({ ...data, uuid });
    }
    // TODO: send data to Firebase
    navigate("/reactions");
  };

  useEffect(() => {
    Promise.all([
      getUsers(),
      getOrganizations(),
      fetchReaction(uuid ?? undefined),
    ]);
  }, [uuid]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">
        {uuid ? "Edit Reaction" : "Create Reaction"}
      </h1>
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
        <label className="block mb-2 mt-4">
          Video Type:
          <select
            {...register("type_video", { required: true })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="">Select type</option>
            {enumToArray(VideoTypeEnum).map((item) => (
              <option key={item.id} value={item.id}>
                {VideoTypeLabel[item.id as keyof typeof VideoTypeLabel]}
              </option>
            ))}
          </select>
        </label>
        {watch("type_video") === VideoTypeEnum.SourceVideo.toString() && (
          <label className="block mb-2 mt-4">
            Video File:
            <UploadVideo
              folder="videos"
              onUploadComplete={(
                fileName: string,
                fileUrl: string,
                fileDuration: number
              ) => {
                console.log(
                  "File uploaded:",
                  fileName,
                  fileUrl,
                  "Duration:",
                  fileDuration
                );
                setValue("url", fileName);
                setValue("video_duration", fileDuration);
                setVideoPreview(fileUrl); // Set the video preview URL
                // You might want to update the URL field with the file name
              }}
            />
          </label>
        )}

        <div className="flex flex-row gap-4 mt-4">
          <label className="block">
            Video URL:
            <input
              {...register("url", { required: true })}
              className="w-full border border-gray-300 p-2 rounded mt-1 disabled:bg-gray-200"
              placeholder="https://example.com"
              disabled={!!videoPreview} // Disable if video preview is set
            />
          </label>
          <label className="block">
            Video Duration:
            <input
              {...register("video_duration", { required: true })}
              className="w-full border border-gray-300 p-2 rounded mt-1  disabled:bg-gray-200"
              placeholder="https://example.com"
              disabled={!!videoPreview} // Disable if video preview is set
            />
          </label>
        </div>

        {logUser && logUser.role === UserRoleEnum.Admin && (
          <label className="block mb-2">
            Organization:
            <select
              {...register("organization", { required: true })}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            >
              <option value="">Select a organization</option>
              {organizations.map((org) => (
                <option key={org.uuid} value={org.uuid}>
                  {org.name}
                </option>
              ))}
            </select>
          </label>
        )}

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
