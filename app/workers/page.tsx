"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import type { Worker } from "@/store/useStore";
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

export default function WorkersPage() {
  const { workers, addWorker, updateWorker, removeWorker } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState<Partial<Worker>>({
    firstName: "",
    lastName: "",
    employeeId: "",
    department: "",
    position: "",
    dateOfBirth: "",
    dateOfJoining: "",
    contactNumber: "",
    email: "",
    address: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    qualifications: [],
    certifications: [],
    workSchedule: {
      shift: "morning",
      workingHours: "",
      daysOff: [],
    },
    salary: {
      basic: 0,
      allowances: 0,
      deductions: 0,
      netSalary: 0,
    },
    attendance: {
      totalDays: 0,
      present: 0,
      absent: 0,
      late: 0,
    },
    performance: {
      lastReviewDate: "",
      rating: 0,
      feedback: "",
    },
    documents: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorker) {
      updateWorker({ ...editingWorker, ...formData } as Worker);
    } else {
      addWorker({ ...formData, id: Date.now().toString() } as Worker);
    }
    setIsDialogOpen(false);
    setEditingWorker(null);
    setFormData({
      firstName: "",
      lastName: "",
      employeeId: "",
      department: "",
      position: "",
      dateOfBirth: "",
      dateOfJoining: "",
      contactNumber: "",
      email: "",
      address: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      qualifications: [],
      certifications: [],
      workSchedule: {
        shift: "morning",
        workingHours: "",
        daysOff: [],
      },
      salary: {
        basic: 0,
        allowances: 0,
        deductions: 0,
        netSalary: 0,
      },
      attendance: {
        totalDays: 0,
        present: 0,
        absent: 0,
        late: 0,
      },
      performance: {
        lastReviewDate: "",
        rating: 0,
        feedback: "",
      },
      documents: [],
    });
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData(worker);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Worker</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWorker ? "Edit Worker" : "Add New Worker"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                </TabsContent>
                <TabsContent value="employment" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeId: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfJoining">Date of Joining</Label>
                      <Input
                        id="dateOfJoining"
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfJoining: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="schedule" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select
                      value={formData.workSchedule?.shift}
                      onValueChange={(
                        value: "morning" | "afternoon" | "night",
                      ) =>
                        setFormData({
                          ...formData,
                          workSchedule: {
                            shift: value,
                            workingHours: formData.workSchedule?.workingHours || "",
                            daysOff: formData.workSchedule?.daysOff || [],
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input
                      id="workingHours"
                      value={formData.workSchedule?.workingHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workSchedule: {
                            shift: formData.workSchedule?.shift || "morning",
                            workingHours: e.target.value,
                            daysOff: formData.workSchedule?.daysOff || [],
                          },
                        })
                      }
                      required
                    />
                  </div>
                </TabsContent>
                <TabsContent value="performance" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Performance Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.performance?.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          performance: {
                            lastReviewDate: formData.performance?.lastReviewDate || "",
                            rating: parseInt(e.target.value),
                            feedback: formData.performance?.feedback || "",
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Input
                      id="feedback"
                      value={formData.performance?.feedback}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          performance: {
                            lastReviewDate: formData.performance?.lastReviewDate || "",
                            rating: formData.performance?.rating || 0,
                            feedback: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full">
                {editingWorker ? "Update Worker" : "Add Worker"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardHeader>
              <CardTitle>
                {worker.firstName} {worker.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">
                  ID: {worker.employeeId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Department: {worker.department}
                </p>
                <p className="text-sm text-muted-foreground">
                  Position: {worker.position}
                </p>
                <p className="text-sm text-muted-foreground">
                  Contact: {worker.contactNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Performance Rating: {worker.performance?.rating}/5
                </p>
                <p className="text-sm text-muted-foreground">
                  Shift: {worker.workSchedule?.shift}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(worker)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeWorker(worker.id)}
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
