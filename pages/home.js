import { TextInput, Box, Group, Divider, Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabase } from "../lib/initSupabase";
import { Auth } from "@supabase/ui";

const homePage = () => {
    const router = useRouter()
    useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" ) router.push("/");
      } 
    );
    return (
      () => {
        authListener.unsubscribe();
      },
      []
    );
  });
  return (
    <Group
      sx={{
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
        padding: "1rem",
      }}
    >
      <TextInput placeholder="Lobby Code" label="Join Existing Lobby" />
      <Divider />
      <Button
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        onClick={() => createLobby()}
      >
        Create Lobby
      </Button>
      <Button onClick={() => supabase.auth.signOut()}>LogOut</Button>
    </Group>
  );
};

export default homePage;
