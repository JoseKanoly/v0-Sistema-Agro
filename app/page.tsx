import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"

export default async function Home() {
  const session = await getCurrentPerfil()
  if (session?.user) redirect("/dashboard")
  redirect("/auth/login")
}
