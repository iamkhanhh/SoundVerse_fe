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
import { apiUrl } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Upload } from "lucide-react";
import React from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddPlaylistDialog = () => {
    const { fetchPlaylists, playlists } = useMusicStore();
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

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

    const handleCreatePlaylist = async () => {
        if (newPlaylistName.trim()) {
            try {

                const uploadThumbnailName = generateFileName(imageFile.name);

                await handleUploadThumbnail(uploadThumbnailName);

                const response = await fetch(`${apiUrl.baseURL}/playlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: newPlaylistName,
                        description: newDescription,
                        thumbnail: uploadThumbnailName
                    }),
                    credentials: "include"
                });

                if (!response.ok) {
                    toast.error('Lỗi khi tạo playlist');
                }

                const data = await response.json();
                if (data.status == 'success') {
                    fetchPlaylists();
                    toast.success('Tạo playlist thành công');
                } else {
                    toast.success(data.message);
                }
                setNewPlaylistName('');
                setNewDescription('');
                setDialogOpen(false);
            } catch (error) {
                console.error('Lỗi khi tạo playlist:', error);
            }
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-black mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Create Playlist
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900 border-zinc-700">
                <DialogHeader className={undefined}>
                    <DialogTitle className={undefined}>Create New Playlist</DialogTitle>
                    <DialogDescription className={undefined}>Enter your playlist's information</DialogDescription>
                </DialogHeader>

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

                <Input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Enter playlist name"
                    className="bg-zinc-800 border-zinc-700"
                />

                <Input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter description"
                    className="bg-zinc-800 border-zinc-700 mt-2"
                />

                <DialogFooter className={undefined}>
                    <Button variant="outline" onClick={() => {
                        setNewPlaylistName('');
                        setNewDescription('');
                        setImageFile(null);
                        setThumbnailPreview(null);
                        return setDialogOpen(false)
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreatePlaylist}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default AddPlaylistDialog;