import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Check, Globe, X } from "lucide-react";
import React, { useEffect } from "react";

const MyQueuingTable = () => {
  const { myQueuing, fetchMyQueuing, isLoading } = useMusicStore();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // mm:ss
  };

  useEffect(() => {
    fetchMyQueuing();
  }, [fetchMyQueuing]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-zinc-400'>Loading queuing songs...</div>
      </div>
    );
  }

  return (
    <Table className={undefined}>
      <TableHeader className={undefined}>
        <TableRow className='hover:bg-zinc-800/50'>
          <TableHead className='w-[50px]'></TableHead>
          <TableHead className={undefined}>Title</TableHead>
          <TableHead className={undefined}>Artist</TableHead>
          <TableHead className={undefined}>Genre</TableHead>
          <TableHead className={undefined}>Duration</TableHead>
          <TableHead className={undefined}>Release Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className={undefined}>
        {myQueuing.map((song) => (
          <TableRow key={song.id} className='hover:bg-zinc-800/50'>
            <TableCell className={undefined}>
              <img src={song.thumbnail} alt={song.title} className='size-10 rounded object-cover' />
            </TableCell>
            <TableCell className='font-medium'>{song.title}</TableCell>
            <TableCell className={undefined}>{song.artist}</TableCell>
            <TableCell className={undefined}>{song.genre}</TableCell>
            <TableCell className={undefined}>{formatTime(song.length)}</TableCell>
            <TableCell className={undefined}>
              <span className='inline-flex items-center gap-1 text-zinc-400'>
                <Calendar className='h-4 w-4' />
                {song.createdAt.split("T")[0]}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default MyQueuingTable;