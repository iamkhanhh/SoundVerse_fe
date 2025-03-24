import { axiosInstance } from "@/lib/axios";
import { Album, Genre, MyStats, Playlist, Song, Stats, Artist, Contract } from "@/types";
import { toast } from "react-hot-toast";
import { create } from "zustand";


interface MusicStore {
	songs: Song[];
	albums: Album[];
	mySongs: Song[];
	myAlbums: Album[];
	myQueuing: Song[];
	myUnpublish: Song[];
	genres: Genre[];
	playlists: Playlist[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	currentPlaylist: Playlist | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	queuingSongs: Song[];
	stats: Stats;
	myStats: MyStats;
	artists: Artist[];
	popularArtists: Artist[];
	popularAlbums: Album[];
	artistDetails: Artist | null;
	isFavorite: boolean;
	myContract: Contract;

	fetchGenres: () => Promise<void>;
	fetchPlaylists: () => Promise<void>;
	fetchPlaylistById: (id: number) => Promise<void>;
	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: number) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: number) => Promise<void>;
	deleteAlbum: (id: number) => Promise<void>;
	deletePlaylist: (id: number) => Promise<void>;
	fetchMyStats: () => Promise<void>;
	fetchMyAlbums: () => Promise<void>;
	fetchMySongs: () => Promise<void>;
	fetchPopularAlbums: () => Promise<void>;
	fetchPopularArtists: () => Promise<void>;
	addMusicToPlaylist: (playlist_id: number, music_id: number) => Promise<void>;
	deleteMusicFromPlaylist: (playlist_id: number, music_id: number) => Promise<void>;
	fetchArtistDetails: (id: number) => void;
	likeSong: (id: number) => void;
	unlikeSong: (id: number) => void;
	checkLikeSong: (id: number) => void;
	fetchQueuingSongs: () => Promise<void>;
	acceptMusic: (id: number) => void;
	refuseMusic: (id: number) => void;
	fetchMyContract: () => Promise<void>;
	fetchMyQueuing: () => Promise<void>;
	fetchMyUnpublish: () => Promise<void>;
	publishMusic: (id: number) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	playlists: [],
	genres: [],
	isLoading: false,
	error: null,
	myContract: null,
	currentAlbum: null,
	currentPlaylist: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	popularArtists: [],
	queuingSongs: [],
	popularAlbums: [],
	isFavorite: false,
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
		totalSongsMonthly: 0,
		totalUsersMonthly: 0
	},
	artistDetails: null,
	mySongs: [],
	myAlbums: [],
	myQueuing: [],
	myUnpublish: [],
	myStats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalFollowers: 0
	},
	artists: [],

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/album/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album.id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a.id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	deletePlaylist: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/playlist/${id}`);
			set((state) => ({
				playlists: state.playlists.filter((playlist) => playlist.id !== id)
			}));
			toast.success("Playlist deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete playlist: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	addMusicToPlaylist: async (playlist_id, music_id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.post(`/playlist/${playlist_id}/songs/${music_id}`);
			toast.success("Playlist deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete playlist: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	deleteMusicFromPlaylist: async (playlist_id, music_id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/playlist/${playlist_id}/songs/${music_id}`);
			toast.success("Playlist deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete playlist: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/music/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song.id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},
	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/musics");
			set({ songs: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/stats");
			set({ stats: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/albums");
			set({ albums: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchPlaylists: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/playlist");
			set({ playlists: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchArtistDetails: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/artist/${id}`);
			set({ artistDetails: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchPlaylistById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/playlist/${id}`);
			set({ currentPlaylist: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/album/${id}`);
			set({ currentAlbum: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/have-a-nice-day");
			set({ featuredSongs: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/trending");
			set({ trendingSongs: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchArtists: async () => {
		set({ isLoading: true, error: null });
		try {
		  const response = await axiosInstance.get("/admins/artists");
		  set({ artists: response.data.data });
		} catch (error: any) {
		  set({ error: error.message });
		} finally {
		  set({ isLoading: false });
		}
	},

	fetchGenres: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/genre");
			set({ genres: response.data.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMySongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/music");
			set({ mySongs: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMyAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/album");
			set({ myAlbums: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchPopularAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/popular-albums");
			set({ popularAlbums: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchPopularArtists: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/popular-artists");
			set({ popularArtists: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMyStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/artist/my-stats");
			set({ myStats: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	likeSong: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.post(`/like/${id}`);
			set({ isFavorite: true });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	unlikeSong: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/like/${id}`);
			set({ isFavorite: false });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	checkLikeSong: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/like/${id}`);
			set({ isFavorite: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchQueuingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/music/pending");
			set({ queuingSongs: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	acceptMusic: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.put(`/music/approve/${id}`);
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	refuseMusic: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.put(`/music/refuse/${id}`);
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMyContract: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/contract");
			set({ myContract: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMyQueuing: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/music/my-pending");
			set({ myQueuing: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	publishMusic: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.put(`/music/publish/${id}`);
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMyUnpublish: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/music/my-unpublish");
			set({ myUnpublish: response.data.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));