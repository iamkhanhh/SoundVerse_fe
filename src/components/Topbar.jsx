import { LayoutDashboardIcon, Search } from 'lucide-react';
import { SignedOut } from '@clerk/clerk-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { Input } from './ui/Input';
import { useAuth } from "@/providers/AuthContext";

const Topbar = () => {
    const { user, logout, isArtist } = useAuth();
    const { isAdmin } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    console.log(isAdmin);
    

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search/${searchQuery}`);
        }
    };

    return (
        <div className='flex justify-between items-center p-4 bg-zinc-900/75 backdrop-blur-md z-10'>
            {/* Logo */}
            <Link to={'/'}>
                <div className='flex gap-2 items-center'>
                    <img src="/logo.png" alt="spotify logo" className="size-20" />
                    <span className="text-white font-semibold text-lg">Sound Verse</span>
                </div>
            </Link>

            {/* Search Bar */}
            <div className='flex items-center gap-4 flex-1 justify-center'>
                <div className='flex items-center border border-zinc-700 rounded-lg overflow-hidden'>
                    <Input
                        type="text"
                        placeholder="Search songs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className='bg-zinc-800 border-none text-white px-4 py-2 w-64'
                    />
                    <button
                        onClick={handleSearch}
                        className='bg-emerald-500 px-4 py-2 hover:bg-emerald-600 flex items-center'
                    >
                        <Search className='size-5 text-black' />
                    </button>
                </div>
            </div>

            {/* Admin Dashboard & User Controls */}
            <div className='flex items-center gap-4 relative'>
                {isAdmin && (
                    <Link to='/admin' className={cn(buttonVariants({ variant: 'outline' }))}>
                        <LayoutDashboardIcon className='size-4 mr-2' />
                        Admin Dashboard
                    </Link>
                )}

                {!user && (
                    <SignedOut>
                        <Link to="/auth" className={cn(buttonVariants({ variant: "default" }))}>
                            Sign In
                        </Link>
                    </SignedOut>
                )}

                {user && (
                    <div className="relative" ref={dropdownRef}>
                        {/* Avatar Button */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="focus:outline-none"
                        >
                            <img
                                style={{ width: "50px", height: "50px", borderRadius: "40px", margin: "10px" }}
                                className="avatar cursor-pointer"
                                src={user.profilePicImage || '/default_avatar_user.jpg'}
                                alt="User Avatar"
                            />

                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 p-4">
                                <div className="flex items-center gap-2">
                                    <img src={user.profilePicImage || '/default_avatar_user.jpg'} className="w-10 h-10 rounded-full" alt="Avatar" />
                                    <div>
                                        <p className="text-sm text-gray-500">{user?.email || "No Email"}</p>
                                    </div>

                                </div>
                                <div className="mt-4 space-y-2">
                                    <Link
                                        to="/profile"
                                        className="block text-sm text-gray-700 hover:bg-gray-200 p-2 rounded"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            navigate("/profile");
                                        }}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/playlists"
                                        className="block text-sm text-gray-700 hover:bg-gray-200 p-2 rounded"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        Playlist
                                    </Link>
                                    {(isArtist || isAdmin) && (
                                        <>
                                            <Link
                                                to="/my-musics"
                                                className="block text-sm text-gray-700 hover:bg-gray-200 p-2 rounded"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                My Musics
                                            </Link>
                                            <Link
                                                to="/my-contract"
                                                className="block text-sm text-gray-700 hover:bg-gray-200 p-2 rounded"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                My Contract
                                            </Link></>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        logout();
                                    }}
                                    className="mt-4 w-full text-sm text-red-600 hover:bg-gray-200 p-2 rounded"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default Topbar;
