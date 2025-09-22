import type { Route } from "./+types/home";
import { Welcome } from "pages/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Knowledge Sharing Hub" },
    { name: "description", content: "Offline first peer to peer knowledge sharing hub" },
  ];
}

export default function Home() {
  return <Welcome />;
}
