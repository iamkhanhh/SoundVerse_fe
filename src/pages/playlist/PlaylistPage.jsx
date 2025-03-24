import React from 'react';
import Topbar from '@/components/Topbar';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import AddPlaylistDialog from './AddPlaylistDialog';
import PlaylistsTable from './PlaylistsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Library } from 'lucide-react';

const PlaylistPage = () => {
  return (
    <div>
      
      <div className="my-7">
        <ScrollArea className="h-[calc(100vh-180px)] overflow-y-auto">

          <Card className='bg-zinc-800/50 border-zinc-700/50'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Library className='h-5 w-5 text-violet-500' />
                    My Playlists
                  </CardTitle>
                  <CardDescription>Manage your playlists collection</CardDescription>
                </div>
                <AddPlaylistDialog />
              </div>
            </CardHeader>


            <CardContent>
              <PlaylistsTable />
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PlaylistPage;