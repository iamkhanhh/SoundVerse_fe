import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo } from "lucide-react";
import MyQueuingTable from "./MyQueuingTable";

const MyQueuingTabContent = () => {
  return (
    <Card className='bg-zinc-800/50 border-zinc-700/50'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <ListTodo className='h-5 w-5 text-violet-500' />
              Queuing
            </CardTitle>
            <CardDescription>Check these pending musics</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <MyQueuingTable />			
      </CardContent>
    </Card>
  );
};
export default MyQueuingTabContent;