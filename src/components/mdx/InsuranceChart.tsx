"use client";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#f59e0b", "#fb923c", "#fbbf24", "#d97706", "#b45309"];

interface ChartProps {
  title?: string;
  description?: string;
}

// Plan Comparison Bar Chart
export function PlanComparisonChart({ title = "Insurance Plan Comparison" }: ChartProps) {
  const data = [
    { name: "Basic", monthly: 15, coverage: 5000, deductible: 250 },
    { name: "Standard", monthly: 35, coverage: 10000, deductible: 200 },
    { name: "Premium", monthly: 55, coverage: 20000, deductible: 100 },
    { name: "Comprehensive", monthly: 85, coverage: 50000, deductible: 0 },
  ];

  useCopilotReadable({
    description: "Insurance plan comparison data showing monthly costs and coverage limits",
    value: JSON.stringify(data),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-stone-900 to-stone-800 border border-amber-500/20 rounded-2xl p-6 my-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                border: "1px solid #f59e0b33",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#f59e0b" }}
            />
            <Legend />
            <Bar dataKey="monthly" name="Monthly Cost (£)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="deductible" name="Deductible (£)" fill="#fb923c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Coverage Breakdown Pie Chart
export function CoverageBreakdownChart({ title = "What's Typically Covered" }: ChartProps) {
  const data = [
    { name: "Accidents", value: 30 },
    { name: "Illness", value: 25 },
    { name: "Surgery", value: 20 },
    { name: "Prescriptions", value: 15 },
    { name: "Preventive Care", value: 10 },
  ];

  useCopilotReadable({
    description: "Pet insurance coverage breakdown showing what types of care are typically covered",
    value: JSON.stringify(data),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-stone-900 to-stone-800 border border-amber-500/20 rounded-2xl p-6 my-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                border: "1px solid #f59e0b33",
                borderRadius: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Breed Risk Factor Chart
export function BreedRiskChart({ title = "Insurance Costs by Breed Risk" }: ChartProps) {
  const data = [
    { breed: "Mixed Breed", multiplier: 0.85, category: "Low" },
    { breed: "Beagle", multiplier: 0.9, category: "Low" },
    { breed: "Labrador", multiplier: 1.0, category: "Medium" },
    { breed: "Golden Retriever", multiplier: 1.1, category: "Medium" },
    { breed: "French Bulldog", multiplier: 1.4, category: "High" },
    { breed: "Bulldog", multiplier: 1.5, category: "High" },
    { breed: "Cavalier KC", multiplier: 1.45, category: "High" },
  ];

  useCopilotReadable({
    description: "Breed risk factors affecting insurance premiums",
    value: JSON.stringify(data),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-stone-900 to-stone-800 border border-amber-500/20 rounded-2xl p-6 my-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" domain={[0, 2]} />
            <YAxis dataKey="breed" type="category" stroke="#9ca3af" width={90} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                border: "1px solid #f59e0b33",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#f59e0b" }}
              formatter={(value) => [`${value}x premium`, "Risk Multiplier"]}
            />
            <Bar
              dataKey="multiplier"
              fill="#f59e0b"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <span className="flex items-center gap-2 text-sm text-white/70">
          <span className="w-3 h-3 rounded-full bg-green-500" /> Low Risk
        </span>
        <span className="flex items-center gap-2 text-sm text-white/70">
          <span className="w-3 h-3 rounded-full bg-yellow-500" /> Medium Risk
        </span>
        <span className="flex items-center gap-2 text-sm text-white/70">
          <span className="w-3 h-3 rounded-full bg-red-500" /> High Risk
        </span>
      </div>
    </motion.div>
  );
}

// Age Cost Trend Chart
export function AgeCostChart({ title = "How Age Affects Insurance Cost" }: ChartProps) {
  const data = [
    { age: "< 1 year", adjustment: 10, premium: 38.5 },
    { age: "1-2 years", adjustment: 0, premium: 35 },
    { age: "3-4 years", adjustment: 0, premium: 35 },
    { age: "5-6 years", adjustment: 10, premium: 38.5 },
    { age: "7-8 years", adjustment: 30, premium: 45.5 },
    { age: "9-10 years", adjustment: 50, premium: 52.5 },
    { age: "10+ years", adjustment: 75, premium: 61.25 },
  ];

  useCopilotReadable({
    description: "Age-based premium adjustments for pet insurance",
    value: JSON.stringify(data),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-stone-900 to-stone-800 border border-amber-500/20 rounded-2xl p-6 my-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="age" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                border: "1px solid #f59e0b33",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#f59e0b" }}
              formatter={(value, name) => [
                name === "premium" ? `£${value}/month` : `+${value}%`,
                name === "premium" ? "Est. Premium" : "Age Adjustment",
              ]}
            />
            <Area
              type="monotone"
              dataKey="premium"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorPremium)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Interactive Quote Calculator
export function QuoteCalculator() {
  const [breed, setBreed] = useState("labrador");
  const [age, setAge] = useState(2);
  const [plan, setPlan] = useState("standard");
  const [quote, setQuote] = useState<number | null>(null);

  const breeds: Record<string, number> = {
    "mixed-breed": 0.85,
    beagle: 0.9,
    labrador: 1.0,
    "golden-retriever": 1.1,
    "jack-russell": 0.95,
    pug: 1.35,
    "french-bulldog": 1.4,
    cockapoo: 1.05,
    cavapoo: 1.15,
    dachshund: 1.1,
  };

  const plans: Record<string, number> = {
    basic: 15,
    standard: 35,
    premium: 55,
    comprehensive: 85,
  };

  const calculateQuote = () => {
    let basePremium = plans[plan];
    let multiplier = breeds[breed] || 1.0;

    // Age adjustments
    if (age < 1) multiplier *= 1.1;
    else if (age >= 7 && age < 10) multiplier *= 1.3;
    else if (age >= 10) multiplier *= 1.5;

    setQuote(Math.round(basePremium * multiplier * 100) / 100);
  };

  useCopilotReadable({
    description: "User's quote calculator selections",
    value: JSON.stringify({ breed, age, plan, quote }),
  });

  useCopilotAction({
    name: "calculate_quick_quote",
    description: "Calculate a quick insurance quote based on breed, age, and plan",
    parameters: [
      { name: "breed", type: "string", description: "Dog breed" },
      { name: "age", type: "number", description: "Dog age in years" },
      { name: "plan", type: "string", description: "Insurance plan type" },
    ],
    handler: ({ breed: b, age: a, plan: p }) => {
      setBreed(b);
      setAge(a);
      setPlan(p);
      setTimeout(calculateQuote, 100);
      return `Calculated quote for ${b}, ${a} years old, ${p} plan`;
    },
  });

  useEffect(() => {
    calculateQuote();
  }, [breed, age, plan]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl p-6 my-8"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Quick Quote Calculator</h3>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Breed Select */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Breed</label>
          <select
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="mixed-breed">Mixed Breed</option>
            <option value="beagle">Beagle</option>
            <option value="labrador">Labrador</option>
            <option value="golden-retriever">Golden Retriever</option>
            <option value="jack-russell">Jack Russell</option>
            <option value="pug">Pug</option>
            <option value="french-bulldog">French Bulldog</option>
            <option value="cockapoo">Cockapoo</option>
            <option value="cavapoo">Cavapoo</option>
            <option value="dachshund">Dachshund</option>
          </select>
        </div>

        {/* Age Input */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Age (years)</label>
          <input
            type="number"
            min="0"
            max="20"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value) || 0)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Plan Select */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="basic">Basic (£15/mo)</option>
            <option value="standard">Standard (£35/mo)</option>
            <option value="premium">Premium (£55/mo)</option>
            <option value="comprehensive">Comprehensive (£85/mo)</option>
          </select>
        </div>
      </div>

      {/* Quote Result */}
      <div className="bg-stone-900/50 rounded-xl p-6 text-center">
        <div className="text-white/70 text-sm mb-2">Estimated Monthly Premium</div>
        <div className="text-5xl font-bold text-amber-400 mb-2">
          £{quote?.toFixed(2) || "0.00"}
        </div>
        <div className="text-white/50 text-sm">per month</div>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all"
        >
          Get Full Quote
        </a>
      </div>
    </motion.div>
  );
}

// Feature Comparison Table
export function FeatureComparisonTable() {
  const features = [
    { name: "Accident Coverage", basic: true, standard: true, premium: true, comprehensive: true },
    { name: "Illness Coverage", basic: false, standard: true, premium: true, comprehensive: true },
    { name: "Emergency Care", basic: true, standard: true, premium: true, comprehensive: true },
    { name: "Prescriptions", basic: false, standard: true, premium: true, comprehensive: true },
    { name: "Surgery", basic: false, standard: true, premium: true, comprehensive: true },
    { name: "Routine Care", basic: false, standard: false, premium: true, comprehensive: true },
    { name: "Dental Care", basic: false, standard: false, premium: true, comprehensive: true },
    { name: "Hereditary Conditions", basic: false, standard: false, premium: true, comprehensive: true },
    { name: "Alternative Therapies", basic: false, standard: false, premium: false, comprehensive: true },
    { name: "Behavioral Therapy", basic: false, standard: false, premium: false, comprehensive: true },
  ];

  useCopilotReadable({
    description: "Feature comparison across insurance plans",
    value: JSON.stringify(features),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-x-auto my-8"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-stone-900 border border-stone-700 px-4 py-4 text-left text-white font-semibold">
              Feature
            </th>
            <th className="bg-stone-900 border border-stone-700 px-4 py-4 text-center text-amber-400 font-semibold">
              Basic<br/><span className="text-white/50 text-xs">£15/mo</span>
            </th>
            <th className="bg-stone-900 border border-stone-700 px-4 py-4 text-center text-amber-400 font-semibold">
              Standard<br/><span className="text-white/50 text-xs">£35/mo</span>
            </th>
            <th className="bg-amber-900/30 border border-amber-500/30 px-4 py-4 text-center text-amber-400 font-semibold">
              Premium<br/><span className="text-amber-300 text-xs">£55/mo</span>
            </th>
            <th className="bg-stone-900 border border-stone-700 px-4 py-4 text-center text-amber-400 font-semibold">
              Comprehensive<br/><span className="text-white/50 text-xs">£85/mo</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature.name} className={index % 2 === 0 ? "bg-stone-900/50" : ""}>
              <td className="border border-stone-700 px-4 py-3 text-white/80">
                {feature.name}
              </td>
              <td className="border border-stone-700 px-4 py-3 text-center">
                {feature.basic ? "✓" : "—"}
              </td>
              <td className="border border-stone-700 px-4 py-3 text-center">
                {feature.standard ? "✓" : "—"}
              </td>
              <td className="border border-amber-500/30 bg-amber-900/10 px-4 py-3 text-center">
                {feature.premium ? "✓" : "—"}
              </td>
              <td className="border border-stone-700 px-4 py-3 text-center">
                {feature.comprehensive ? "✓" : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
