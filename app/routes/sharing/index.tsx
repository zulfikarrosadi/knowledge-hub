import type { Route } from "./+types";
import { App } from "./sharing";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Share your knowledge" }
	]
}

export default function() {
	return <App />
}
