import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { UAParser } from "ua-parser-js"
import { hasCookie, getCookie } from "cookies-next";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  const router = useRouter()

  useEffect(() => {
    const { query } = router
    if (!router.isReady) return;

    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

    let utm_params: { [key: string]: string | string[] } = {};

    utmKeys.forEach(key => {
      if (query[key]) {
        utm_params[key] = query[key] as string | string[];
      }
    });

    const parser = new UAParser(window.navigator.userAgent)

    const userData = {
      timestamp: new Date(),
      utm_params,
      entry_point: window.location.href,
      os: parser.getOS(),
      browser: parser.getBrowser(),
      device: parser.getDevice()
    }

    fetch("/api/user_agent_info", {
      method: hasCookie(`user_agent_id`) ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData, id: getCookie(`user_agent_id`) }),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const queryClient = useMemo(() => new QueryClient(), []);

  return (<SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
    </QueryClientProvider>
  </SessionProvider>)
}
