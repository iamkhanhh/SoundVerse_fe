import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserStore } from "@/stores/useUserStore";
import { Calendar, Trash2 } from "lucide-react";
import React from "react";
import { useEffect } from "react";

const UsersTable = () => {
	const { users, fetchedUsers } = useUserStore();

	useEffect(() => {
		fetchedUsers();
	}, [fetchedUsers]);

	return (
		<Table className={undefined}>
			<TableHeader className={undefined}>
				<TableRow className='hover:bg-zinc-800/50'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead className={undefined}>Username</TableHead>
					<TableHead className={undefined}>Email</TableHead>
					<TableHead className={undefined}>Gender</TableHead>
					<TableHead className={undefined}>Role</TableHead>
					<TableHead className={undefined}>Status</TableHead>
					<TableHead className={undefined}>Created At</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className={undefined}>
				{users.map((user) => (
					<TableRow key={user.id} className='hover:bg-zinc-800/50'>
						<TableCell className={undefined}>
							<img src={user.profilePicImage != null ? user.profilePicImage : "cover-images/12.jpg" } alt={user.username} className='size-10 rounded object-cover' />
						</TableCell>
						<TableCell className='font-medium'>{user.username}</TableCell>
						<TableCell className={undefined}>{user.email}</TableCell>
						<TableCell className={undefined}>{user.gender}</TableCell>
						<TableCell className={undefined}>{user.role}</TableCell>
						<TableCell className={undefined}>{user.status}</TableCell>
						<TableCell className={undefined}>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4' />
								{user.createdAt}
							</span>
						</TableCell>
						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant='ghost'
									size='sm'
									// onClick={() => deleteuser(user.id)}
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
export default UsersTable;