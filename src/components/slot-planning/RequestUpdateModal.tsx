import { useState, useMemo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";

interface Visit {
  id: number;
  name: string;
  type: "doctor" | "pharmacist";
}

interface RequestUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorVisits: Visit[];
  pharmacistVisits: Visit[];
  onSubmit: (data: {
    visitType: string;
    visitId: number;
    notes: string;
  }) => void;
}

export function RequestUpdateModal({
  open,
  onOpenChange,
  doctorVisits,
  pharmacistVisits,
  onSubmit,
}: RequestUpdateModalProps) {
  const [visitType, setVisitType] = useState<string>("");
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const filteredVisits = useMemo(() => {
    if (visitType === "doctor") return doctorVisits;
    if (visitType === "pharmacist") return pharmacistVisits;
    return [];
  }, [visitType, doctorVisits, pharmacistVisits]);

  const resetForm = () => {
    setVisitType("");
    setSelectedVisitId(null);
    setNotes("");
  };

  const handleSubmit = () => {
    if (!selectedVisitId) return;

    onSubmit({
      visitType,
      visitId: selectedVisitId,
      notes,
    });

    resetForm();
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Slot Update</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Visit Type */}
          <div className="space-y-2">
            <Label>Visit Type</Label>
            <Select
              value={visitType}
              onValueChange={(value) => {
                setVisitType(value);
                setSelectedVisitId(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor Visit</SelectItem>
                <SelectItem value="pharmacist">Pharmacist Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visit Selection */}
          {visitType && (
            <div className="space-y-2">
              <Label>Select Visit to Update</Label>

              <RadioGroup
                value={selectedVisitId?.toString()}
                onValueChange={(value) =>
                  setSelectedVisitId(Number(value))
                }
                className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2"
              >
                {filteredVisits.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No {visitType} visits scheduled for today
                  </p>
                ) : (
                  filteredVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50"
                    >
                      <RadioGroupItem
                        value={visit.id.toString()}
                        id={`visit-${visit.id}`}
                      />
                      <label
                        htmlFor={`visit-${visit.id}`}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {visit.name}
                      </label>
                    </div>
                  ))
                )}
              </RadioGroup>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide reason for update request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!visitType || !selectedVisitId || !notes.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
