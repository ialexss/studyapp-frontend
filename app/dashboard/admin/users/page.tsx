"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usersApi } from "@/lib/api/users";
import type { User } from "@/lib/types";
import {
	Search,
	UserPlus,
	Shield,
	Mail,
	Calendar,
	CheckCircle2,
	XCircle,
} from "lucide-react";

export default function UsersManagementPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
		try {
			const data = await usersApi.getAll();
			setUsers(data);
		} catch (error) {
			console.error("Error loading users:", error);
		} finally {
			setLoading(false);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return (
			<ProtectedRoute requireAdmin>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute requireAdmin>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">
							Gestión de Usuarios
						</h1>
						<p className="text-muted-foreground mt-1">
							Administra usuarios, roles y permisos del sistema
						</p>
					</div>
					<Button>
						<UserPlus className="h-4 w-4 mr-2" />
						Crear Usuario
					</Button>
				</div>

				{/* Search */}
				<Card>
					<CardContent className="pt-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar por nombre o email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Stats */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Usuarios
							</CardTitle>
							<Shield className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{users.length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Usuarios Activos
							</CardTitle>
							<CheckCircle2 className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{users.filter((u) => u.isActive).length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Administradores
							</CardTitle>
							<Shield className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									users.filter((u) =>
										u.roles?.some(
											(r) =>
												r.name === "admin" ||
												r.name === "superadmin"
										)
									).length
								}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Users List */}
				<Card>
					<CardHeader>
						<CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
						<CardDescription>
							Lista de todos los usuarios registrados en el
							sistema
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center gap-4 flex-1">
										<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
											<span className="text-sm font-medium text-primary">
												{user.firstName[0]}
												{user.lastName[0]}
											</span>
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<p className="font-medium">
													{user.firstName}{" "}
													{user.lastName}
												</p>
												{user.isActive ? (
													<CheckCircle2 className="h-4 w-4 text-green-600" />
												) : (
													<XCircle className="h-4 w-4 text-red-600" />
												)}
											</div>
											<div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
												<span className="flex items-center gap-1">
													<Mail className="h-3 w-3" />
													{user.email}
												</span>
												{user.roles &&
													user.roles.length > 0 && (
														<div className="flex gap-1">
															{user.roles.map(
																(role) => (
																	<span
																		key={
																			role.id
																		}
																		className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
																	>
																		{
																			role.name
																		}
																	</span>
																)
															)}
														</div>
													)}
											</div>
										</div>
									</div>
									<div className="flex gap-2">
										<Button variant="outline" size="sm">
											Editar
										</Button>
										<Button variant="outline" size="sm">
											Roles
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</ProtectedRoute>
	);
}
