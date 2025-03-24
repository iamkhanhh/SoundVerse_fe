import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/Input';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useAuth } from "@/providers/AuthContext";
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';
import { apiUrl } from '@/lib/utils';

const Profile = () => {
    const { user, loading, getCurrentUser } = useAuth();
    const [image, setImage] = useState<string | null>(null); // Lưu trữ ảnh tải lên
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [form, setForm] = useState({
        username: "",
        password: null,
        confirmPassword: null,
        currentPassword: null,
        gender: "",
        country: "",
        fullName: "",
        profilePicImage: null,
        dob: "",
    })

    console.log("User data from useAuth:", user);
    useEffect(() => {
        setImage(user.profilePicImage)
        setForm({
            username: user.username,
            password: null,
            confirmPassword: null,
            currentPassword: null,
            gender: user.gender,
            country: user.country,
            fullName: user.fullName,
            profilePicImage: user.profilePicImage,
            dob: user.dob
        })
    }, [user])

    if (loading) {
        return <p className="text-white text-center">Loading...</p>;
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string); // Cập nhật ảnh
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const countries = [
        { code: "vn", name: "Việt Nam" },
        { code: "us", name: "USA" },
        { code: "uk", name: "Anh" },
        { code: "fr", name: "Pháp" },
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const [error, setError] = useState(null);

    const formatDate = (inputDate) => {
        const [year, month, day] = inputDate.split("-");
        return `${day}/${month}/${year}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            toast.error("Mật khẩu không khớp!");
            return;
        }
        
        
        try {
            let data: any = {
                username: form.username,
                password: form.password,
                currentPassword: form.currentPassword,
                gender: form.gender,
                country: form.country,
                fullName: form.fullName,
                dob: form.dob ? formatDate(form.dob) : null,
            };

            if (imageFile) {
                const imgProfile = generateFileName(imageFile.name);

                await handleUploadImgProfile(imgProfile);

                data.profilePicImage = imgProfile;
            }

            if (!data.password && !data.currentPassword) {
                delete data.currentPassword;
                delete data.password;
            }

            if (!data.dob) {
                delete data.dob;
            }

            const res = await axiosInstance.put("/users/update", data);

            if (res.data.status == 'success') {
                toast.success(res.data.message);
                getCurrentUser();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi đăng ký!");
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

    const handleUploadImgProfile = async (uploadThumbnailName) => {
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
        <ScrollArea className='h-[calc(100vh-180px)] overflow-y-auto'
            style={{
                scrollbarWidth: 'thin', /* Dùng cho Firefox */
                scrollbarColor: '#0f0f0f transparent', /* Màu thanh cuộn */
                paddingBottom: '50px'
            }}>
            <div className="max-w-2xl mx-auto p-6 bg-black shadow-md rounded-md">
                {/* Ảnh đại diện + Thông tin */}
                <div className="flex items-center gap-4">
                    <img
                        src={image || "/cover-images/12.jpg"} // Hiển thị ảnh tải lên nếu có, nếu không hiển thị ảnh mặc định
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border"
                    />
                    <div className='w-full'>
                        <div className="flex w-full justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-semibold">{user?.fullName || "Loading..."}</h2>
                                <p className="text-gray-500">@{user?.username || "Loading..."}</p>
                            </div>

                            <div className="ml-auto text-right">
                                <span className={`px-2 py-1 text-sm text-white rounded-md ${user?.role === 'Admin' ? 'bg-red-500' : user?.role === 'Artist' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                                    {user?.role}
                                </span>
                                <p className="text-gray-400">Joined: {user?.createdAt || "Loading..."}</p>
                            </div>
                        </div>
                        {/* Nút đổi ảnh */}
                        <div className="mt-4">
                            <Button variant="outline">
                                <label htmlFor="file-upload" className="cursor-pointer">Change Photo</label>
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden" // Ẩn input file
                                onChange={handleImageChange} // Xử lý thay đổi ảnh
                            />
                        </div>
                    </div>
                </div>

                {/* Cài đặt thông tin */}
                <div className="mt-6">
                    <div className="space-y-4">
                        <Input
                            type="text"
                            name="fullName"
                            placeholder="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className={undefined}
                        />
                        <Input
                            type="text"
                            name="username"
                            placeholder="username"
                            value={form.username}
                            onChange={handleChange}
                            className={undefined}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="p-2 rounded bg-zinc-800 text-white w-full"
                                required
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                            <select
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="p-2 rounded bg-zinc-800 text-white w-full"
                                required
                            >
                                <option value="">Chọn quốc gia</option>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange} className={undefined} />
                    </div>
                </div>

                {/* Đổi mật khẩu */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                    <div className="space-y-4">
                        <Input
                            type="password"
                            name="currentPassword"
                            placeholder="Current Password"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required className={undefined} />
                        <Input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            value={form.password}
                            onChange={handleChange}
                            required className={undefined} />
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required className={undefined} />
                    </div>
                </div>

                {/* Nút lưu thay đổi */}
                <div className="mt-6">
                    <Button className="w-full bg-emerald-500" style={{ width: "112px" }} onClick={(e) => handleSubmit(e)}>Save Changes</Button>
                </div>
            </div>
        </ScrollArea>
    );
};

export default Profile;
