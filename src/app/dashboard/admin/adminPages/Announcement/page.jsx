"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Announcement() {
  const [active, setActive] = useState(false);
  const [delay, setDelay] = useState("2.00");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8000/api/announcement";

  // Fetch announcement data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_BASE);
        const data = res.data;
        setActive(data?.active || false);
        setDelay(data?.delay?.toFixed(2) || "2.00");
        setImagePreview(data?.imageUrl || null);
      } catch (err) {
        console.error("Error fetching announcement:", err.message);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("active", active);
    formData.append("delay", delay);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("✅ Announcement updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Update Announcement Popup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle Active */}
        <div className="flex items-center justify-between">
          <Label>Announcement Popup</Label>
          <Switch checked={active} onCheckedChange={setActive} />
          <span
            className={`px-3 py-1 rounded text-white text-sm ${
              active ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Image Upload */}
        <div>
          <Label className="block mb-2">Announcement Image</Label>
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-64 h-auto rounded shadow"
              />
            </div>
          )}
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          <p className="text-xs text-muted-foreground mt-1">
            Upload 960x519px (JPG, PNG) for best quality.
          </p>
        </div>

        {/* Delay Input */}
        <div>
          <Label className="block mb-2">Popup Delay (Seconds)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </CardContent>
    </Card>
  );
}
