import React, { useEffect, useState, useRef } from "react";
import { feedService } from "../../services/feed.service";
import { useToast } from "../../hooks/useToast";
import { useSelector } from "react-redux";
import { selectConnections } from "../../store/connectionSlice";

export default function Feed() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null);
  const [dragging, setDragging] = useState(false);
  const cardRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const { success, error: toastError } = useToast();

  const authData = useSelector((state) => state.auth);
  console.log(authData, "checking auth data");

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await feedService.getFeed();
        console.log("api feed cALLED", data);
        setCards(data?.users);
      } catch {
        setError("Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // Mouse event handlers
  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      if (!dragging || swiping) return;
      currentX.current = e.clientX;
      const diff = currentX.current - startX.current;
      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${diff}px) rotate(${
          diff / 20
        }deg)`;
      }
    };
    const handleMouseUp = () => {
      if (!dragging || swiping) return;
      setDragging(false);
      const diff = currentX.current - startX.current;
      if (Math.abs(diff) > 100) {
        setSwiping(true);
        setSwipeDir(diff > 0 ? "right" : "left");
        setTimeout(() => {
          setCards((prev) => prev.slice(1));
          setSwiping(false);
          setSwipeDir(null);
          if (cardRef.current) cardRef.current.style.transform = "";
        }, 300);
      } else {
        if (cardRef.current) cardRef.current.style.transform = "";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, swiping]);

  const handleTouchStart = (e) => {
    if (swiping) return;
    setSwipeDir(null);
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    currentX.current = startX.current;
  };

  const handleTouchMove = (e) => {
    if (swiping) return;
    currentX.current = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX.current - startX.current;
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${
        diff / 20
      }deg)`;
    }
  };

  const handleTouchEnd = () => {
    if (swiping) return;
    const diff = currentX.current - startX.current;
    if (Math.abs(diff) > 100) {
      setSwiping(true);
      setSwipeDir(diff > 0 ? "right" : "left");
      setTimeout(() => {
        setCards((prev) => prev.slice(1));
        setSwiping(false);
        setSwipeDir(null);
        if (cardRef.current) cardRef.current.style.transform = "";
      }, 300);
    } else {
      if (cardRef.current) cardRef.current.style.transform = "";
    }
  };

  // Like/Dislike handler
  const handleRequest = async (status, toUserId) => {
    try {
      await feedService.sendRequest(status, toUserId);
      success(
        status === "interested"
          ? "You liked this profile!"
          : "You disliked this profile."
      );
    } catch {
      toastError("Failed to send request. Please try again.");
    }
  };

  if (loading)
    return (
      <div className='flex justify-center items-center h-96'>Loading...</div>
    );
  if (error)
    return (
      <div className='flex justify-center items-center h-96 text-error'>
        {error}
      </div>
    );

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] bg-base-200'>
      <h1 className='text-3xl font-bold mb-6'>Dev Tinder Feed</h1>
      <div className='relative w-[340px] h-[480px]'>
        {cards.length === 0 && (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-base-100 rounded-xl shadow-xl'>
            <span className='text-xl font-semibold text-base-content/60'>
              No more profiles
            </span>
          </div>
        )}
        {cards
          .slice(0, 3)
          .reverse()
          .map((card, idx) => {
            const isTop = idx === 2;
            return (
              <div
                key={card._id || idx}
                ref={isTop ? cardRef : null}
                className={`absolute w-full h-full flex flex-col items-center justify-between p-0 transition-transform duration-300 border border-purple-100 shadow-2xl rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-purple-50/80 backdrop-blur-lg ${
                  isTop && swiping && swipeDir === "right"
                    ? "translate-x-[400px] rotate-12"
                    : ""
                } ${
                  isTop && swiping && swipeDir === "left"
                    ? "-translate-x-[400px] -rotate-12"
                    : ""
                }`}
                style={{ zIndex: idx + 1 }}
                onMouseDown={
                  isTop
                    ? (e) => {
                        if (swiping) return;
                        setDragging(true);
                        setSwipeDir(null);
                        startX.current = e.clientX;
                        currentX.current = e.clientX;
                      }
                    : undefined
                }
                onTouchStart={isTop ? handleTouchStart : undefined}
                onTouchMove={isTop ? handleTouchMove : undefined}
                onTouchEnd={isTop ? handleTouchEnd : undefined}
              >
                <div className='flex flex-col items-center w-full pt-8'>
                  <div className='rounded-full bg-gradient-to-tr from-purple-400 to-indigo-400 p-1 shadow-lg mb-3'>
                    <img
                      src={
                        card.photoUrl ||
                        "https://via.placeholder.com/300x300?text=Dev+Tinder"
                      }
                      alt={card.name || card.first_name || "Profile"}
                      className='w-32 h-32 rounded-full object-cover border-4 border-white'
                    />
                  </div>
                  <h2 className='text-2xl font-extrabold text-gray-900 mb-2 text-center drop-shadow-lg'>
                    {card.name || card.first_name || "Unknown"}
                  </h2>
                  {/* Skills as badges */}
                  {card.skills && card.skills.length > 0 && (
                    <div className='flex flex-wrap justify-center gap-2 mb-2 px-1'>
                      {card.skills.map(
                        (skill, idx) =>
                          idx < 5 && (
                            <span
                              key={skill + idx}
                              className='bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow'
                            >
                              {skill}
                            </span>
                          )
                      )}
                    </div>
                  )}
                </div>
                {/* About and location section with solid background for readability */}
                <div className='w-full flex-1 flex flex-col items-center justify-center px-6 pb-4'>
                  <p className='text-base text-gray-700 mb-2 line-clamp-3 text-center'>
                    {card.bio || card.about || "No bio available."}
                  </p>
                  {/* Location with icon */}
                  {card.location && (
                    <div className='flex items-center justify-center gap-2 text-sm text-purple-700 mt-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-5 h-5 text-purple-500'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9zm0-11.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z'
                        />
                      </svg>
                      {card.location}
                    </div>
                  )}
                </div>
                {/* Like/Dislike Buttons */}
                <div className='flex w-full justify-between px-8 pb-8 mt-2'>
                  <button
                    className='btn btn-outline btn-error w-28 rounded-full font-semibold border-2 border-error hover:bg-error hover:text-white transition-all duration-200 shadow'
                    onClick={async () => {
                      if (!swiping) {
                        setSwiping(true);
                        setSwipeDir("left");
                        await handleRequest("ignored", card._id);
                        setTimeout(() => {
                          setCards((prev) => prev.slice(1));
                          setSwiping(false);
                          setSwipeDir(null);
                          if (cardRef.current)
                            cardRef.current.style.transform = "";
                        }, 300);
                      }
                    }}
                    disabled={swiping}
                  >
                    Dislike
                  </button>
                  <button
                    className='btn btn-outline btn-success w-28 rounded-full font-semibold border-2 border-success hover:bg-success hover:text-white transition-all duration-200 shadow'
                    onClick={async () => {
                      if (!swiping) {
                        setSwiping(true);
                        setSwipeDir("right");
                        await handleRequest("interested", card._id);
                        setTimeout(() => {
                          setCards((prev) => prev.slice(1));
                          setSwiping(false);
                          setSwipeDir(null);
                          if (cardRef.current)
                            cardRef.current.style.transform = "";
                        }, 300);
                      }
                    }}
                    disabled={swiping}
                  >
                    Like
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
