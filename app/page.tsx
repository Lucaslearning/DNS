"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Trash2,
  Server,
  Shield,
  Router,
  Wifi,
  Globe,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Client {
  id: string
  name: string
  ddnsLink: string
  equipment: "fortigate" | "mikrotik" | "pfsense" | "unifi"
}

const validateClient = (client: Partial<Client>): string[] => {
  const errors: string[] = []

  if (!client.name?.trim()) {
    errors.push("Nome do cliente é obrigatório")
  }

  if (!client.ddnsLink?.trim()) {
    errors.push("Link DDNS é obrigatório")
  } else {
    // Validação básica de URL/domínio
    const urlPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!urlPattern.test(client.ddnsLink.replace(/^https?:\/\//, ""))) {
      errors.push("Link DDNS deve ser um domínio válido")
    }
  }

  if (!client.equipment) {
    errors.push("Equipamento é obrigatório")
  }

  return errors
}

export default function DNSManagementDashboard() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Cliente Exemplo 1",
      ddnsLink: "cliente1.ddns.net",
      equipment: "fortigate",
    },
    {
      id: "2",
      name: "Cliente Exemplo 2",
      ddnsLink: "cliente2.ddns.net",
      equipment: "mikrotik",
    },
  ])

  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [newClient, setNewClient] = useState({
    name: "",
    ddnsLink: "",
    equipment: "" as Client["equipment"],
  })

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addClient = useCallback(() => {
    const errors = validateClient(newClient)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsLoading(true)
    try {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name.trim(),
        ddnsLink: newClient.ddnsLink.trim(),
        equipment: newClient.equipment,
      }
      setClients((prev) => [...prev, client])
      setNewClient({ name: "", ddnsLink: "", equipment: "" as Client["equipment"] })
      setValidationErrors([])
      setIsAddClientOpen(false)
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
      setValidationErrors(["Erro interno. Tente novamente."])
    } finally {
      setIsLoading(false)
    }
  }, [newClient])

  const updateClient = useCallback(() => {
    if (!editingClient) return

    const errors = validateClient(editingClient)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsLoading(true)
    try {
      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClient.id
            ? { ...editingClient, name: editingClient.name.trim(), ddnsLink: editingClient.ddnsLink.trim() }
            : client,
        ),
      )
      setEditingClient(null)
      setValidationErrors([])
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
      setValidationErrors(["Erro interno. Tente novamente."])
    } finally {
      setIsLoading(false)
    }
  }, [editingClient])

  const confirmDeleteClient = useCallback(() => {
    if (!deletingClient) return

    setClients((prev) => prev.filter((client) => client.id !== deletingClient.id))
    setDeletingClient(null)
  }, [deletingClient])

  const getEquipmentIcon = useMemo(
    () => (equipment: string) => {
      switch (equipment) {
        case "fortigate":
          return <Shield className="h-4 w-4 text-red-600" />
        case "mikrotik":
          return <Router className="h-4 w-4 text-blue-600" />
        case "pfsense":
          return <Server className="h-4 w-4 text-green-600" />
        case "unifi":
          return <Wifi className="h-4 w-4 text-blue-500" />
        default:
          return <Server className="h-4 w-4 text-gray-600" />
      }
    },
    [],
  )

  const openDDNSLink = useCallback((ddnsLink: string) => {
    try {
      const url = ddnsLink.startsWith("http") ? ddnsLink : `https://${ddnsLink}`
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Erro ao abrir link:", error)
      alert("Erro ao abrir o link. Verifique se o endereço está correto.")
    }
  }, [])

  const stats = useMemo(
    () => ({
      totalClients: clients.length,
      uniqueEquipments: new Set(clients.map((c) => c.equipment)).size,
      equipmentDistribution: ["fortigate", "mikrotik", "pfsense", "unifi"]
        .map((equipment) => ({
          name: equipment,
          count: clients.filter((c) => c.equipment === equipment).length,
        }))
        .filter((item) => item.count > 0),
    }),
    [clients],
  )

  const handleCloseDialog = useCallback(() => {
    setValidationErrors([])
    setIsAddClientOpen(false)
  }, [])

  const handleCloseEditDialog = useCallback(() => {
    setValidationErrors([])
    setEditingClient(null)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border border-white/30">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white drop-shadow-2xl leading-tight tracking-tight">
                LIVTI DNS
              </h1>
              <p className="text-orange-100 font-medium text-base sm:text-lg mt-1 drop-shadow-lg">
                Gerenciador de Links DDNS
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="border-0 shadow-2xl bg-white hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-heading font-semibold text-slate-600">Total de Clientes</CardTitle>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl sm:text-4xl font-heading font-bold text-orange-800">{stats.totalClients}</div>
              <p className="text-sm text-slate-500 mt-2 font-medium">Links DDNS configurados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-white hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-heading font-semibold text-slate-600">Equipamentos</CardTitle>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Server className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl sm:text-4xl font-heading font-bold text-orange-800">
                {stats.uniqueEquipments}
              </div>
              <p className="text-sm text-slate-500 mt-2 font-medium">Tipos diferentes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-white hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading font-semibold text-slate-600">Distribuição</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {stats.equipmentDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg shadow-sm">
                        {getEquipmentIcon(item.name)}
                      </div>
                      <span className="text-sm font-heading font-semibold capitalize text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-orange-100/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-heading font-bold text-orange-800">
                  Clientes DDNS
                </CardTitle>
                <p className="text-orange-600 font-medium mt-1">Gerencie seus links de acesso</p>
              </div>
              <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg font-heading font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    Adicionar Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-orange-800 font-heading text-xl">Adicionar Novo Cliente</DialogTitle>
                    <DialogDescription className="text-slate-600">
                      Configure um novo cliente com seu link DDNS e equipamento
                    </DialogDescription>
                  </DialogHeader>

                  {validationErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-6 py-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name" className="text-sm font-heading font-semibold text-slate-700">
                        Nome do Cliente *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ex: Empresa ABC"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 font-medium"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="ddns" className="text-sm font-heading font-semibold text-slate-700">
                        Link DDNS *
                      </Label>
                      <Input
                        id="ddns"
                        placeholder="Ex: cliente.ddns.net"
                        value={newClient.ddnsLink}
                        onChange={(e) => setNewClient({ ...newClient, ddnsLink: e.target.value })}
                        className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 font-medium"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="equipment" className="text-sm font-heading font-semibold text-slate-700">
                        Equipamento *
                      </Label>
                      <Select
                        value={newClient.equipment}
                        onValueChange={(value) =>
                          setNewClient({ ...newClient, equipment: value as Client["equipment"] })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Selecione o equipamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fortigate">Fortigate</SelectItem>
                          <SelectItem value="mikrotik">Mikrotik</SelectItem>
                          <SelectItem value="pfsense">pfSense</SelectItem>
                          <SelectItem value="unifi">Unifi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCloseDialog}
                      className="border-slate-300 font-heading bg-transparent"
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={addClient}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-heading font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Adicionando..." : "Adicionar Cliente"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b-2 border-orange-200">
                    <TableHead className="font-heading font-bold text-orange-800 py-5 text-sm sm:text-base">
                      Cliente
                    </TableHead>
                    <TableHead className="font-heading font-bold text-orange-800 py-5 text-sm sm:text-base">
                      Link DDNS
                    </TableHead>
                    <TableHead className="font-heading font-bold text-orange-800 py-5 text-sm sm:text-base">
                      Equipamento
                    </TableHead>
                    <TableHead className="text-right font-heading font-bold text-orange-800 py-5 text-sm sm:text-base">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-orange-50/70 transition-colors">
                      <TableCell className="font-heading font-semibold py-4 sm:py-6 text-slate-800 text-sm sm:text-base">
                        {client.name}
                      </TableCell>
                      <TableCell className="py-4 sm:py-6">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-orange-600 hover:text-orange-800 font-heading font-semibold gap-2 text-sm sm:text-base"
                          onClick={() => openDDNSLink(client.ddnsLink)}
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="break-all">{client.ddnsLink}</span>
                        </Button>
                      </TableCell>
                      <TableCell className="py-4 sm:py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-sm">
                            {getEquipmentIcon(client.equipment)}
                          </div>
                          <span className="font-heading font-semibold capitalize text-slate-700 text-sm sm:text-base">
                            {client.equipment}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 sm:py-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingClient(client)}
                            className="gap-1 border-orange-200 text-orange-700 hover:bg-orange-50 font-heading"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingClient(client)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-1 font-heading"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {clients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-16 sm:py-20">
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full">
                            <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-slate-800 text-lg sm:text-xl">
                              Nenhum cliente cadastrado
                            </p>
                            <p className="text-sm sm:text-base text-slate-500 mt-2">
                              Clique em "Adicionar Cliente" para começar
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-orange-800 font-heading text-xl">Editar Cliente</DialogTitle>
              <DialogDescription className="text-slate-600">Modifique as informações do cliente</DialogDescription>
            </DialogHeader>

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {editingClient && (
              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="edit-name" className="text-sm font-heading font-semibold text-slate-700">
                    Nome do Cliente *
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingClient.name}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                    className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 font-medium"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-ddns" className="text-sm font-heading font-semibold text-slate-700">
                    Link DDNS *
                  </Label>
                  <Input
                    id="edit-ddns"
                    value={editingClient.ddnsLink}
                    onChange={(e) => setEditingClient({ ...editingClient, ddnsLink: e.target.value })}
                    className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 font-medium"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-equipment" className="text-sm font-heading font-semibold text-slate-700">
                    Equipamento *
                  </Label>
                  <Select
                    value={editingClient.equipment}
                    onValueChange={(value) =>
                      setEditingClient({ ...editingClient, equipment: value as Client["equipment"] })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fortigate">Fortigate</SelectItem>
                      <SelectItem value="mikrotik">Mikrotik</SelectItem>
                      <SelectItem value="pfsense">pfSense</SelectItem>
                      <SelectItem value="unifi">Unifi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCloseEditDialog}
                className="border-slate-300 font-heading bg-transparent"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={updateClient}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-heading font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deletingClient} onOpenChange={() => setDeletingClient(null)}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-red-800 font-heading text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Esta ação não pode ser desfeita. O cliente será removido permanentemente do sistema.
              </DialogDescription>
            </DialogHeader>

            {deletingClient && (
              <div className="py-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Cliente a ser excluído:</strong>
                    <br />
                    <span className="font-semibold">{deletingClient.name}</span>
                    <br />
                    <span className="text-sm text-red-600">{deletingClient.ddnsLink}</span>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setDeletingClient(null)}
                className="border-slate-300 font-heading bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDeleteClient}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-heading font-semibold text-white"
              >
                Excluir Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
