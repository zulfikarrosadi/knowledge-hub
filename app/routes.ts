import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout('routes/root-layout.tsx', [
    index("routes/home/index.tsx"),
    route("/editor?/*", "routes/editor/index.tsx"),
    route("/sharing/", "routes/sharing/index.tsx"),
  ])
] satisfies RouteConfig;
