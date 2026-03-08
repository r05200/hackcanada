import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";
import Button from "../components/ui/Button";

const REWARDS = [
  {
    id: 1,
    name: "Bus Pass – 20% Off",
    description: "Save on your monthly transit pass with the city bus network.",
    cost: 200,
    icon: "directions_bus",
    brand: "City Transit",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: 2,
    name: "Coffee – Free Medium",
    description: "Redeem a free medium coffee at any participating café location.",
    cost: 100,
    icon: "coffee",
    brand: "Local Café Co.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: 3,
    name: "Bike Share – 1 Free Ride",
    description: "Enjoy one free 30-minute ride with the city bike share program.",
    cost: 75,
    icon: "pedal_bike",
    brand: "GreenWheel",
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    id: 4,
    name: "Movie Ticket – $5 Off",
    description: "Get $5 off your next movie ticket at any partner cinema.",
    cost: 150,
    icon: "movie",
    brand: "CineMax",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    id: 5,
    name: "Grocery Voucher – $3",
    description: "A $3 discount on your next grocery order at FreshMart stores.",
    cost: 120,
    icon: "shopping_cart",
    brand: "FreshMart",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    id: 6,
    name: "Gym Day Pass",
    description: "One free day pass to any FitCity gym location in your area.",
    cost: 250,
    icon: "fitness_center",
    brand: "FitCity",
    color: "bg-rose-50 text-rose-600 border-rose-200",
  },
  {
    id: 7,
    name: "Park Parking – 2 Hours Free",
    description: "Two hours of free parking at any city-owned park lot.",
    cost: 80,
    icon: "local_parking",
    brand: "City Parks",
    color: "bg-teal-50 text-teal-600 border-teal-200",
  },
  {
    id: 8,
    name: "Library Late Fee Waiver",
    description: "Waive up to $10 in late fees at any city library branch.",
    cost: 60,
    icon: "menu_book",
    brand: "Public Library",
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
];

export default function Store() {
  const navigate = useNavigate();
  const user = getUser();
  const [points, setPoints] = useState(user?.xp || 0);
  const [confirmId, setConfirmId] = useState(null);
  const [purchased, setPurchased] = useState([]);

  const handleBuy = (reward) => {
    if (points < reward.cost) return;
    setPoints((p) => p - reward.cost);
    setPurchased((prev) => [...prev, reward.id]);
    setConfirmId(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="size-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-600">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl fill">storefront</span>
            Rewards Store
          </h1>
          <p className="text-slate-500 mt-0.5">Redeem your hard-earned points for real rewards.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <span className="material-symbols-outlined fill text-primary text-lg">star</span>
          <span className="text-lg font-extrabold text-primary">{points} pts</span>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REWARDS.map((reward) => {
          const owned = purchased.includes(reward.id);
          const canAfford = points >= reward.cost;
          return (
            <div
              key={reward.id}
              className={`relative rounded-2xl border bg-white p-5 flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                owned ? "opacity-60 border-slate-100" : "border-slate-100"
              }`}
            >
              {/* Icon + Brand */}
              <div className="flex items-start justify-between">
                <div className={`size-12 rounded-xl border flex items-center justify-center ${reward.color}`}>
                  <span className="material-symbols-outlined text-2xl">{reward.icon}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{reward.brand}</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">{reward.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{reward.description}</p>
              </div>

              {/* Price + Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined fill text-primary text-sm">star</span>
                  <span className="font-extrabold text-slate-900">{reward.cost}</span>
                  <span className="text-xs text-slate-400">pts</span>
                </div>
                {owned ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-sm fill">check_circle</span>
                    Redeemed
                  </span>
                ) : confirmId === reward.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleBuy(reward)}
                      className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => canAfford && setConfirmId(reward.id)}
                    disabled={!canAfford}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      canAfford
                        ? "text-primary bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        : "text-slate-400 bg-slate-50 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Redeem" : "Not enough"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
