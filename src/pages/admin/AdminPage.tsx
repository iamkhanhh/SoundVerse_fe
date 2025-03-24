import { useAuthStore } from '@/stores/useAuthStore'
import React, { useEffect } from 'react'
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Album, ListTodo, Music, User2 } from 'lucide-react';
import AlbumsTabContent from './components/AlbumsTabContent';
import { useMusicStore } from '@/stores/useMusicStore';
import SongsTabContent from './components/SongsTabContent';
import { useAuth } from '@/providers/AuthContext';
import UsersTabContent from './components/UsersTabContent';
import QueuingTabContent from './components/QueuingTabContent';

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();
	const { isArtist } = useAuth();
	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);
	if (!isAdmin && !isLoading) return <div>Unauthorized - you must be an admin</div>
	return (
		<div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50 '>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
						<Music className='mr-2 size-4 rounded-md ' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
					<TabsTrigger value='users' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
						<User2 className='mr-2 size-4 rounded-md ' />
						Users
					</TabsTrigger>
					<TabsTrigger value='queuing' className='data-[state=active]:bg-zinc-700 mx-3 border border-zinc-600 rounded-lg px-4 py-2'>
						<ListTodo className='mr-2 size-4 rounded-md ' />
						Queuing
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
				<TabsContent value='users'>
					<UsersTabContent />
				</TabsContent>
				<TabsContent value='queuing'>
					<QueuingTabContent />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default AdminPage