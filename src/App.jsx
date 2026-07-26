import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { db } from "./firebaseConfig";
import { fetchTrendingMovies } from "./tmdbService";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import "./index.css";

export default function App() {
  const [playMode, setPlayMode] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [role, setRole] = useState(null);
  const [inSession, setInSession] = useState(false);
  const [loading, setLoading] = useState(false);

  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hostLikes, setHostLikes] = useState([]);
  const [guestLikes, setGuestLikes] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const controls = useAnimation();

  // Resolves public assets seamlessly on GitHub Pages base subpaths
  const baseUrl = import.meta.env.BASE_URL || "/";

  const startSoloMode = async () => {
    setLoading(true);
    setPlayMode("solo");
    const fetched = await fetchTrendingMovies(1);
    setMovies(fetched || []);
    setInSession(true);
    setLoading(false);
  };

  const handleCreateRoom = async () => {
    if (!roomCode.trim()) return alert("Please enter a room code!");
    setLoading(true);
    setPlayMode("couple");
    try {
      const roomRef = doc(db, "sessions", roomCode.toLowerCase().trim());
      await setDoc(roomRef, { hostLikes: [], guestLikes: [] });
      setRole("host");
      setInSession(true);
    } catch (err) {
      console.error(err);
      alert("Error creating room ledger.");
    }
    setLoading(false);
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return alert("Please enter a room code!");
    setLoading(true);
    setPlayMode("couple");
    try {
      const roomRef = doc(db, "sessions", roomCode.toLowerCase().trim());
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        setRole("guest");
        setInSession(true);
      } else {
        alert("Room code not found!");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!inSession || playMode === "solo") return;

    const loadMovies = async () => {
      const fetched = await fetchTrendingMovies(1);
      setMovies(fetched || []);
    };
    loadMovies();

    const roomRef = doc(db, "sessions", roomCode.toLowerCase().trim());
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const currentHostLikes = data.hostLikes || [];
        const currentGuestLikes = data.guestLikes || [];
        
        setHostLikes(currentHostLikes);
        setGuestLikes(currentGuestLikes);

        const common = currentHostLikes.filter(id => currentGuestLikes.includes(id));
        if (common.length > 0 && movies.length > 0) {
          const target = movies.find(m => m.id === common[common.length - 1]);
          if (target) {
            setMatchedMovie(target);
            setShowReceipt(true);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [inSession, roomCode, playMode, movies.length]);

  const executeSwipe = async (liked) => {
    if (currentIndex >= movies.length) return;
    const movie = movies[currentIndex];

    if (playMode === "solo") {
      if (liked) {
        setMatchedMovie(movie);
        setShowReceipt(true);
      }
    } else {
      if (liked) {
        const roomRef = doc(db, "sessions", roomCode.toLowerCase().trim());
        const field = role === "host" ? "hostLikes" : "guestLikes";
        await updateDoc(roomRef, { [field]: arrayUnion(movie.id) });
      }
    }
    setCurrentIndex(prev => prev + 1);
  };

  const triggerButtonSwipe = (liked) => {
    const targetX = liked ? 450 : -450;
    controls.start({ x: targetX, opacity: 0, rotate: liked ? 15 : -15, transition: { duration: 0.35 } }).then(() => {
      executeSwipe(liked);
      x.set(0);
      controls.set({ x: 0, opacity: 1, rotate: 0 });
    });
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 120) {
      controls.start({ x: 500, opacity: 0 }).then(() => {
        executeSwipe(true);
        x.set(0);
        controls.set({ x: 0, opacity: 1 });
      });
    } else if (info.offset.x < -120) {
      controls.start({ x: -500, opacity: 0 }).then(() => {
        executeSwipe(false);
        x.set(0);
        controls.set({ x: 0, opacity: 1 });
      });
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  if (!inSession) {
    return (
      <div 
        className="landing-stage-wrapper"
        style={{ backgroundImage: `url('${baseUrl}background.png')` }}
      >
        <motion.div 
          className="landing-form-glass"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="main-logo-text">movie night</h1>
          <p className="sub-tagline">Swipe together, match immediately, and print out your movie receipt! 🎟️✨</p>
          
          <button onClick={startSoloMode} disabled={loading} className="btn-solo-launcher">
            🍿 Solo Mode (Just Me)
          </button>
          
          <div className="separator-line"><span>or sync screens</span></div>

          <input 
            type="text" 
            placeholder="enter room code..." 
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="room-input-box"
          />
          
          <div className="dual-action-row">
            <button onClick={handleCreateRoom} disabled={loading} className="btn-create">Create Room</button>
            <button onClick={handleJoinRoom} disabled={loading} className="btn-join">Join Room</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showReceipt && matchedMovie) {
    return (
      <div className="app-workspace-standard-bg">
        <div className="printer-assembly-deck">
          <div 
            className="hardware-print-casing animated-rollout"
            style={{ backgroundImage: `url('${baseUrl}result.png')` }}
          >
            <div className="receipt-text-overlay">
              <h2 className="ticket-title">MOVIENIGHT, INC.</h2>
              <p className="ticket-subtitle">MODE: {playMode.toUpperCase()}</p>
              {playMode === "couple" && <p className="ticket-subtitle">ROOM: {roomCode.toUpperCase()}</p>}
              <p className="ticket-subtitle">{new Date().toLocaleDateString()}</p>
              
              <div className="ticket-dashed-bar">- - - - - - - - - - -</div>
              <div className="ticket-table-hdr"><span>QTY / ITEM SELECTION</span><span>COST</span></div>
              <div className="ticket-dashed-bar">- - - - - - - - - - -</div>
              
              <div className="ticket-data-row">
                <span className="ticket-movie-title">1x {matchedMovie.title.toUpperCase()}</span>
                <span>$0.00</span>
              </div>
              <p className="ticket-nested-meta">RATING: ⭐ {matchedMovie.rating}/10</p>
              <p className="ticket-nested-meta">YEAR: {matchedMovie.releaseDate ? matchedMovie.releaseDate.split("-")[0] : "N/A"}</p>

              <div className="ticket-data-row"><span>2x SNUGGLE BLANKETS</span><span>INCL</span></div>
              <div className="ticket-dashed-bar">- - - - - - - - - - -</div>
              <div className="ticket-data-row font-bold"><span>TOTAL AMT</span><span>$0.00</span></div>
              <div className="ticket-dashed-bar">- - - - - - - - - - -</div>
              
              <div className="ticket-footer">
                <h3>🎬 TICKET VALIDATED 🎬</h3>
                <div className="ticket-barcode">||||| | ||||| ||</div>
                <p className="ticket-serial">ID: #{matchedMovie.id}</p>
              </div>

              <motion.div 
                className="receipt-ink-stamp"
                initial={{ scale: 2.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9, rotate: -12 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                MATCHED!
              </motion.div>
            </div>
          </div>
          
          <div className="control-button-deck">
            <button onClick={() => window.print()} className="action-btn-print">🖨️ Save or Print Receipt</button>
            <button onClick={() => setShowReceipt(false)} className="action-btn-dismiss">💖 Keep Swiping</button>
          </div>
        </div>
      </div>
    );
  }

  const activeMovie = movies[currentIndex];
  return (
    <div className="app-workspace-standard-bg">
      <header className="workspace-navbar">
        <span>Mode: <strong>{playMode === "solo" ? "Solo Play" : `Room: ${roomCode}`}</strong></span>
        {playMode === "couple" && (
          <span className="badge-likes">Likes: {role === "host" ? hostLikes.length : guestLikes.length}</span>
        )}
      </header>
      
      <main className="deck-viewport">
        {loading ? (
          <div className="status-label">Loading movie catalog... 🍿</div>
        ) : activeMovie ? (
          <div className="card-container-relative">
            <motion.div 
              className="animated-swipe-card" 
              style={{ x, rotate, opacity }}
              drag="x" 
              dragConstraints={{ left: 0, right: 0 }} 
              onDragEnd={handleDragEnd}
              animate={controls} 
              whileDrag={{ scale: 1.02, cursor: "grabbing" }}
            >
              <div className="card-poster-frame">
                <img src={activeMovie.posterUrl} alt={activeMovie.title} draggable="false" />
                <div className="card-rating-tag">⭐ {activeMovie.rating}</div>
              </div>
              <div className="card-body-metadata">
                <h2>{activeMovie.title}</h2>
                <p>{activeMovie.overview || "No plot overview available for this title."}</p>
              </div>
              <div className="card-button-footer-row">
                <button onClick={() => triggerButtonSwipe(false)} className="btn-footer-skip">❌ Skip</button>
                <button onClick={() => triggerButtonSwipe(true)} className="btn-footer-like">💖 Like</button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="status-label">🏁 End of movie deck! Waiting for partner matches...</div>
        )}
      </main>
    </div>
  );
}
