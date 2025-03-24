import { Card,CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import React from 'react';
import { axiosInstance } from '@/lib/axios';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AuthCallBackPage = () => {
  const { isLoaded, user } = useUser();
	const navigate = useNavigate();
	const syncAttempted = useRef(false);
  useEffect(() => {
		const syncUser = async () => {
			if (!isLoaded || !user || syncAttempted.current) return;

			try {
				syncAttempted.current = true;

				await axiosInstance.post("/auth/callback", {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					thumbnail: user.thumbnail,
				});
			} catch (error) {
				console.log("Error in auth callback", error);
			} finally {
				navigate("/");
			}
		};

		syncUser();
	}, [isLoaded, user, navigate]);
  return (
    <div className='h-screen w-full bg-black flex items-center justify-center'>
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800 items-center ">
        <CardContent className="className='flex flex-col items-center gap-4 pt-6'">
          <Loader className='size-6 text-emerald-500 animate-spin pt-3'  />
          <h3 className='text-zinc-400 text-xl font-bold pt-3'>Logging you in</h3>
          <p className='text-zinc-400 text-sm pt-3'>Redirecting...</p>s
        </CardContent>
      </Card>
      
    </div>
  )
}
export default AuthCallBackPage;
