import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export function AboutPage() {
  return <>
    <Button>Test btn</Button>
    <div>
      <Link to={{
        pathname: '/'
      }} >Home</Link>
      <Link to={{ pathname: '/auth' }}>Auth</Link>
    </div>
    <h1>Test</h1>
  </>
}
