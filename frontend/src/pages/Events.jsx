import { useState } from "react";
import { Link } from "react-router-dom";
import { listEvents, createEvent } from "../api/events";
import useFetch from "../hooks/useFetch";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { formatDate } from "../lib/utils";

const MOCK_EVENTS = [
  {
    id: "mock-1",
    title: "Park Clean-Up Day",
    description: "Join your neighbors to clean up Riverside Park. Gloves and bags provided. Help keep our green spaces beautiful for everyone!",
    location: "Riverside Park Pavilion",
    starts_at: "2026-03-15T09:00:00Z",
    xp_reward: 120,
    tags: ["Volunteering", "Environment", "Outdoors"],
  },
  {
    id: "mock-2",
    title: "Town Hall: Transit Improvements",
    description: "City council town hall to discuss proposed bus route changes and new bike lane installations in the downtown core.",
    location: "City Hall Room 204",
    starts_at: "2026-03-12T18:30:00Z",
    xp_reward: 80,
    tags: ["Civic", "Transit", "Government"],
  },
  {
    id: "mock-3",
    title: "Community Garden Planting",
    description: "Spring planting season kickoff! Bring your gardening tools and help us plant vegetables and flowers in the community garden.",
    location: "Oak Street Community Garden",
    starts_at: "2026-03-22T10:00:00Z",
    xp_reward: 100,
    tags: ["Environment", "Gardening", "Community"],
  },
  {
    id: "mock-4",
    title: "Neighbourhood Watch Meeting",
    description: "Monthly safety meeting to discuss recent incidents and coordinate neighbourhood patrol schedules.",
    location: "Lincoln Community Centre",
    starts_at: "2026-03-10T19:00:00Z",
    xp_reward: 60,
    tags: ["Safety", "Community", "Monthly"],
  },
  {
    id: "mock-5",
    title: "Free Bike Repair Workshop",
    description: "Learn basic bike maintenance, get your bike tuned up for free, and meet fellow cyclists from the area.",
    location: "Central Library - Maker Space",
    starts_at: "2026-03-18T14:00:00Z",
    xp_reward: 75,
    tags: ["Workshop", "Transit", "Education"],
  },
  {
    id: "mock-6",
    title: "Youth Coding Bootcamp",
    description: "Free 3-hour intro to coding for kids ages 10-16. No experience needed. Laptops provided.",
    location: "Westside Public Library",
    starts_at: "2026-03-29T13:00:00Z",
    xp_reward: 90,
    tags: ["Education", "Youth", "Technology"],
  },
  {
    id: "mock-7",
    title: "Street Mural Painting",
    description: "Help local artists paint a vibrant mural on the underpass wall. All skill levels welcome. Paint and brushes provided.",
    location: "5th Ave Underpass",
    starts_at: "2026-04-02T11:00:00Z",
    xp_reward: 110,
    tags: ["Art", "Community", "Outdoors"],
  },
  {
    id: "mock-8",
    title: "Food Drive Collection Day",
    description: "Drop off non-perishable food items or volunteer to sort and distribute donations to local families in need.",
    location: "St. Mary's Church Hall",
    starts_at: "2026-03-20T08:00:00Z",
    xp_reward: 100,
    tags: ["Volunteering", "Charity", "Community"],
  },
];

const TAG_COLORS = {
  Volunteering: "green",
  Environment: "green",
  Outdoors: "blue",
  Civic: "purple",
  Transit: "blue",
  Government: "purple",
  Gardening: "green",
  Community: "blue",
  Safety: "red",
  Monthly: "gray",
  Workshop: "purple",
  Education: "purple",
  Youth: "blue",
  Technology: "blue",
  Art: "purple",
  Charity: "green",
};

export default function Events() {
  const [neighborhood, setNeighborhood] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const {
    data: apiEvents,
    loading,
    error,
    execute: refetch,
  } = useFetch(() => listEvents(neighborhood ? { neighborhood } : {}), [neighborhood]);

  const events = apiEvents?.length ? apiEvents : MOCK_EVENTS;

  const handleFilter = (e) => {
    e.preventDefault();
    refetch();
  };

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl fill">event</span>
            Events
          </h1>
          <p className="text-slate-500 mt-1">Discover and join community events near you.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <span className="material-symbols-outlined text-base">add</span>
          Create Event
        </Button>
      </div>

      <form onSubmit={handleFilter} className="mb-6 flex max-w-sm gap-2">
        <Input
          id="neighborhood"
          placeholder="Filter by neighborhood…"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        />
      </form>

      {events?.length === 0 && (
        <p className="text-slate-500">No events found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events?.map((ev) => (
          <Link key={ev.id} to={ev.id.startsWith?.("mock") ? "#" : `/events/${ev.id}`}>
            <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5 h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-lg">event</span>
                  <CardTitle>{ev.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 line-clamp-2 text-sm text-slate-600">{ev.description}</p>
                <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {formatDate(ev.starts_at)}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {ev.location}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge color="green">{ev.xp_reward} XP</Badge>
                  {ev.tags?.map((t) => (
                    <Badge key={t} color={TAG_COLORS[t] || "blue"}>
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); refetch(); }} />}
    </div>
  );
}

function CreateEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    starts_at: "",
    xp_reward: 100,
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.starts_at) return;
    setSubmitting(true);
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        location: form.location,
        starts_at: form.starts_at,
        xp_reward: Number(form.xp_reward) || 100,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onCreated();
    } catch (err) {
      alert("Failed to create event: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary fill">add_circle</span>
            Create Event
          </h2>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Park Clean-Up Day"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="What's the event about?"
              rows={3}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={set("location")}
                placeholder="e.g. City Hall"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Date & Time *</label>
              <input
                type="datetime-local"
                value={form.starts_at}
                onChange={set("starts_at")}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">XP Reward</label>
              <input
                type="number"
                value={form.xp_reward}
                onChange={set("xp_reward")}
                min="0"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={set("tags")}
                placeholder="e.g. Volunteer, Outdoors"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">Comma-separated</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting || !form.title || !form.starts_at}>
              {submitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
