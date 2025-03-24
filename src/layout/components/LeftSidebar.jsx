import { HomeIcon, Library, ListVideo, Music } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import PlaylistSkeleton from '@/components/skeletons/PlaylistSkeleton.jsx'
import { useMusicStore } from '@/stores/useMusicStore'
import { useAuth } from '@/providers/AuthContext'
const LeftSidebar = () => {
  const { isLoading, playlists, fetchPlaylists } = useMusicStore();
  const { role, isArtist, isAdmin } = useAuth();
  useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists]);

  console.log("User Role:", role);
  console.log("isArtist:", isArtist);
  console.log("isAdmin:", isAdmin);

  return (
    <div className='h-full flex flex-col gap-2'>
      {/*Navigation  menu*/}
      <div className='rounded-lg bg-zinc-900 p-4'>
        <div className='space-y-2'>
          <Link to={'/'}
            className={cn(
              buttonVariants({
                variant: 'ghost', className: 'w-full justify-start text-white hover:bg-zinc-800'
              }))}
          >
            <HomeIcon className='mr-2 size-5' />
            <span className='hidden md:inline'>Home</span>
          </Link>


          <Link to={'/playlists'}
            className={cn(
              buttonVariants({
                variant: 'ghost', className: 'w-full justify-start text-white hover:bg-zinc-800'
              }))}
          >
            <Library className='mr-2 size-5' />
            <span className='hidden md:inline'>My playlists</span>
          </Link>

          {(isArtist || isAdmin) && (
            <Link to={'/my-musics'}
              className={cn(
                buttonVariants({
                  variant: 'ghost', className: 'w-full justify-start text-white hover:bg-zinc-800'
                }))}>
              <Music className='mr-2 size-5' />
              <span className='hidden md:inline'>My musics</span>
            </Link>
          )}
        </div>
      </div>
      {/*Library section*/}
      <div className='flex-1 rounded-lg bg-zinc-900 p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center text-white px-2'>
            <Library className='mr-2 size-5' />
            <span className='hidden md:inline'>PlayLists</span>
          </div>
        </div>
        <ScrollArea className='h-[calc(100vh-300px)]'>
          <div className='space-y-2 '>
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              playlists.map((playlist) => (

                <Link to={`/playlists/${playlist.id}`}
                  key={playlist.id}
                  className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
                >
                  <img src={playlist.thumbnail}
                    alt='Playlist img'
                    className='size-12 rounded-md flex-shrink-0 object-cover' />
                  <div className='flex-1 min-w-0 hidden md:block'>
                    <p className='font-medium truncate'>{playlist.title}</p>
                    <p className='text-sm text-zinc-400 truncate'>{playlist.songs.length ?? 0} songs</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default LeftSidebar