"use client";
import { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
// import { useGlobalDefaults } from "./GlobalDefaults";
import { db } from "../Supabase/supabaseClient";
import { useGlobalContext } from "../context/GlobalContext";
import { useGlobalDefaults } from "../Defaults/GlobalDefaults";
// import { getAllBranch } from "@/app/a_dean/api/branch-api";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const { setGlobals } = useGlobalDefaults()

  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const { setValue } = useGlobalContext()
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setloading(true)
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password,
    });


    if (error) {
      toast(error.message)
      setloading(false)

    } else {
      setGlobals()
      setValue('loading_g', true)
      router.push("/home");
      setloading(false)
      setValue('loading_g', false)


    }
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleLogin}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            // placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
            </a>
          </div>
          <Input id="password" type="password" required
            // placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"

          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoaderIcon className="animate-spin" /> : "Login"}
        </Button>

        {/* <Button onClick={() => console.log({ user })}> Get user info</Button> */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        </div>
      </div>
      {/* <div className="text-center text-sm">
        <Button type="submit" className="w-full" disabled>
          {loading ? <LoaderIcon className="animate-spin" /> : "Change Company"}
        </Button>
      </div> */}
    </form>
  )
}
