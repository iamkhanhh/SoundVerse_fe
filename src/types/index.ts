export interface Song {
	id: number;
	title: string;
	artistId: number;
	artist: string;
	genre: string;
	description: string;
	albumId: string | null;
	thumbnail: string;
	filePath: string;
	length: number;
	createdAt: string;
}

export interface Album {
	id: number;
	title: string;
	description: string;
	thumbnail: string;
	artistId: number;
	artist: string;
	listOfMusic: number;
	createdAt: string;
	songs: Song[];
}
export interface Playlist {
	id: number;      
	title: string;
	thumbnail: string;
	description: string;
	songs: Song[];    
	createdAt: string;
}
export interface Stats {
	totalSongs: number;
	totalSongsMonthly: number;
	totalAlbums: number;
	totalUsers: number;
	totalUsersMonthly: number;
	totalArtists: number;
}
export interface MyStats {
	totalSongs: number;
	totalAlbums: number;
	totalFollowers: number;
}
export interface User {
	id: number;
	username: string;
	email: string;
	gender: string;
	country: string;
	profilePicImage: string | null;
	fullName: string;
	role: string;
	status: string;
	dob: string;
	createdAt: string
}
export interface Artist extends User {
	songs: Song[];
	albums: Album[];
}
export interface Genre {
	id: string;
	title: string;
}
export interface Contract {
	contractNumber: string;
	contractDate: string;
	username: string;
	address: string;
	phone: string;
	email: string;
	signature: string;
}