import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import toast from "react-hot-toast";
import { apiUrl } from '@/lib/utils';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl.baseURL}/auth/forgot_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === 'success') {
        toast.success(data.message);
        navigate("/auth");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="p-8 bg-zinc-900 rounded-lg shadow-md w-[90%] max-w-md">
        <h2 className="text-white text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="w-full bg-zinc-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New Password"
            className="w-full bg-zinc-800 text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
