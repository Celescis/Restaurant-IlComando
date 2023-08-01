import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.comandappsfinal.app',
  appName: 'La Comanda PPS',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      //@ts-ignore
      launchFadeOutDuration: 1000,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '905166952303-rakrbboso9k6ckcbqlfo1991higq8h4a.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;
