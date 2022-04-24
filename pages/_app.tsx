import { AppProps } from 'next/app';
import { StyledEngineProvider } from '@mui/material';

import { ThemeProvider } from 'next-themes';
import Head from 'next/head';

// import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper';

import { LocalizationProvider } from 'contexts/Localization';
import '@/style/index.css';
import 'tailwindcss/tailwind.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider attribute="class">
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        {/* <Analytics /> */}
        <LocalizationProvider>
          <LayoutWrapper>
            <Component {...pageProps} />
          </LayoutWrapper>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}