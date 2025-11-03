import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Đăng ký thành công! Mời bạn đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl px-10 py-8 w-[400px]"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Đăng ký
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-3 mb-6 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
        >
          Đăng ký
        </button>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Đã có tài khoản?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}
