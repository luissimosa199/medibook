import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useMemo } from "react"
import useTrackUserAgent from "@/hooks/useTrackUserAgent"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  useTrackUserAgent()

  const queryClient = useMemo(() => new QueryClient(), []);

  return (<SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  </SessionProvider>)
}
