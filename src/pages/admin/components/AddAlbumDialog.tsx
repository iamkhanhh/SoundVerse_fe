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
import { axiosInstance } from "@/lib/axios";
import { apiUrl } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Upload } from "lucide-react";
import React from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
	const { albums } = useMusicStore();
	const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState(null);
	const [newAlbum, setNewAlbum] = useState({
		title: "",
		description: ""
	});

	const [imageFile, setImageFile] = useState<File | null>(null);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
		}
		if (thumbnailPreview) {
			URL.revokeObjectURL(thumbnailPreview);
		}
		const previewUrl = URL.createObjectURL(file);
		setThumbnailPreview(previewUrl);
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!imageFile) {
				return toast.error("Please upload an image");
			}

			const uploadThumbnailName = generateFileName(imageFile.name);

			await handleUploadThumbnail(uploadThumbnailName);

			const data = {
				title: newAlbum.title,
				description: newAlbum.description,
				thumbnail: uploadThumbnailName
			}

			const postCreateAlbum = await axiosInstance.post("/album", data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (postCreateAlbum.data.status === "success") {
				toast.success(postCreateAlbum.data.message);
				albums.push(postCreateAlbum.data.data);
			} else {
				toast.error(postCreateAlbum.data.message);
			}

			setNewAlbum({
				title: "",
				description: ""
			});
			setImageFile(null);
			setThumbnailPreview(null);
			setAlbumDialogOpen(false);
		} catch (error: any) {
			toast.error("Failed to create album: " + error.message);
		} finally {
			setIsLoading(false);
		}
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
				body: imageFile,
				headers: {
					"Content-Type": imageFile.type,
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

	return (
		<Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-violet-500 hover:bg-violet-600 text-white'>
					<Plus className='mr-2 h-4 w-4' />
					Add Album
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-700'>
				<DialogHeader className={undefined}>
					<DialogTitle className={undefined}>Add New Album</DialogTitle>
					<DialogDescription className={undefined}>Add a new album to your collection</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 py-4'>
					<input
						type='file'
						ref={fileInputRef}
						onChange={handleImageSelect}
						accept='image/*'
						className='hidden'
					/>
					<div
						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
						onClick={() => fileInputRef.current?.click()}
					>
						<div className='text-center'>
							<div className='text-sm text-zinc-400 mb-2'>
								{imageFile ? (
									<div className='text-center' style={{ textAlign: "-webkit-center" }}>
										<div className='text-sm text-emerald-500'>Image selected: <span className="text-xs text-zinc-400">{imageFile.name.slice(0, 20)}</span></div>
										<img style={{ width: "50px" }} alt="thumbnail-preview" src={thumbnailPreview} />
									</div>
								) : (
									<div className="d-flex">
										<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
											<Upload className='h-6 w-6 text-zinc-400' />
										</div>
										<p>Upload album artwork</p>
									</div>
								)}
							</div>
							<Button variant='outline' size='sm' className='text-xs'>
								Choose File
							</Button>
						</div>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Album Title</label>
						<Input
							value={newAlbum.title}
							onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter album title' type={undefined} />
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Album Description</label>
						<Input
							value={newAlbum.description}
							onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter album Description' type={undefined} />
					</div>
				</div>
				<DialogFooter className={undefined}>
					<Button variant='outline' onClick={() => {
						setNewAlbum({ title: "", description: "" });
						setImageFile(null);
						return setAlbumDialogOpen(false)
					}} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-violet-500 hover:bg-violet-600'
						disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.description}
					>
						{isLoading ? "Creating..." : "Add Album"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddAlbumDialog;