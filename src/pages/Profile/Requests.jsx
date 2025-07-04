import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../services/auth.service";
import { setRequests } from "../../store/requestsSlice";
import { useToast } from "../../hooks/useToast";

export default function Requests() {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request.requests);
  const { success, error } = useToast();
  const [loadingId, setLoadingId] = React.useState(null);

  console.log(requests);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await authService.getReceivedRequests();
        console.log(data.connectionRequests, "checking");
        dispatch(setRequests(data?.connectionRequests));
      } catch {
        dispatch(setRequests([]));
      }
    };
    fetchRequests();
  }, [dispatch]);

  // Handler for reviewing a request
  const handleReview = async (status, requestId) => {
    const action = status === "accepted" ? "Accept" : "Reject";
    if (
      !window.confirm(
        `Are you sure you want to ${action.toLowerCase()} this request?`
      )
    )
      return;
    setLoadingId(requestId + status);
    try {
      await authService.reviewRequest(status, requestId);
      dispatch(setRequests(requests.filter((r) => r._id !== requestId)));
      success(`Request ${action.toLowerCase()}ed successfully!`);
    } catch {
      error(`Failed to ${action.toLowerCase()} request.`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-start py-10 bg-base-200'>
      <h1 className='text-3xl font-bold mb-8'>My Requests</h1>
      {!requests || requests.length === 0 ? (
        <div className='text-lg text-gray-400 mt-20'>
          No requests yet. You're all caught up!
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl'>
          {requests.map((req) => (
            <div
              key={req.fromUserId._id}
              className='bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-purple-100'
            >
              <img
                src={
                  req.fromUserId.photoUrl ||
                  "https://via.placeholder.com/150x150?text=User"
                }
                alt={req.fromUserId.first_name || "User"}
                className='w-24 h-24 rounded-full object-cover border-4 border-purple-300 shadow mb-4'
              />
              <h2 className='text-xl font-bold text-gray-900 mb-1 text-center'>
                {req.fromUserId.first_name} {req.fromUserId.last_name}
              </h2>
              <p className='text-indigo-500 text-center mb-2'>
                {req.fromUserId.email}
              </p>
              <div className='text-gray-600 text-center mb-2'>
                <span className='font-semibold'>Location:</span>{" "}
                {req.fromUserId.location || "N/A"}
              </div>
              {req.fromUserId.skills && req.fromUserId.skills.length > 0 && (
                <div className='flex flex-wrap justify-center gap-2 mb-2'>
                  {req.fromUserId.skills.map((skill, idx) => (
                    <span
                      key={skill + idx}
                      className='bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {req.fromUserId.about && (
                <p className='italic text-gray-500 text-sm text-center mt-2'>
                  {req.fromUserId.about}
                </p>
              )}
              {/* Accept/Reject Buttons */}
              <div className='flex gap-4 mt-6 w-full justify-center'>
                <button
                  className={`btn btn-success rounded-full px-6 font-semibold shadow hover:scale-105 transition ${
                    loadingId === req._id + "accepted" ? "loading" : ""
                  }`}
                  onClick={() => handleReview("accepted", req._id)}
                  disabled={loadingId !== null}
                >
                  Accept
                </button>
                <button
                  className={`btn btn-error rounded-full px-6 font-semibold shadow hover:scale-105 transition ${
                    loadingId === req._id + "rejected" ? "loading" : ""
                  }`}
                  onClick={() => handleReview("rejected", req._id)}
                  disabled={loadingId !== null}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
