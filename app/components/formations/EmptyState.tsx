import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Archive, Plus } from "lucide-react";
import { EmptyStateProps } from "./types";

export const EmptyState = ({ type, onCreate }: EmptyStateProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-center py-10">
        <Archive className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold">
          {type ? `Aucun programme ${type}` : "Aucun programme"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer un nouveau programme.</p>
        <div className="mt-6">
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau programme
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);