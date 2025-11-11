"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LoginPage() {
	const router = useRouter();
	const setAuth = useAuthStore((state) => state.setAuth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await authApi.login({ email, password });
			setAuth(response.user, response.access_token);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.response?.data?.message || "Error al iniciar sesión");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-gray-600 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						StudyApp
					</CardTitle>
					<CardDescription className="text-center">
						Ingresa tus credenciales para acceder
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="text-sm font-medium"
							>
								Email
							</label>
							<Input
								id="email"
								type="email"
								placeholder="tu@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="password"
								className="text-sm font-medium"
							>
								Contraseña
							</label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && (
							<div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
								{error}
							</div>
						)}
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Iniciando sesión..." : "Iniciar Sesión"}
						</Button>
					</form>
					
					<div className="mt-6 text-center text-sm">
						<span className="text-muted-foreground">¿No tienes una cuenta? </span>
						<Link href="/register" className="text-primary hover:underline font-medium">
							Regístrate
						</Link>
					</div>

					<div className="mt-4 text-center text-sm text-muted-foreground">
						<p>Credenciales de prueba:</p>
						<p className="font-mono text-xs mt-1">
							admin@sistema.com / Admin123!
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
