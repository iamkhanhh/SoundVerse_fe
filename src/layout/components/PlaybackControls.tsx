import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Plus, XCircle, CheckCircle, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMusicStore } from "@/stores/useMusicStore";
import AddPlaylistDialog from "@/pages/playlist/AddPlaylistDialog";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
  const { playlists, fetchPlaylists, addMusicToPlaylist, isFavorite, likeSong, unlikeSong, checkLikeSong } = useMusicStore();
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; playlistId: number | null }>({ open: false, playlistId: null });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");
    if (currentSong) {
      // Kiểm tra xem bài hát hiện tại có trong danh sách yêu thích không
      if (likedSongs.includes(currentSong.id)) {
        likeSong(currentSong.id);
      }
    }
  }, [currentSong]);
  useEffect(() => {
    fetchPlaylists();
    if (currentSong) {
      checkLikeSong(currentSong.id);
    }

    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleAddToPlaylist = (playlistId: number) => {
    setConfirmDialog({ open: true, playlistId });
  };

  const confirmAddToPlaylist = async () => {
    if (!confirmDialog.playlistId || !currentSong) return;
    try {
      addMusicToPlaylist(confirmDialog.playlistId, currentSong.id);
      setConfirmDialog({ open: false, playlistId: null });
      fetchPlaylists();
      alert("Đã thêm bài hát vào playlist thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm bài hát vào playlist:", error);
      alert("Lỗi khi thêm bài hát!");
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      unlikeSong(currentSong.id);

      // Cập nhật lại localStorage để bỏ yêu thích bài hát
      const likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");
      const updatedLikedSongs = likedSongs.filter((id: number) => id !== currentSong.id);
      localStorage.setItem("likedSongs", JSON.stringify(updatedLikedSongs));
    } else {
      likeSong(currentSong.id);

      // Cập nhật lại localStorage để thêm bài hát vào danh sách yêu thích
      const likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");
      likedSongs.push(currentSong.id);
      localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    }
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* Song details */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img src={currentSong.thumbnail} alt={currentSong.title} className="w-14 h-14 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">{currentSong.title}</div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">{currentSong.artist}</div>
              </div>
            </>
          )}
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button size="icon" variant="ghost" className="hidden sm:inline-flex hover:text-white text-zinc-400">
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="ghost" className="hidden sm:inline-flex hover:text-white text-zinc-400">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              defaultValue={[75]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>

        {/* Volume & Playlist Controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          {/* Playlist Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
                <ListMusic className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-700">
              <DialogHeader className={undefined}>
                <DialogTitle className={undefined}>Add to Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {Array.isArray(playlists) && playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <Button
                      key={playlist.id}
                      variant="outline"
                      className="w-full text-left"
                      onClick={() => handleAddToPlaylist(playlist.id)}
                    >
                      {playlist.title}
                    </Button>
                  ))
                ) : (
                  <div>No playlists available</div>
                )}
                <div className="flex items-center gap-2">
                  <AddPlaylistDialog />
                </div>
              </div>
              <DialogFooter className={undefined}>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className={`hover:text-white text-zinc-400 ${isFavorite ? "text-red-500" : ""}`}
            onClick={toggleFavorite}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "red" : "none"} />
          </Button>

          {/* Xác nhận thêm bài hát vào Playlist */}
          {confirmDialog.open && (
            <Dialog open={confirmDialog.open} onOpenChange={() => setConfirmDialog({ open: false, playlistId: null })}>
              <DialogContent className="bg-zinc-900 border-zinc-700">
                <DialogHeader className={undefined}>
                  <DialogTitle className={undefined}>Xác nhận thêm bài hát</DialogTitle>
                </DialogHeader>
                <p>Bạn có chắc chắn muốn thêm <b>{currentSong?.title}</b> vào playlist này?</p>
                <DialogFooter className="flex gap-2">
                  <Button onClick={confirmAddToPlaylist} className="bg-emerald-500">
                    <CheckCircle className="h-4 w-4 mr-2" /> Xác nhận
                  </Button>
                  <Button variant="destructive" onClick={() => setConfirmDialog({ open: false, playlistId: null })}>
                    <XCircle className="h-4 w-4 mr-2" /> Hủy
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
              <Volume1 className="h-4 w-4" />
            </Button>
            <Slider
              value={[volume]}
              defaultValue={[75]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlaybackControls;
