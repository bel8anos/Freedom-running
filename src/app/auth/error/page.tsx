"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mountain, AlertCircle, ArrowLeft } from "lucide-react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "CredentialsSignin":
        return "Invalid email or password. Please check your credentials and try again.";
      case "EmailCreateAccount":
        return "Could not create account with this email address.";
      case "OAuthSignin":
        return "Error occurred during OAuth sign in.";
      case "OAuthCallback":
        return "Error in handling the OAuth callback.";
      case "OAuthCreateAccount":
        return "Could not create OAuth account.";
      case "EmailSignin":
        return "Error sending the email with the sign in link.";
      case "CallbackRouteError":
        return "Error in the callback route.";
      case "OAuthAccountNotLinked":
        return "To confirm your identity, sign in with the same account you used originally.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An unexpected error occurred during authentication.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <p className="text-muted-foreground">
            We encountered an issue while trying to sign you in
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>

          {error === "CredentialsSignin" && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Troubleshooting tips:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Double-check your email and password</li>
                <li>Make sure your account was created with email/password</li>
                <li>
                  Try signing in with a social account if you used one to
                  register
                </li>
                <li>
                  Use the &quot;Sign Up&quot; link if you haven&apos;t created
                  an account yet
                </li>
              </ul>
            </div>
          )}

          {error === "OAuthAccountNotLinked" && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Account Linking Issue:</strong>
              </p>
              <p>
                It looks like you previously signed in with a different method
                (email/password or another social account). Please use the same
                sign-in method you used when you first created your account.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Mountain className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@freedomrunning.gr"
              className="text-primary hover:underline"
            >
              support@freedomrunning.gr
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
