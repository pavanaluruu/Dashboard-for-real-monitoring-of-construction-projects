"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import type { SiteInfo } from "@/store/useStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SitesPage() {
  const { sites, addSite, updateSite, removeSite, selectedSite, setSelectedSite } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteInfo | null>(null);
  const [formData, setFormData] = useState<Partial<SiteInfo>>({
    name: "",
    location: "",
    projectType: "",
    startDate: "",
    expectedCompletionDate: "",
    totalWorkers: 0,
    safetyCompliance: 0,
    lastUpdated: new Date().toISOString(),
    siteManager: {
      name: "",
      contactNumber: "",
    },
    emergencyContacts: [],
    safetyOfficer: {
      name: "",
      contactNumber: "",
      certificationNumber: "",
    },
    siteStatus: "active",
    workHours: {
      start: "",
      end: "",
      breakTimes: [],
    },
    safetyMeasures: {
      firstAidKits: 0,
      fireExtinguishers: 0,
      emergencyExits: 0,
      safetySigns: false,
      lastSafetyAudit: "",
    },
    equipment: [],
    permits: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSite) {
      updateSite({ ...editingSite, ...formData } as SiteInfo);
    } else {
      addSite({ ...formData, id: Date.now().toString() } as SiteInfo);
    }
    setIsDialogOpen(false);
    setEditingSite(null);
    setFormData({
      name: "",
      location: "",
      projectType: "",
      startDate: "",
      expectedCompletionDate: "",
      totalWorkers: 0,
      safetyCompliance: 100,
      lastUpdated: new Date().toISOString(),
      siteManager: {
        name: "",
        contactNumber: "",
      },
      emergencyContacts: [],
      safetyOfficer: {
        name: "",
        contactNumber: "",
        certificationNumber: "",
      },
      siteStatus: "active",
      workHours: {
        start: "",
        end: "",
        breakTimes: [],
      },
      permits: [],
    });
  };

  const handleEdit = (site: SiteInfo) => {
    setEditingSite(site);
    setFormData(site);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Construction Sites</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Site</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSite ? "Edit Site" : "Add New Site"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Site Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <Input
                        id="projectType"
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({ ...formData, projectType: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteStatus">Site Status</Label>
                      <Select
                        value={formData.siteStatus}
                        onValueChange={(value: "active" | "completed" | "on-hold") =>
                          setFormData({ ...formData, siteStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedCompletionDate">Expected Completion</Label>
                      <Input
                        id="expectedCompletionDate"
                        type="date"
                        value={formData.expectedCompletionDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expectedCompletionDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workHoursStart">Work Hours Start</Label>
                      <Input
                        id="workHoursStart"
                        type="time"
                        value={formData.workHours?.start || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workHours: {
                              start: e.target.value,
                              end: formData.workHours?.end || "",
                              breakTimes: formData.workHours?.breakTimes || [],
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workHoursEnd">Work Hours End</Label>
                      <Input
                        id="workHoursEnd"
                        type="time"
                        value={formData.workHours?.end || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workHours: {
                              start: formData.workHours?.start || "",
                              end: e.target.value,
                              breakTimes: formData.workHours?.breakTimes || [],
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="contacts" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site Manager</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Name"
                        value={formData.siteManager?.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            siteManager: {
                              name: e.target.value,
                              contactNumber: formData.siteManager?.contactNumber || "",
                            },
                          })
                        }
                        required
                      />
                      <Input
                        placeholder="Contact Number"
                        value={formData.siteManager?.contactNumber || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            siteManager: {
                              name: formData.siteManager?.name || "",
                              contactNumber: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Safety Officer</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Name"
                        value={formData.safetyOfficer?.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            safetyOfficer: {
                              name: e.target.value,
                              contactNumber: formData.safetyOfficer?.contactNumber || "",
                              certificationNumber: formData.safetyOfficer?.certificationNumber || "",
                            },
                          })
                        }
                        required
                      />
                      <Input
                        placeholder="Contact Number"
                        value={formData.safetyOfficer?.contactNumber || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            safetyOfficer: {
                              name: formData.safetyOfficer?.name || "",
                              contactNumber: e.target.value,
                              certificationNumber: formData.safetyOfficer?.certificationNumber || "",
                            },
                          })
                        }
                        required
                      />
                      <Input
                        placeholder="Certification Number"
                        value={formData.safetyOfficer?.certificationNumber || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            safetyOfficer: {
                              name: formData.safetyOfficer?.name || "",
                              contactNumber: formData.safetyOfficer?.contactNumber || "",
                              certificationNumber: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full">
                {editingSite ? "Update Site" : "Add Site"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site: SiteInfo) => (
          <Card
            key={site.id}
            className={`cursor-pointer transition-colors ${
              selectedSite === site.id ? "border-primary" : ""
            }`}
            onClick={() => setSelectedSite(site.id)}
          >
            <CardHeader>
              <CardTitle>{site.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">
                  Location: {site.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Project Type: {site.projectType}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      site.siteStatus === "active"
                        ? "bg-green-100 text-green-800"
                        : site.siteStatus === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {site.siteStatus}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Site Manager: {site.siteManager.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Work Hours: {site.workHours.start} - {site.workHours.end}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last Updated: {new Date(site.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(site);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSite(site.id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
