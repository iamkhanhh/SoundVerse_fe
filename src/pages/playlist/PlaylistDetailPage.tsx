import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMusicStore } from '@/stores/useMusicStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { CheckCircle, Clock, Pause, Play, Trash, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const { fetchPlaylistById, currentPlaylist, isLoading, deleteMusicFromPlaylist } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; musicId: number | null }>({ open: false, musicId: null });

  useEffect(() => {
    if (playlistId) fetchPlaylistById(Number(playlistId));
  }, [fetchPlaylistById, playlistId]);

  if (isLoading) return null;
  const handlePlayAlbum = () => {
    if (!currentPlaylist) return;

    const isCurrentPlaylistPlaying = currentPlaylist?.songs.some((song) => song.id === currentSong?.id);
    if (isCurrentPlaylistPlaying) togglePlay();
    else {
      // start playing the album from the beginning
      playAlbum(currentPlaylist?.songs, 0);
    }
  };
  const handlePlaySong = (index: number) => {
    if (!currentPlaylist) return;

    playAlbum(currentPlaylist?.songs, index);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // mm:ss
  };

  const deleteMusic = (musicId: number) => {
    setConfirmDialog({ open: true, musicId });
  };

  const confirmDeleteFromPlaylist = async () => {
    if (!confirmDialog.musicId) return;
    try {
      deleteMusicFromPlaylist(Number(playlistId), confirmDialog.musicId);
      setConfirmDialog({ open: false, musicId: null });
      fetchPlaylistById(Number(playlistId));
      alert("Đã xoa bài hát vào playlist thành công!");
    } catch (error) {
      console.error("Lỗi khi xoa bài hát vào playlist:", error);
      alert("Lỗi khi xoa bài hát!");
    }
  };

  return (
    <div className='h-full'>
      <ScrollArea className='h-full rounded-md'>
        {/*Main Content*/}
        <div className='relative min-h-full'>
          {/*bg gradient*/}
          <div className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none'
            aria-hidden='true' />


          {/*content*/}
          <div className='relative z-10'>
            <div className='flex p-6 gap-6 pb-8'>
              <img
                src={currentPlaylist?.thumbnail}
                alt={currentPlaylist?.title}
                className='w-[240px] h-[240px] shadow-xl rounded'
              />
              <div className='flex flex-col justify-end'>
                <p className='text-sm font-medium'>Album</p>
                <h1 className='text-7xl font-bold my-4'>{currentPlaylist?.title}</h1>
                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                  <span>• {currentPlaylist?.songs.length} songs</span>
                  <span>• {currentPlaylist?.createdAt}</span>
                </div>
              </div>
            </div>


            {/*play button*/}
            <div className='px-6 pb-4 flex items-center gap-6'>
              <button onClick={handlePlayAlbum}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500
                 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying && currentPlaylist?.songs.some((song) => song.id === currentSong?.id) ? (
                  <Pause className='h-7 w-7 text-black' />
                ) : (
                  <Play className='h-7 w-7 text-black' />
                )}
              </button>
            </div>
            {/* Table Section */}
            <div className='bg-black/20 backdrop-blur-sm'>
              {/* table header */}
              <div
                className='grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm 
               text-zinc-400 border-b border-white/5 rounded-md group cursor-pointer'
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className='h-4 w-4' />
                </div>
                <div>Actions</div>
              </div>
              {/*songs list */}
              <div className='px-6'>
                <div className='space-y-2 py-4'>
                  {currentPlaylist?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?.id === song.id;
                    return (
                      <div key={song.id}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className='flex items-center justify-center'>
                          {isCurrentSong && isPlaying ? (
                            <div className='size-4 text-green-500'>♫</div>
                          ) : (
                            <span className='group-hover:hidden'>{index + 1}</span>
                          )}
                          {!isCurrentSong && (
                            <Play className='h-4 w-4 hidden group-hover:block' />
                          )}
                        </div>

                        <div className='flex items-center gap-3' onClick={() => handlePlaySong(index)}>
                          <img src={song.thumbnail} alt={song.title} className='size-10' />
                          <div>
                            <div className='font-medium text-white'>{song.title}</div>
                            <div>{song.artist}</div>
                          </div>


                        </div>

                        <div className='flex items-center '> {song.createdAt.split("T")}</div>

                        <div className='flex items-center'>{formatDuration(song.length)}</div>

                        <div className='flex items-center'>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={() => deleteMusic(song.id)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {confirmDialog.open && (
          <Dialog open={confirmDialog.open} onOpenChange={() => setConfirmDialog({ open: false, musicId: null })}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
              <DialogHeader className={undefined}>
                <DialogTitle className={undefined}>Xác nhận Xoa bài hát</DialogTitle>
              </DialogHeader>
              <p>Bạn có chắc chắn muốn Xoa bai nay playlist này?</p>
              <DialogFooter className="flex gap-2">
                <Button onClick={confirmDeleteFromPlaylist} className="bg-emerald-500">
                  <CheckCircle className="h-4 w-4 mr-2" /> Xác nhận
                </Button>
                <Button variant="destructive" onClick={() => setConfirmDialog({ open: false, musicId: null })}>
                  <XCircle className="h-4 w-4 mr-2" /> Hủy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </ScrollArea>
    </div>
  )
}

export default PlaylistDetailPage