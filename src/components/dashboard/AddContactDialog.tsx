import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface Contact {
  id: string;
  full_name: string;
  relationship: string | null;
  email: string | null;
  phone: string | null;
  preferred_alert_method: "email" | "sms" | "voice_call";
  is_primary: boolean;
}

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elderlyProfileId: string;
  contact?: Contact | null;
}

export function AddContactDialog({
  open,
  onOpenChange,
  elderlyProfileId,
  contact,
}: AddContactDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    relationship: "",
    email: "",
    phone: "",
    preferred_alert_method: "email" as "email" | "sms" | "voice_call",
    is_primary: false,
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        full_name: contact.full_name,
        relationship: contact.relationship || "",
        email: contact.email || "",
        phone: contact.phone || "",
        preferred_alert_method: contact.preferred_alert_method,
        is_primary: contact.is_primary,
      });
    } else {
      setFormData({
        full_name: "",
        relationship: "",
        email: "",
        phone: "",
        preferred_alert_method: "email",
        is_primary: false,
      });
    }
  }, [contact, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.full_name.trim()) {
        throw new Error("Name is required");
      }

      if (!formData.email && !formData.phone) {
        throw new Error("Please provide at least email or phone number");
      }

      const contactData = {
        full_name: formData.full_name.trim(),
        relationship: formData.relationship.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        preferred_alert_method: formData.preferred_alert_method,
        is_primary: formData.is_primary,
        elderly_profile_id: elderlyProfileId,
      };

      if (contact) {
        const { error } = await supabase
          .from("contacts")
          .update(contactData)
          .eq("id", contact.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Contact updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("contacts")
          .insert([contactData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Contact added successfully",
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Add Emergency Contact"}</DialogTitle>
          <DialogDescription>
            Add family members, friends, or caregivers who should receive alerts
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              value={formData.relationship}
              onChange={(e) =>
                setFormData({ ...formData, relationship: e.target.value })
              }
              placeholder="e.g., Daughter, Son, Friend, Neighbor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_alert_method">Preferred Alert Method</Label>
            <Select
              value={formData.preferred_alert_method}
              onValueChange={(value: "email" | "sms" | "voice_call") =>
                setFormData({ ...formData, preferred_alert_method: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="voice_call">Voice Call</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="is_primary">Primary Contact</Label>
              <p className="text-sm text-muted-foreground">
                Primary contacts are notified first
              </p>
            </div>
            <Switch
              id="is_primary"
              checked={formData.is_primary}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_primary: checked })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : contact ? "Update" : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
