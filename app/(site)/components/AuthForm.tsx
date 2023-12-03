"use client";


import Input from "@/components/Inputs/Input";
import SubHeading from "@/components/SubHeading";
import AuthSocialButton from "@/components/buttons/AuthSocialButton";
import Button from "@/components/buttons/Button";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillGithub, AiFillGooglePlusSquare } from "react-icons/ai";
import axios from 'axios'
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


type Variant = "LOGIN" | "REGISTER";
const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/dashboard');
    }
  },[session.status,router])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },reset
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === 'REGISTER') {
      axios.post('/api/register', data).then(() => signIn('credentials', { ...data })).catch((err) => {
        toast.error(err.response.data);
        

      }).finally(() => {
        setIsLoading(false);
        reset();})
    }
    else {
      signIn('credentials', { ...data, redirect: false }).then((callback) => {
        if (callback?.error) {
          toast.error(callback.error)
        }
        if (!callback?.error && callback?.ok) {
          toast.success('Logged in successfully');
        }
      }).finally(()=>setIsLoading(false));
    }

  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error('Something went wrong try again')
      }
      if (callback?.ok && !callback) {
        toast.success('Logged in successfully');
        router.push('/dashboard');
    
      }
    }).finally(() => setIsLoading(false));
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 rounded bg-white/10 shadow-md xs:w-full lg:w-2/6  flex flex-col items-center lg:gap-6 xs:gap-3"
    >
      <SubHeading
        body={
          variant === "LOGIN"
            ? "LOGIN IN RESOURCEHUB"
            : "REGISTER TO RESOURCEHUB"
        }
      />
      {variant === "REGISTER" && (
        <Input
          label="Username"
          id="username"
          register={register}
          type="text"
          required={true}
          errors={errors}
          isLoading={isLoading}
        />
      )}
      <Input
        label="Email Id"
        type="email"
        id="email"
        register={register}
        required={true}
        errors={errors}
        isLoading={isLoading}
      />
      <Input
        label="Password"
        type="password"
        id="password"
        register={register}
        required={true}
        errors={errors}
        isLoading={isLoading}
      />
      <Button type="submit" fullWidth>
        {variant === "LOGIN" ? "SignIn" : "SignUp"}
      </Button>
      <div className="lg:w-5/6 xs:w-full border-[1px] border-gray-600 rounded p-2 flex flex-col items-center gap-2">
        <SubHeading
          body={variant === "LOGIN" ? "Or Sign In with" : "Or Sign Up With"}
        />
        <AuthSocialButton icon={AiFillGithub} onClick={() => {socialAction('github')}} />
        <AuthSocialButton icon={AiFillGooglePlusSquare} onClick={() => {socialAction('google')}} />
      </div>
      <div className="flex gap-4 items-center p-2 text-lg font-medium">
        <span>
          {variant === "LOGIN" ? "New to ResourceHub?" : "Already Registered?"}
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => toggleVariant()}
        >
          {variant === "LOGIN" ? "Create an Account" : "Login to your Account"}
        </span>
      </div>
    </form>
  );
};

export default AuthForm;
