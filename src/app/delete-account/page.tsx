import DeleteAccountClient from "@/app/delete-account/DeleteClient";
import { IsLoggedIn, getAllCookie } from "@/app/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Delete Account",
};

export default async function DeleteAccount() {
  const isLoggedIn = await IsLoggedIn();
  const session_id = (await getAllCookie()).session_id;

  if (!isLoggedIn || !session_id) {
    redirect("/signin");
  }

  return <DeleteAccountClient />;
}
