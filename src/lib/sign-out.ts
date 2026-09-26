import { signOut } from "next-auth/react";

// Sign out, then go to the homepage of whatever site the visitor is on.
//
// signOut({ callbackUrl: "/" }) asks the server for the address to redirect
// to, and the server builds it from the Host header it sees. Behind a tunnel
// or proxy that header can be "localhost:3000", which sent people to
// https://localhost:3000/ and an error page. Signing out without the
// server-side redirect, then navigating to a relative "/" ourselves, always
// stays on the address the visitor is actually using.
export async function signOutToHome() {
  await signOut({ redirect: false });
  // A full page load on purpose: it clears every signed-in bit of client state.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/";
}
