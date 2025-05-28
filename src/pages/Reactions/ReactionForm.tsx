import { useEffect, useMemo, useState } from "react";
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReactionFormData>();
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

  const onSubmit = async (data: ReactionFormData) => {
    if (!uuid) {
      await saveReaction({ logUser, data });
    } else {
      await updateReaction({ ...data, uuid });
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

  useMemo(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">
        {uuid ? "Edit Reaction" : "Create Reaction"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2">
          User:
          <select
            {...register("user", { required: "User is required" })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.uuid} value={user.uuid}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.user && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.user.message}
            </p>
          )}
        </label>

        <label className="block mb-2">
          Title:
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.title.message}
            </p>
          )}
        </label>

        <label className="block mb-2 mt-4">
          Video Type:
          <select
            {...register("type_video", { required: "Video type is required" })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="">Select type</option>
            {enumToArray(VideoTypeEnum).map((item) => (
              <option key={item.id} value={item.id}>
                {VideoTypeLabel[item.id as keyof typeof VideoTypeLabel]}
              </option>
            ))}
          </select>
          {errors.type_video && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.type_video.message}
            </p>
          )}
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
                setValue("url", fileName);
                setValue("video_duration", fileDuration);
                setVideoPreview(fileUrl); // Set the video preview URL
                // You might want to update the URL field with the file name
              }}
            />
          </label>
        )}

        <div className="flex flex-row gap-4 mt-4">
          <label className="block flex-1">
            Video URL:
            <input
              {...register("url", { required: "Video URL is required" })}
              className="w-full border border-gray-300 p-2 rounded mt-1 disabled:bg-gray-200"
              placeholder="https://example.com"
              disabled={!!videoPreview} // Disable if video preview is set
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                {errors.url.message}
              </p>
            )}
          </label>
          <label className="block flex-1">
            Video Duration:
            <input
              {...register("video_duration", {
                required: "Video Duration is required",
              })}
              className="w-full border border-gray-300 p-2 rounded mt-1  disabled:bg-gray-200"
              placeholder="0:00"
              disabled={!!videoPreview} // Disable if video preview is set
            />
            {errors.video_duration && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                {errors.video_duration.message}
              </p>
            )}
          </label>
        </div>

        {logUser && logUser.role === UserRoleEnum.Admin && (
          <label className="block mb-2 ">
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
        )}

        <label className="block mb-2 mt-4">
          Status:
          <select
            {...register("status", { required: "Status is required" })}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          >
            <option value="">Select status</option>
            <option value="0">Pending</option>
            <option value="10">Approved</option>
            <option value="-10">Rejected</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
              {errors.status.message}
            </p>
          )}
        </label>
        <label className="block mb-2 mt-4">
          Due Date:
          <input
            type="datetime-local"
            {...register("due_date")}
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
