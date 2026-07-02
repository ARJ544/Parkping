import { getAllCookie, IsLoggedIn } from "@/app/actions";
import { redirect } from "next/navigation";
import UpdateClient from "@/app/update/UpdateClient";

export const metadata = {
  title: "Update Phone Number",
};

export default async function Update() {
  const isLoggedIn = await IsLoggedIn();
  const session_id = (await getAllCookie()).session_id;

  if (!isLoggedIn || !session_id) {
    redirect("/signin");
  }

  return <UpdateClient />;
}
