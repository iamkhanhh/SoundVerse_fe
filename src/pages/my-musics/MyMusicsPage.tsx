import { useAuthStore } from '@/stores/useAuthStore'
import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Album, ListTodo, LockKeyholeIcon, Music } from 'lucide-react';
import { useMusicStore } from '@/stores/useMusicStore';
import Header from '../admin/components/Header';
import AlbumsTabContent from '../admin/components/AlbumsTabContent';
import { useAuth } from '@/providers/AuthContext';
import DashboardArtist from './DashboardArtist';
import MySongsTabContent from './MySongsTabContent';
import MyQueuingTabContent from './MyQueuingTabContent';
import MyUnpublishTabContent from './MyUnpublishTabContent';

const MyMusicsPage = () => {
    const { loading, isArtist } = useAuth();
    const { isAdmin } = useAuthStore();
    const { fetchMyAlbums, fetchMySongs, fetchMyStats } = useMusicStore();

    useEffect(() => {
        fetchMyAlbums();
        fetchMySongs();
        fetchMyStats();
    }, [fetchMyAlbums, fetchMySongs, fetchMyStats]);

    if (!isArtist && !loading && !isAdmin) return <div>Unauthorized - you must be an artist</div>

    return (
        <div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'>
            <Header />

            <DashboardArtist />

            <Tabs defaultValue='songs' className='space-y-6 '>
                <TabsList className='p-1 bg-zinc-800/50 '>
                    <TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
                        <Music className='mr-2 size-4 rounded-md ' />
                        Songs
                    </TabsTrigger>
                    <TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
                        <Album className='mr-2 size-4' />
                        Albums
                    </TabsTrigger>
                    <TabsTrigger value='unpublished' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
						<LockKeyholeIcon className='mr-2 size-4 rounded-md ' />
						Unpublished
					</TabsTrigger>
                    <TabsTrigger value='queuing' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
						<ListTodo className='mr-2 size-4 rounded-md ' />
						Queuing
					</TabsTrigger>
                </TabsList>

                <TabsContent value='songs'>
                    <MySongsTabContent />
                </TabsContent>
                <TabsContent value='albums'>
                    <AlbumsTabContent />
                </TabsContent>
                <TabsContent value='unpublished'>
					<MyUnpublishTabContent />
				</TabsContent>
                <TabsContent value='queuing'>
					<MyQueuingTabContent />
				</TabsContent>
            </Tabs>
        </div>
    )
}

export default MyMusicsPage