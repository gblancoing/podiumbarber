import { LoginForm } from "./LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Bienvenido de Vuelta</CardTitle>
          <CardDescription>Inicia sesión para gestionar tus citas.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
