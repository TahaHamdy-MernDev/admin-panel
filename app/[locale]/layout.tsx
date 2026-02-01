import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import localFont from "next/font/local";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "@/components/providers/react-query";
import { Toaster } from "@/components/ui/sonner";
import { DirectionProvider } from "@/components/ui/direction";
const din_font = localFont({
  src: "./DINN.ttf",
  variable: "--font-din",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={cn(
          din_font.variable,
          din_font.className,
          "min-h-svh antialiased ",
        )}
      >
        <DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={true}
          >
            <NextIntlClientProvider locale={locale}>
              <ReactQueryProvider>
                {children}
                <Toaster position="top-center" />
              </ReactQueryProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
