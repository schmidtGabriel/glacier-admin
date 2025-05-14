import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth/AuthService";
import Button from "../ui/Button";
import Input from "../ui/Input";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setAuthError(null);
    setLoading(true);
    try {
      await login(data.email, data.password);
      // redirecionar ou mostrar mensagem de sucesso
      navigate("/");
    } catch (err: Error | unknown) {
      setAuthError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-fadeIn">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="current-password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <Button type="submit" fullWidth isLoading={loading} className="mt-8">
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a
          href="#"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
