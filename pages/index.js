import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import { supabase } from "../lib/initSupabase";
import { useEffect, useState } from "react";

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Index = () => {
  const router = useRouter();
  const { user, session } = Auth.useUser();
  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher
  );
  const [authView, setAuthView] = useState("sign_in");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") setAuthView("update_password");
        if (event === "SIGNED_IN") router.push("/home");
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        // fetch('/api/auth', {
        //   method: 'POST',
        //   headers: new Headers({ 'Content-Type': 'application/json' }),
        //   credentials: 'same-origin',
        //   body: JSON.stringify({ event, session }),
        // }).then((res) => res.json())
      }
    );

     return () => {
     authListener.unsubscribe();
    };
  }, []);

  const View = () => {
    if (!user)
      return (
        <Space direction="vertical" size={8}>
          <div>
            <img
              src="https://app.supabase.io/img/supabase-dark.svg"
              width="96"
            />
            <Typography.Title level={3}>Welcome to DallE Fun</Typography.Title>
          </div>
          <Auth
            supabaseClient={supabase}
            // providers={['google', 'github']}
            view={authView}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </Space>
      );

    return (
      <Space direction="vertical" size={6}>
        {authView === "update_password" && (
          <Auth.UpdatePassword supabaseClient={supabase} />
        )}
      </Space>
    );
  };

  return (
    <div style={{ maxWidth: "420px", margin: "96px auto" }}>
      <Card>
        <View />
      </Card>
    </div>
  );
};

export default Index;
