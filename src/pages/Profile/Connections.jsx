import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../services/auth.service";
import { setConnections, selectConnections } from "../../store/connectionSlice";

export default function Connections() {
  const dispatch = useDispatch();
  const connections = useSelector(selectConnections);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await authService.getAcceptedConnections();
        console.log(data?.data);
        dispatch(setConnections(data?.data));
      } catch {
        dispatch(setConnections([]));
      }
    };
    fetchConnections();
  }, [dispatch]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-start py-10 bg-base-200'>
      <h1 className='text-3xl font-bold mb-8'>My Connections</h1>
      {!connections || connections.length === 0 ? (
        <div className='text-lg text-gray-400 mt-20'>
          No connections yet. Start connecting with other developers!
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl'>
          {connections.map((conn) => (
            <div
              key={conn._id}
              className='bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-purple-100'
            >
              <img
                src={
                  conn.photoUrl ||
                  "https://via.placeholder.com/150x150?text=User"
                }
                alt={conn.first_name || "User"}
                className='w-24 h-24 rounded-full object-cover border-4 border-purple-300 shadow mb-4'
              />
              <h2 className='text-xl font-bold text-gray-900 mb-1 text-center'>
                {conn.first_name} {conn.last_name}
              </h2>
              <p className='text-indigo-500 text-center mb-2'>{conn.email}</p>
              <div className='text-gray-600 text-center mb-2'>
                <span className='font-semibold'>Location:</span>{" "}
                {conn.location || "N/A"}
              </div>
              {conn.skills && conn.skills.length > 0 && (
                <div className='flex flex-wrap justify-center gap-2 mb-2'>
                  {conn.skills.map((skill, idx) => (
                    <span
                      key={skill + idx}
                      className='bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {conn.about && (
                <p className='italic text-gray-500 text-sm text-center mt-2'>
                  {conn.about}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
