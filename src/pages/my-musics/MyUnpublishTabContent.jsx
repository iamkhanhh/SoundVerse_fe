import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyholeIcon } from "lucide-react";
import MyUnpublishTable from "./MyUnpublishTable";

const MyUnpublishTabContent = () => {
  return (
    <Card className='bg-zinc-800/50 border-zinc-700/50'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <LockKeyholeIcon className='h-5 w-5 text-violet-500' />
              Unpublished
            </CardTitle>
            <CardDescription>Check these unpublished musics</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <MyUnpublishTable />			
      </CardContent>
    </Card>
  );
};
export default MyUnpublishTabContent;