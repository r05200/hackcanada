import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { submitReport, analyzeImage } from "../api/reports";

const URGENCY_LEVELS = [
  { id: "low", label: "Low", color: "text-green-600 bg-green-50 border-green-200", icon: "info" },
  { id: "medium", label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200", icon: "warning" },
  { id: "high", label: "High", color: "text-orange-600 bg-orange-50 border-orange-200", icon: "priority_high" },
  { id: "critical", label: "Critical", color: "text-red-600 bg-red-50 border-red-200", icon: "emergency" },
];

export default function Report() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageSelect = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to backend → save as UPLOADED_IMAGE.jpg → run AI
    setAiAnalyzing(true);
    setAiTopic("");
    try {
      const res = await analyzeImage(file);
      setAiTopic(res.data.topic || "Unknown");
    } catch {
      setAiTopic("Detection failed");
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleImageSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!image || !location || !urgency) return;
    setSubmitting(true);
    try {
      await submitReport({
        topic: aiTopic,
        location,
        urgency,
        description,
      });
      setSuccess(true);
    } catch (e) {
      alert("Submission failed: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setImage(null);
    setImagePreview(null);
    setAiTopic("");
    setLocation("");
    setUrgency(null);
    setDescription("");
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg text-center py-20 space-y-6 animate-fade-in">
        <div className="size-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
          <span className="material-symbols-outlined text-primary text-4xl fill">check_circle</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Report Submitted!</h1>
        <p className="text-slate-500">Thank you for making your community better. You've earned <span className="font-bold text-primary">+50 XP</span>!</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate("/")}>Back to Home</Button>
          <Button variant="secondary" onClick={resetForm}>Report Another</Button>
        </div>
      </div>
    );
  }

  const canSubmit = image && aiTopic && location && urgency && !aiAnalyzing;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl fill">report</span>
            Report an Issue
          </h1>
          <p className="text-slate-500 mt-1">Upload a photo and our AI will identify the problem.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
          <span className="material-symbols-outlined fill text-amber-500 text-base">stars</span>
          <span className="text-sm font-bold text-amber-700">+50 Points</span>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">photo_camera</span>
          Upload Photo
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : imagePreview
              ? "border-slate-200 bg-white"
              : "border-slate-300 bg-slate-50 hover:border-primary hover:bg-primary/5"
          } ${imagePreview ? "p-2" : "p-8"}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageSelect(e.target.files?.[0])}
          />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Uploaded" className="w-full max-h-64 object-cover rounded-lg" />
              <button
                onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); setAiTopic(""); }}
                className="absolute top-2 right-2 size-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-white text-sm">close</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              <div className="text-center">
                <p className="font-semibold text-slate-600">Drag & drop or click to upload</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, HEIC up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Topic (auto-filled) */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">smart_toy</span>
          Topic
          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI Detected</span>
        </label>
        <div className={`relative rounded-xl border-2 px-4 py-3 transition-all ${
          aiAnalyzing ? "border-primary/50 bg-primary/5" : aiTopic ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50"
        }`}>
          {aiAnalyzing ? (
            <div className="flex items-center gap-3">
              <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-primary font-medium">AI analyzing image...</span>
            </div>
          ) : aiTopic ? (
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-semibold">{aiTopic}</span>
              <span className="material-symbols-outlined text-primary fill text-base">verified</span>
            </div>
          ) : (
            <span className="text-slate-400 text-sm">Upload a photo to auto-detect the topic</span>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">location_on</span>
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. 123 Main St, or intersection of Oak & Elm"
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Urgency */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">speed</span>
          Urgency Level
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {URGENCY_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setUrgency(level.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all hover:scale-[1.03] ${
                urgency === level.id
                  ? level.color + " shadow-md"
                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-base">{level.icon}</span>
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description (optional) */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">description</span>
          Description <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any additional details about the issue..."
          rows={3}
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </div>
  );
}
