import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { apiUrl } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Upload } from "lucide-react";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
	title: string;
	thumbnail: string;
	description: string;
	genreId: number;
	filePath: string;
	duration: number;
	albumsId: number
}

const AddSongDialog = () => {
	const { albums, fetchGenres, genres, mySongs } = useMusicStore();
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [duration, setDuration] = useState(null);
	const [thumbnailPreview, setThumbnailPreview] = useState(null);

	useEffect(() => {
		fetchGenres();
	}, [fetchGenres]);

	const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		thumbnail: "",
		description: "",
		genreId: 0 || null,
		filePath: "",
		duration: 0,
		albumsId: null
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleAudioChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.files?.[0];
		if (temp) {
			setFiles((prev) => ({ ...prev, audio: temp }))
			const duration = await getAudioDuration(temp);
			setDuration(duration);
		}
	};


	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!files.audio || !files.image) {
				return toast.error("Please upload both audio and image files");
			}

			const uploadMusicName = generateFileName(files.audio.name);
			const uploadThumbnailName = generateFileName(files.image.name);

			await handleUploadThumbnail(uploadThumbnailName);
			await handleUploadAudio(uploadMusicName);

			const data = {
				title: newSong.title,
				description: newSong.description,
				thumbnail: uploadThumbnailName,
				albumsId: newSong.albumsId ? newSong.albumsId : null,
				genreId: newSong.genreId ? newSong.genreId : null,
				length: duration,
				filePath: uploadMusicName
			}

			const postCreateMusic = await axiosInstance.post("/music", data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (postCreateMusic.data.status === "success") {
				mySongs.push(postCreateMusic.data.data);
				toast.success(postCreateMusic.data.message);
			} else {
				toast.error(postCreateMusic.data.message);
			}

			setNewSong({
				title: "",
				thumbnail: "",
				description: "",
				genreId: null,
				filePath: "",
				duration: 0,
				albumsId: null
			});

			setThumbnailPreview(null);
			setDuration(null);
			setSongDialogOpen(false);

			setFiles({
				audio: null,
				image: null,
			});
		} catch (error: any) {
			toast.error("Failed to add song: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // mm:ss
	};

	const getAudioDuration = (file) => {
		return new Promise((resolve) => {
			const audio = new Audio(URL.createObjectURL(file));
			audio.addEventListener("loadedmetadata", () => {
				resolve(audio.duration);
			});
		});
	};

	const generateFileName = (name) => {
		name = name.replace(/\s+/g, "_").trim();

		const match = name.match(/(\.[^.]+)$/);
		const extension = match ? match[1] : "";

		const baseName = extension ? name.replace(extension, "") : name;

		const timeStamp = Date.now();
		const uniqueID = crypto.randomUUID();

		return `${baseName}-${timeStamp}-${uniqueID}${extension}`;
	};

	const handleUploadThumbnail = async (uploadThumbnailName) => {
		try {
			const response = await fetch(`${apiUrl.baseURL}/generate-thumbnail-presigned-url`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ fileName: uploadThumbnailName }),
			});

			const result = await response.json();
			const presignedUrl = result.data;

			if (!presignedUrl) {
				toast.error("Không lấy được URL pre-signed.");
				return;
			}

			const uploadResponse = await fetch(presignedUrl, {
				method: "PUT",
				body: files.image,
				headers: {
					"Content-Type": files.image.type,
				},
			});

			if (uploadResponse.ok) {

			} else {
				toast.error("Fail to upload thumbnail");
			}
		} catch (error) {
			console.error("Lỗi:", error);
		}
	};

	const handleUploadAudio = async (uploadMusicName) => {
		try {
			const response = await fetch(`${apiUrl.baseURL}/generate-single-presigned-url`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ fileName: uploadMusicName }),
			});

			const result = await response.json();
			const presignedUrl = result.data;

			if (!presignedUrl) {
				toast.error("Không lấy được URL pre-signed.");
				return;
			}

			const uploadResponse = await fetch(presignedUrl, {
				method: "PUT",
				body: files.audio,
				headers: {
					"Content-Type": "audio/mpeg",
				},
			});

			if (uploadResponse.ok) {

			} else {
				toast.error("Fail to upload audio");
			}
		} catch (error) {
			console.error("Lỗi:", error);
		}
	};

	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
					<Plus className='mr-2 h-4 w-4' />
					Add Song
				</Button>
			</DialogTrigger>

			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
				<DialogHeader className={undefined}>
					<DialogTitle className={undefined}>Add New Song</DialogTitle>
					<DialogDescription className={undefined}>Add a new song to your music library</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 py-4'>
					<input
						type='file'
						accept='audio/*'
						ref={audioInputRef}
						hidden
						onChange={handleAudioChange}
					/>

					<input
						type='file'
						ref={imageInputRef}
						className='hidden'
						accept='image/*'
						onChange={(e) => {
							const temp = e.target.files?.[0];
							if (!temp) return;

							if (thumbnailPreview) {
								URL.revokeObjectURL(thumbnailPreview);
							}
							const previewUrl = URL.createObjectURL(temp);
							setThumbnailPreview(previewUrl);

							setFiles((prev) => ({ ...prev, image: temp }));
						}}
					/>

					{/* image upload area */}
					<div
						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
						onClick={() => imageInputRef.current?.click()}
					>
						<div className='text-center'>
							{files.image ? (
								<div className='space-y-2' style={{ textAlign: "-webkit-center" }}>
									<div className='text-sm text-emerald-500'>Image selected: <span className="text-xs text-zinc-400">{files.image.name.slice(0, 20)}</span></div>
									<img style={{ width: "50px" }} alt="thumbnail-preview" src={thumbnailPreview} />
								</div>
							) : (
								<>
									<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
										<Upload className='h-6 w-6 text-zinc-400' />
									</div>
									<div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
									<Button variant='outline' size='sm' className='text-xs'>
										Choose File
									</Button>
								</>
							)}
						</div>
					</div>

					{/* Audio upload */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Audio File</label>
						<div className='flex items-center gap-2'>
							<Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full'>
								{files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
							</Button>
						</div>
						{duration !== null && <p>Duration: {formatTime(duration)}</p>}
					</div>

					{/* other fields */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Title</label>
						<Input
							value={newSong.title}
							onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700' type={undefined} />
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Description</label>
						<Input
							value={newSong.description}
							onChange={(e) => setNewSong({ ...newSong, description: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Genre</label>
						<Select
							value={newSong.genreId}
							onValueChange={(value) => setNewSong({ ...newSong, genreId: value })}
						>
							<SelectTrigger className='bg-zinc-800 border-zinc-700'>
								<SelectValue placeholder='Select album' />
							</SelectTrigger>
							<SelectContent className='bg-zinc-800 border-zinc-700'>
								<SelectItem value={null}>No Genre</SelectItem>
								{genres.map((genre) => (
									<SelectItem key={genre.id} value={genre.id}>
										{genre.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Album (Optional)</label>
						<Select
							value={newSong.albumsId}
							onValueChange={(value) => setNewSong({ ...newSong, albumsId: value })}
						>
							<SelectTrigger className='bg-zinc-800 border-zinc-700'>
								<SelectValue placeholder='Select album' />
							</SelectTrigger>
							<SelectContent className='bg-zinc-800 border-zinc-700'>
								<SelectItem value={null}>No Album (Single)</SelectItem>
								{albums.map((album) => (
									<SelectItem key={album.id} value={album.id}>
										{album.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter className={undefined}>
					<Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? "Uploading..." : "Add Song"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddSongDialog;