import { redirect } from "@/i18n/navigation";

export default function Page() {
  return redirect({ href: "/login", locale: "ar" });
}
