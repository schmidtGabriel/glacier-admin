import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getReaction from "../../services/reactions/getReaction";

export default function ReactionDetail() {
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get("uuid");
  useEffect(() => {
    const fetchData = async () => {
      if (!uuid) return;
      setLoading(true);

      try {
        const reactionData = await getReaction(uuid);
		console.log(reactionData);
        setReaction(reactionData);
       
      } catch (error) {
        console.error("Error loading reaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!reaction) return <p className="p-4">Reaction not found.</p>;

  return (
	<div>

      <button
        onClick={() => navigate("/reactions")}
        className="cursor-pointer mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back 
      </button>
 <div className="max-w-xl mx-auto mt-8 p-4 bg-white dark:bg-slate-800 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Reaction Details</h1>
      <div className="mb-2"><strong>User:</strong> {reaction.user.name}</div>
      <div className="mb-2"><strong>Title:</strong> {reaction.title}</div>
      <div className="mb-2"><strong>Video Type:</strong> {reaction.type_video}</div>
      <div className="mb-2"><strong>Status:</strong> {reaction.status}</div>
      <div className="mb-2"><strong>Due Date:</strong> {reaction.due_date?.toDate ? reaction.due_date.toDate().toLocaleString() : reaction.due_date}</div>
     
    </div>

	<div className="flex flex-col max-w-2xl mx-auto mb-4">
		 {(reaction.video_url || reaction.recored_url) && (
        <div className="mt-6">
          <strong className="block mb-2">Video Previews:</strong>
          <div className="flex flex-row gap-4">
            {reaction.video_url && (
              <div className="flex-1 ">
                <video
                  src={String(reaction.video_url)}
                  controls
                  className="max-w-[100%] max-h-[500px] rounded"
                  onError={(e) => { const target = e.target as HTMLVideoElement; target.onerror = null; target.style.display = 'none'; }}
                />
                <a
                  href={String(reaction.video_url)}
                  download
                  className="mt-2 bg-blue-600 hover:bg-blue-800 text-white flex flex-row gap-2 items-center w-fit px-2 py-1 rounded"
                  aria-label="Download Video"
                >
                  <div>Download</div> 
                  <Download className="w-5 h-5" />
                </a>
              </div>
            )}
            {reaction.recorded_url && (
              <div className="flex-1">
                <video
                  src={String(reaction.recorded_url)}
                  controls
                  className="max-w-[100%] max-h-[500px] rounded"
                  onError={(e) => { const target = e.target as HTMLVideoElement; target.onerror = null; target.style.display = 'none'; }}
                />
                <a
                  href={String(reaction.recorded_url)}
                  download
                  className="mt-2 bg-blue-600 hover:bg-blue-800 text-white flex flex-row gap-2 items-center w-fit px-2 py-1 rounded"
                  aria-label="Download Video"
                >
                  <div>Download</div> 
                  <Download className="w-5 h-5" />
                </a>
              </div>
            )}

              {reaction.selfie_url && (
              <div className="flex-1">
                <video
                  src={String(reaction.selfie_url)}
                  controls
                  className="max-w-[100%] max-h-[500px] rounded"
                  onError={(e) => { const target = e.target as HTMLVideoElement; target.onerror = null; target.style.display = 'none'; }}
                />
                <a
                  href={String(reaction.selfie_url)}
                  download
                  className="mt-2 bg-blue-600 hover:bg-blue-800 text-white flex flex-row gap-2 items-center w-fit px-2 py-1 rounded"
                  aria-label="Download Video"
                >
                  <div>Download</div> 
                  <Download className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
		</div>
	</div>
   
  );
}