import { ArrowRight, BookOpen, Cpu, Lock, Github } from "lucide-react"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

export default function() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="text-center max-w-2xl px-6 py-20 animate-fadeInUp">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 transition-colors duration-500">
          Personal Knowledge Hub
        </h1>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 transition-opacity duration-700">
          A self-hosted, offline-first app for managing notes, code snippets, and bookmarks.
          Sync across devices without accounts, powered by Go & React.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" className="transition-transform hover:scale-105" asChild>
            <Link to={{
              pathname: '/editor'
            }}
            >
              Start Writing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <a href="https://github.com/zulfikarrosadi/knowledge-hub" className="cursor-pointer" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="transition-transform hover:scale-105">
              Repository <Github className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 px-6 max-w-5xl mb-20">
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <BookOpen className="h-10 w-10 text-blue-600" />
            <CardTitle className="mt-2">Markdown Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 dark:text-slate-300">
            Write and organize notes with rich MDX support. Works offline by default.
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <Lock className="h-10 w-10 text-green-600" />
            <CardTitle className="mt-2">Secure & Private</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 dark:text-slate-300">
            Your data stays on your device. Sync only when you choose, with OTP/QR linking.
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <Cpu className="h-10 w-10 text-indigo-600" />
            <CardTitle className="mt-2">Offline-First</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 dark:text-slate-300">
            Built as a Progressive Web App with OPFS. Access your notes anytime, anywhere.
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 mb-6">
        © 2025 Zulfikar — Knowledge Hub
      </footer>
    </div>
  )
}

