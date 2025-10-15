import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AddElderlyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddElderlyDialog = ({ open, onOpenChange, onSuccess }: AddElderlyDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name") as string,
      age: parseInt(formData.get("age") as string) || null,
      address: formData.get("address") as string || null,
      medical_notes: formData.get("medical_notes") as string || null,
      inactivity_threshold_hours: parseInt(formData.get("threshold") as string) || 24,
    };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add profiles",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("elderly_profiles").insert({
      ...data,
      caregiver_id: user.id,
    });

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding profile",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile added successfully",
        description: `${data.full_name} is now being monitored`,
      });
      onOpenChange(false);
      onSuccess();
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Elderly Profile</DialogTitle>
          <DialogDescription>
            Add a new person to monitor for inactivity alerts
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min="1"
              max="150"
              placeholder="75"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main St, City"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Inactivity Alert Threshold (hours) *</Label>
            <Input
              id="threshold"
              name="threshold"
              type="number"
              min="1"
              required
              defaultValue="24"
              placeholder="24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_notes">Medical Notes</Label>
            <Textarea
              id="medical_notes"
              name="medical_notes"
              placeholder="Any important medical information..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};