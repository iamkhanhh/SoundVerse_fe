import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const SignUpForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    gender: "",
    country: "",
    fullName: "",
    dob: "",
    isArtist: false
  });
  const navigate = useNavigate();
  const countries = [
    { code: "vn", name: "Việt Nam" },
    { code: "us", name: "USA" },
    { code: "uk", name: "Anh" },
    { code: "fr", name: "Pháp" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [error, setError] = useState(null);

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/signup", {
        username: form.username,
        password: form.password,
        email: form.email,
        gender: form.gender,
        country: form.country,
        fullName: form.fullName,
        dob: formatDate(form.dob),
        isArtist: form.isArtist
      });

      if (res.data.status == 'success') {
        toast.success("Đăng ký thành công! Chuyển hướng đến trang Xac thuc...");
        localStorage.setItem("user", JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email
        }));
        navigate("/verify", { state: { email: form.email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi đăng ký!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-md w-[80%] max-w-lg text-center">
        <h2 className="text-white text-2xl font-bold mb-4">Đăng Ký</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="p-2 rounded bg-zinc-800 text-white w-full"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="p-2 rounded bg-zinc-800 text-white w-full"
              required
            >
              <option value="">Chọn quốc gia</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />
          <div className="flex items-center space-x-4">
            <p>Are you an artist?</p>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="isArtist"
                value="true"
                checked={form.isArtist === true}
                onChange={() => setForm({ ...form, isArtist: true })}
                className="w-4 h-4 cursor-pointer"
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="isArtist"
                value="false"
                checked={form.isArtist === false}
                onChange={() => setForm({ ...form, isArtist: false })}
                className="w-4 h-4 cursor-pointer"
              />
              <span>No</span>
            </label>
          </div>
          <Button type="submit" className="w-full bg-emerald-500" style={{ width: "112px" }}>
            Đăng Ký
          </Button>
        </form>
        <p className="text-zinc-400 text-center mt-4">
          Already have an account? &nbsp;
          <Link
            to="/auth"
            className="text-emerald-400 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
