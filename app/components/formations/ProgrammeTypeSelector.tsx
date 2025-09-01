import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useProgrammesFormation } from '@/hooks/useProgrammesFormation';

interface ProgrammeTypeSelectorProps {
  onChange: (value: string | null) => void;
  value: string | null;
  placeholder?: string;
  showAll?: boolean;
  filterType?: 'catalogue' | 'sur-mesure' | null;
}

export function ProgrammeTypeSelector({
  onChange,
  value,
  placeholder = "Sélectionner un programme...",
  showAll = true,
  filterType = null
}: ProgrammeTypeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { programmes } = useProgrammesFormation();

  const filteredProgrammes = React.useMemo(() => {
    if (!programmes) return [];
    return filterType 
      ? programmes.filter(p => p.type === filterType)
      : programmes;
  }, [programmes, filterType]);

  const selectedProgramme = React.useMemo(() => {
    if (!value || !programmes) return null;
    return programmes.find(p => p.id === value);
  }, [value, programmes]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal"
        >
          {selectedProgramme ? (
            <span className="truncate">
              {selectedProgramme.code} - {selectedProgramme.titre}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un programme..." />
          <CommandEmpty>Aucun programme trouvé.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {showAll && (
              <CommandItem
                value="__all__"
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !value ? "opacity-100" : "opacity-0"
                  )}
                />
                Tous les programmes
              </CommandItem>
            )}
            {filteredProgrammes.map((programme) => (
              <CommandItem
                key={programme.id}
                value={programme.id}
                onSelect={() => {
                  onChange(programme.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === programme.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{programme.code} - {programme.titre}</span>
                  <span className="text-xs text-muted-foreground">{programme.type}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
