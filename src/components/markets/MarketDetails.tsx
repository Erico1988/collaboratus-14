import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BadgeEuro, Calendar, User, Mail, Building2, Tag, FileText, Download } from "lucide-react";
import { MarketStatusBadge } from "./MarketStatusBadge";
import { MarketRiskBadge } from "./MarketRiskBadge";
import { MarketDocuments } from "./MarketDocuments";
import { MarketWorkflow } from "./MarketWorkflow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Market } from "@/types/market";

interface MarketDetailsProps {
  market: Market | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MarketDetails = ({ market, isOpen, onClose }: MarketDetailsProps) => {
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "workflow" | "history">(
    "info"
  );

  if (!market) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">{market.title}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <MarketStatusBadge status={market.status} />
                  <span className="text-sm text-gray-500">Ref: {market.id}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
            
            {market.description && (
              <p className="text-muted-foreground">{market.description}</p>
            )}
          </div>

          <Tabs defaultValue="info" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations financières</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Budget</span>
                        <div className="flex items-center gap-2">
                          <BadgeEuro className="h-4 w-4 text-gray-400" />
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(market.budget)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Date d'échéance</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {format(new Date(market.deadline), 'dd MMMM yyyy', { locale: fr })}
                        </div>
                      </div>
                      
                      {market.createdAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Date de création</span>
                          <span>
                            {format(new Date(market.createdAt), 'dd MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Évaluation des risques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Niveau de risque
                        </span>
                        <MarketRiskBadge level={market.riskLevel} />
                      </div>
                      
                      {market.department && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Département</span>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>{market.department}</span>
                          </div>
                        </div>
                      )}
                      
                      {market.tags && market.tags.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-gray-500">Tags</span>
                          <div className="flex flex-wrap gap-2">
                            {market.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {market.contactName && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Contact</div>
                          <div className="font-medium">{market.contactName}</div>
                        </div>
                      </div>
                    )}
                    
                    {market.contactEmail && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium">{market.contactEmail}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <MarketDocuments marketId={market.id} />
            </TabsContent>
            
            <TabsContent value="workflow" className="mt-6">
              <MarketWorkflow market={market} />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Création du marché</p>
                            <p className="text-sm text-muted-foreground">Par Administrateur</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {market.createdAt && format(new Date(market.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          Création initiale du marché avec le statut <Badge className="bg-slate-500">Brouillon</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {market.status !== 'brouillon' && (
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Validation du marché</p>
                              <p className="text-sm text-muted-foreground">Par Administrateur</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {market.createdAt && format(new Date(new Date(market.createdAt).getTime() + 86400000), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            Changement de statut de <Badge className="bg-slate-500">Brouillon</Badge> à <Badge className="bg-yellow-500">En attente</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {market.status === 'en_cours' && (
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Publication du marché</p>
                              <p className="text-sm text-muted-foreground">Par Administrateur</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {market.createdAt && format(new Date(new Date(market.createdAt).getTime() + 172800000), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            Changement de statut de <Badge className="bg-yellow-500">En attente</Badge> à <Badge className="bg-blue-500">En cours</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {market.status === 'termine' && (
                      <>
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Publication du marché</p>
                                <p className="text-sm text-muted-foreground">Par Administrateur</p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {market.createdAt && format(new Date(new Date(market.createdAt).getTime() + 172800000), 'dd MMM yyyy à HH:mm', { locale: fr })}
                              </div>
                            </div>
                            <div className="mt-2 text-sm">
                              Changement de statut de <Badge className="bg-yellow-500">En attente</Badge> à <Badge className="bg-blue-500">En cours</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Clôture du marché</p>
                                <p className="text-sm text-muted-foreground">Par Administrateur</p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {market.updatedAt && format(new Date(market.updatedAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                              </div>
                            </div>
                            <div className="mt-2 text-sm">
                              Changement de statut de <Badge className="bg-blue-500">En cours</Badge> à <Badge className="bg-green-500">Terminé</Badge>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {market.status === 'annule' && (
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Annulation du marché</p>
                              <p className="text-sm text-muted-foreground">Par Administrateur</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {market.updatedAt && format(new Date(market.updatedAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            Changement de statut à <Badge className="bg-red-500">Annulé</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};