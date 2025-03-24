import { useMusicStore } from "@/stores/useMusicStore";
import { Library, ListMusic, UserRoundCheck } from "lucide-react";
import React from "react";
import StatsCard from "../admin/components/StatsCard";

const DashboardArtist = () => {
	const { myStats } = useMusicStore();

	const statsData = [
		{
			icon: ListMusic,
			label: "Total Songs",
			value: myStats.totalSongs.toString(),
			bgColor: "bg-emerald-500/10",
			iconColor: "text-emerald-500",
		},
		{
			icon: Library,
			label: "Total Albums",
			value: myStats.totalAlbums.toString(),
			bgColor: "bg-violet-500/10",
			iconColor: "text-violet-500",
		},
		{
			icon: UserRoundCheck,
			label: "Total Followers",
			value: myStats.totalFollowers.toString(),
			bgColor: "bg-orange-500/10",
			iconColor: "text-orange-500",
		}
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 '>
			{statsData.map((stat) => (
				<StatsCard
					key={stat.label}
					icon={stat.icon}
					label={stat.label}
					value={stat.value}
					bgColor={stat.bgColor}
					iconColor={stat.iconColor}
				/>
			))}
		</div>
	);
};
export default DashboardArtist;