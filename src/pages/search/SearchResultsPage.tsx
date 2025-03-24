import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, Clock } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import React from "react";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { axiosInstance } from "@/lib/axios";
import PlayButton from "../home/components/PlayButton";
import toast from "react-hot-toast";

const SearchResultsPage = () => {
    const { query } = useParams();
    const [song, setSong] = useState(null);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const { currentSong, isPlaying, playAlbum, togglePlay, setCurrentSong } = usePlayerStore();
    const isCurrentSong = song ? currentSong?.id === song?.id : false;

    const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // mm:ss
	};

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const getSearch = await axiosInstance.get(`/search?keyword=${query}`);
                if (getSearch.data.status === "success") {
                    setSongs(getSearch.data.data.music);
                    setAlbums(getSearch.data.data.album);
                    setArtists(getSearch.data.data.artist);
                } else {
                    toast.error(getSearch.data.message);
                    setSongs([]);
                    setAlbums([]);
                    setArtists([]);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };
        fetchSongs();
    }, [query]);

    const handlePlaySong = (song) => {
		if (isCurrentSong) togglePlay();
		else setCurrentSong(song);
	};

    return (
        <div>
            <ScrollArea className='h-[calc(100vh-180px)] overflow-y-auto' 
  		        style={{scrollbarWidth: 'thin', /* Dùng cho Firefox */
			    scrollbarColor: '#0f0f0f transparent' /* Màu thanh cuộn */}}>

                <h1 className="text-2xl font-bold mb-4 my-5">Search Results for "{query}"</h1>
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-md">
                    {/* Table Header */}
                    <h2 className="text-2xl font-bold mb-4 my-5">Songs:</h2>
                    <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-white/5">
                        <div>#</div>
                        <div>Title</div>
                        <div>Genre</div>
                        <div>Duration</div>
                    </div>

                    {/* Song List */}
                    <div className="space-y-2 py-4">
                        {songs.map((song, songindex) => {
                            return (
                                <div key={song.id}
                                    onClick={() => handlePlaySong(song)}
                                    className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md cursor-pointer"
                                >
                                    <div className="flex items-center justify-center">
                                        {isCurrentSong && isPlaying ? (
                                            <Pause className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Play className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src={song.thumbnail} alt={song.title} className="size-10" />
                                        <div>
                                            <div className="font-medium text-white">{song.title}</div>
                                            <div>{song.artist}</div>
                                        </div>
                                    </div>
                                    <div>{song.genre}</div>
                                    <div>{formatTime(song.length)}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Album List */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
                    <h2 className="text-2xl font-bold mb-4 my-5">Albums:</h2>
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
                     hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
                            >
                                <img
                                    src={album.thumbnail}
                                    alt={album.title}
                                    className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
                                />
                                <div className='flex-1 p-4'>
                                    <p className='font-medium truncate'>{album.title}</p>
                                    <p className='text-sm text-zinc-400 truncate'>{album.artist}</p>
                                </div>
                                <PlayButton song={album.songs[0]} />
                            </div>

                        ))}
                    </div>

                    {/* Artist List */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
                        <h2 className="text-2xl font-bold mb-4 my-5">Artists:</h2>
                        {artists.map((artist) => (
                            <div
                                key={artist.id}
                                className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
                     hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
                            >
                                <img
                                    src={artist.profilePicImage}
                                    alt={artist.username}
                                    className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
                                />
                                <div className='flex-1 p-4'>
                                    <p className='font-medium truncate'>{artist.username}</p>
                                    <p className='text-sm text-zinc-400 truncate'>Artist</p>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </ScrollArea >
        </div >
    );
};
export default SearchResultsPage;
