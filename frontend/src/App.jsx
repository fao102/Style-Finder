import 'bootstrap/dist/css/bootstrap.css';
import ImageUploader from "./components/imageUploader";
import CheapestSidebar from './components/CheapestSidebar';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'

export default function App() {
  return (
    <main>
      <div className="bg-light">
        <div className="d-flex justify-content-center">
          <div className="text-center w-100" style={{ maxWidth: 720 }}>
            <h1 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>
              Style Finder
            </h1>
            <section>
              <ImageUploader />
            </section>
           
          </div>
        </div>

      </div>
    </main>
  );
}
