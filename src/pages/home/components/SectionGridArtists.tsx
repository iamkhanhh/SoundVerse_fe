import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SectionGridSkeleton from "./SectionGridSkeleton"; // Giả sử bạn có một Skeleton để tải trang
import { Artist } from "@/types"; // Loại dữ liệu cho nghệ sĩ
import { useMusicStore } from "@/stores/useMusicStore";
import React from "react";
import { Link } from "react-router-dom";

const SectionGridArtists = () => {
  const { popularArtists, isLoading, fetchPopularArtists } = useMusicStore();

  useEffect(() => {
    fetchPopularArtists(); // Lấy danh sách nghệ sĩ khi component load
  }, [fetchPopularArtists]);

  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Popular Artists</h2>
        <Button variant="link" className="text-sm hover:text-white">
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularArtists.map((artist) => (
          <Link key={artist.id} to={`/artist/${artist.id}`}>
            <div
              className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
            >
              <div className="relative mb-4">
                {/* Hiển thị ảnh nghệ sĩ với khung hình tròn */}
                <div className="aspect-square rounded-full overflow-hidden w-32 h-32 mx-auto">
                  <img
                    src={artist.profilePicImage}
                    alt={artist.username || artist.fullName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <h3 className="font-medium mb-2 text-center">{artist.username}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SectionGridArtists;
