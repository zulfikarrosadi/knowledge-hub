import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/editor.tsx"),
  route("/home", "routes/home.tsx"),
  route("/about", "routes/about.tsx"),
  route("/auth", "routes/auth.tsx"),
] satisfies RouteConfig;
