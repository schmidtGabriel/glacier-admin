import React from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";

type SignupFormInputs = {
  email: string;
  name: string;
  phone: string;
  password: string;
};

interface SignupFormProps {
  onNext: (data: SignupFormInputs) => void;
  defaultValues?: SignupFormInputs;
}

const SignupForm: React.FC<SignupFormProps> = ({ onNext, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    defaultValues: defaultValues ?? {},
  });
  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Complete Your Infos</h1>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <Input
          label="Name"
          type="name"
          placeholder="Your Name"
          error={errors.name?.message}
          autoComplete="name"
          {...register("name", {
            required: "Name is required",
          })}
        />

        <Input
          label="Phone"
          type="phone"
          placeholder="Your phone"
          error={errors.phone?.message}
          autoComplete="phone"
          {...register("phone", {
            required: "Phone is required",
          })}
        />

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

        <Button type="submit" fullWidth className="mt-8">
          Next
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Login
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
