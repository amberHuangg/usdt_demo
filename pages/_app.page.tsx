import { ThemeProvider } from '@mui/material'
import { AppProps } from 'next/app'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { theme } from '../config/theme'
import '../styles/globals.scss'
import '../styles/styleOverrides.scss'
import AppLayout from '../components/AppLayout'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'
import { useRouter } from 'next/router'
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>3games</title>
        <meta charSet="utf-8"/>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
      </Head>
      <Script src="/fixHtmlFontSize.js" strategy="beforeInteractive" defer={false}/>

      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <Suspense fallback={<div>loading</div>}>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </Suspense>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  )
}

export default MyApp
