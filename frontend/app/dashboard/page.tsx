"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Loader2 } from 'lucide-react'
import { ChartContainer } from "../../components/ui/chart"
import { BASE_URL } from "../utils/constants"

interface Assistant {
  id: string;
  name: string;
  description?: string;
}

const metrics = [
  { title: "Total Call Minutes", value: "38", change: "+131.80%", isPositive: true },
  { title: "Number of Calls", value: "66", change: "+83.33%", isPositive: true },
  { title: "Total Spent", value: "$7.15", change: "+79.42%", isPositive: true },
  { title: "Average Cost per Call", value: "$0.18", change: "-2.14%", isPositive: false },
]

const reasonCallEndedData = [
  { name: "Call Ended Normally", value: 27 },
  { name: "Network Issue", value: 7 },
  { name: "Missed Call", value: 8 },
  { name: "Busy Line", value: 1 },
]

const callDurationData = [
  { name: "Unknown Assistant", value: 24 },
  { name: "Mary", value: 23 },
]

const COLORS = ["#4ade80", "#818cf8", "#fb923c", "#f87171"]
const DURATION_COLORS = ["#818cf8", "#4ade80"]

export default function Dashboard() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch(`${BASE_URL}/assistant/get`);
        if (!response.ok) throw new Error('Failed to fetch assistants');
        const data = await response.json();
        setAssistants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch assistants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-md text-white p-6">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Overview</h1>
        
        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics?.map((metric, index) => (
            <Card key={index} className="bg-[#2a2a2a] border-0">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{metric.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className={`text-sm flex items-center ${
                      metric.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.isPositive ? (
                        <ArrowUpIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 mr-1" />
                      )}
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-[#2a2a2a] border-0">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Reason Call Ended</CardTitle>
              <p className="text-sm text-gray-400">Calls aggregated by reason of why the call ended or completed.</p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                data={reasonCallEndedData}
                colors={COLORS}
                className="h-[300px]"
              />
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-0">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Average Call Duration by Assistant</CardTitle>
              <p className="text-sm text-gray-400">Average call duration by assistant in minutes.</p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                data={callDurationData}
                colors={DURATION_COLORS}
                className="h-[300px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Assistants Table */}
        <Card className="bg-[#2a2a2a] border-0">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Assistants Table</CardTitle>
            <p className="text-sm text-gray-400">Total calls and average call duration aggregated by assistant.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-400">{error}</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Assistant Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Call Count</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Avg Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assistants.map((assistant) => (
                      <tr key={assistant.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-4">{assistant.name}</td>
                        <td className="py-3 px-4 text-gray-400">{assistant.description || 'No description'}</td>
                        <td className="py-3 px-4">24</td>
                        <td className="py-3 px-4">3.65 min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

