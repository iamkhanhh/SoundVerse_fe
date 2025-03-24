import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";
import AddSongDialog from "./AddSongDialog";
import SongsTable from "./SongsTable";


const SongsTabContent = () => {
	return (
		<Card className='bg-zinc-800/50 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Library className='h-5 w-5 text-violet-500' />
							Songs Library
						</CardTitle>
						<CardDescription>Manage your songs collection</CardDescription>
					</div>
					<AddSongDialog />
				</div>
			</CardHeader>

			<CardContent>
				<SongsTable />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;