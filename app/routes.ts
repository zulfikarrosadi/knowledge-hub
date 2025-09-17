import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout('routes/root-layout.tsx', [
    index("routes/editor.tsx"),
    route("/home", "routes/home.tsx"),
    route("/about", "routes/about.tsx"),
    route("/auth", "routes/auth.tsx"),
  ])
] satisfies RouteConfig;
