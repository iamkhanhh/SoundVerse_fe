import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const MyAlbumsTable = () => {
	const { myAlbums, deleteAlbum, fetchMyAlbums } = useMusicStore();
	const albumsToDisplay = myAlbums ?? [];

	useEffect(() => {
		fetchMyAlbums();
	}, [fetchMyAlbums]);

	return (
		<Table className={undefined}>
			<TableHeader className={undefined}>
				<TableRow className='hover:bg-zinc-800/50'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead className={undefined}>Title</TableHead>
					<TableHead className={undefined}>Artist</TableHead>
					<TableHead className={undefined}>Songs</TableHead>
					<TableHead className={undefined}>Created At</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className={undefined}>
				{albumsToDisplay.map((album) => (
					<TableRow key={album.id} className='hover:bg-zinc-800/50'>
						<TableCell className={undefined}>
							<img src={album.thumbnail} alt={album.title} className='w-10 h-10 rounded object-cover' />
						</TableCell>
						<TableCell className='font-medium'>
							<Link to={`/albums/${album.id}`}>
								{album.title}
							</Link>
						</TableCell>
						<TableCell className={undefined}>{album.artist}</TableCell>
						<TableCell className={undefined}>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Music className='h-4 w-4' />
								{album.songs.length} songs
							</span>
						</TableCell>
						<TableCell className={undefined}>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4' />
								{album.createdAt}
							</span>
						</TableCell>
						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => deleteAlbum(album.id)}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default MyAlbumsTable;