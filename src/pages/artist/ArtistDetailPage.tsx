import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";
import { useUserStore } from "@/stores/useUserStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play, Pause, Clock } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useNavigate } from "react-router-dom";

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { fetchArtistDetails, artistDetails, isLoading } = useMusicStore();
  const { isFollow, followArtist, unfollowArtist, checkFollowArtist } = useUserStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay, playAlbum } = usePlayerStore();
  const [artist, setArtist] = useState<any>(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (artistId) {
      fetchArtistDetails(Number(artistId));
      checkFollowArtist(Number(artistId));
    }
  }, [artistId]);

  useEffect(() => {
    if (artistDetails) {
      setArtist(artistDetails);
    }
  }, [artistDetails]);

  const toggleFollow = () => {
    if (artistId) {
      isFollow ? unfollowArtist(Number(artistId)) : followArtist(Number(artistId));
    }
  };

  const handlePlayArtistSongs = () => {
    if (artist?.songs) {
      playAlbum(artist.songs, 0); // Start playing the artist's songs from the beginning
    }
  };

  const handlePlayPause = (song: any) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // mm:ss
  };

  if (isLoading) {
    return <div className="text-center text-white mt-20">Loading...</div>;
  }

  if (!artist) {
    return <div className="text-center text-white mt-20">Artist not found</div>;
  }

  return (
    <div className="p-6 text-white bg-gradient-to-b from-neutral-900 to-black min-h-screen">
      <ScrollArea className="h-[calc(100vh-250px)] overflow-y-auto"
        style={{
          scrollbarWidth: 'thin', /* Dùng cho Firefox */
          scrollbarColor: '#0f0f0f transparent' /* Màu thanh cuộn */
        }}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <img
            src={artist.profilePicImage || "/default_avatar_user.jpg"}
            alt={artist.username}
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />
          <div>
            <h1 className="text-5xl font-bold">{artist.username}</h1>
            
            <div className="mt-4 flex gap-4">
              {/* Nút Follow */}
              <button
                onClick={toggleFollow}
                className="border px-6 py-2 rounded-full hover:bg-white/10 transition"
              >
                {isFollow ? "Đang theo dõi" : "Theo dõi"}
              </button>

              {/* Nút Play */}
              <button
                onClick={handlePlayArtistSongs}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500
                 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying && artist.songs?.some((song) => song.id === currentSong?.id) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Popular Songs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular</h2>
          <div className="bg-black/20 backdrop-blur-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5 rounded-md group cursor-pointer">
              <div>#</div>
              <div>Title</div>
              <div>Released Date</div>
              <div>
                <Clock className="h-4 w-4" />
              </div>
            </div>
            {/* Songs List */}
            <div className="px-6">
              <div className="space-y-2 py-4">
                {artist.songs?.map((song: any, index: number) => {
                  const isCurrentSong = currentSong?.id === song.id;
                  return (
                    <div
                      key={song.id}
                      onClick={() => handlePlayPause(song)}
                      className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                    >
                      <div className="flex items-center justify-center">
                        {isCurrentSong && isPlaying ? (
                          <div className="size-4 text-green-500">♫</div>
                        ) : (
                          <span className="group-hover:hidden">{index + 1}</span>
                        )}
                        {!isCurrentSong && (
                          <Play className="h-4 w-4 hidden group-hover:block" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <img src={song.thumbnail || "/default_album.jpg"} 
                        alt={song.title} 
                        className='size-10 rounded object-cover' 
                        />
                        <div>
                          <div className="font-medium text-white">{song.title}</div>
                          <div>{song.artist}</div>
                        </div>
                      </div>

                      <div className="flex items-center">{song.createdAt?.split("T")[0]}</div>
                      <div className="flex items-center">{formatDuration(song.length)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Albums */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Albums</h2>
          </div>

          {artist.albums && artist.albums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {artist.albums.map((album: any) => (
                <div key={album.id} 
                className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
                onClick={() => navigate(`/albums/${album.id}`)}
                >
                  <div className="relative mb-4">
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={album.thumbnail}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                    {/* Tên album */}
                    <h3 className="font-medium text-center mb-1">{album.title}</h3>

                    {/* Nghệ sĩ */}
                    <p className="text-sm text-gray-400 text-center">{album.artist}</p>
                  
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Chưa có album nào.</p>
          )}
        </div>

      </ScrollArea>
    </div>
  );
};

export default ArtistDetailPage;
  