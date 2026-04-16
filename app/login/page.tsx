export const dynamic = 'force-dynamic'


import bg from "./lofi.jpg"
import bg2 from "./avian.png"
import Image from "next/image"
import { LoginForm } from "@/lib/Login/loginform"

export default function LoginPage() {
    return (
        <div className="mx-auto flex min-h-screen w-full items-center justify-center bg-muted">
            
            <div className="flex flex-1 items-center justify-center pb-10">
                <div className="w-full max-w-xs">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}


