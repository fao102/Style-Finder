import 'bootstrap/dist/css/bootstrap.css';
import ImageUploader from "./components/imageUploader";
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'

export default function App() {
  return (
    <main>
      <div className="position-relative min-vh-100 w-100 bg-light">
        <div className="position-absolute top-0 end-0 p-3">
          <Unauthenticated>
            <SignUpButton/>            
            <SignInButton />
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
        </div>
        <div className="d-flex justify-content-center align-items-center min-vh-100 w-100">
          <div className="text-center w-100" style={{ maxWidth: 720 }}>
            <h1 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>
              Style Finder
            </h1>
            <section>
              <ImageUploader />
            </section>
          </div>
        </div>
        <AuthLoading>
          <p>Still loading</p>
        </AuthLoading>
      </div>
    </main>
  );
}
