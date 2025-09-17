import type { Route } from "./+types/editor";
import App from "pages/editor";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Markdown Editor" },
    { name: "description", content: "Create your very own notes using markdown" },
  ];
}

export default function Editor() {
  return <App />;
}
