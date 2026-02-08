import bg from "./lofi.jpg"
import bg2 from "./avian.png"
import Image from "next/image"
import { LoginForm } from "@/lib/Login/loginform"

export default function LoginPage() {
    return (
        <div className="  min-h-svh  max-w-content mx-auto p-4 pt-20">
            {/* <div className="bg-muted relative hidden lg:block">
                <Image
                    src={bg2}
                    alt="Image"
                    className="absolute  inset-0 h-full w-full object-cover  dark:brightness-[0.6] "
                />
            </div> */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                {/* <div className="flex justify-center gap-2 md:justify-end">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="  text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        </div>
                      
                        VitaRich
                    </a>
                </div> */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
