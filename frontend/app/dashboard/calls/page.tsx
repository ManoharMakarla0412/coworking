"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { BASE_URL } from "../../utils/constants";

// Define the interface for call logs
interface CallLog {
  id: string;
  assistantId: string | null;
  type: string;
  startedAt: string;
  endedAt: string;
  cost: number;
  endedReason: string;
  // Add additional fields as needed
}

const CallLogs = () => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch call logs from the backend API
    const fetchCallLogs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/calls/logs`);
        if (!response.ok) {
          throw new Error("Failed to fetch call logs");
        }
        const data = await response.json();
        setCallLogs(data.callLogs);
      } catch (error) {
        console.error("Error fetching call logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="bg-[#1C1C1C] rounded-md text-white p-4 shadow-md">
      <h1 className="text-lg font-bold border-b border-gray-700 pb-2 mb-4">
        Call Logs
      </h1>
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Type</TableHead>
            <TableHead className="text-gray-400">Call ID</TableHead>
            <TableHead className="text-gray-400">Call Cost</TableHead>
            <TableHead className="text-gray-400">Ended Reason</TableHead>
            <TableHead className="text-gray-400">Assistant</TableHead>
            <TableHead className="text-gray-400">Phone Number</TableHead>
            <TableHead className="text-gray-400">Customer</TableHead>
            <TableHead className="text-gray-400">Start Time</TableHead>
            <TableHead className="text-gray-400">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {callLogs.map((log) => (
            <TableRow
              key={log.id}
              className="bg-gray-800 hover:bg-gray-700 transition-all"
            >
              <TableCell className="px-4 py-2 capitalize">
                {log.type === "webCall" ? "Web" : log.type}
              </TableCell>
              <TableCell className="px-4 py-2 flex items-center gap-2">
                <span>{log.id}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(log.id)}
                  className="text-teal-400 hover:text-teal-300 transition"
                >
                  Copy
                </button>
              </TableCell>
              <TableCell className="px-4 py-2">
                ${log.cost.toFixed(2)}
              </TableCell>
              <TableCell className="px-4 py-2 capitalize">
                {log.endedReason.replace(/-/g, " ")}
              </TableCell>
              <TableCell className="px-4 py-2">
                {log.assistantId || "N/A"}
              </TableCell>
              <TableCell className="px-4 py-2">N/A</TableCell>
              <TableCell className="px-4 py-2">N/A</TableCell>
              <TableCell className="px-4 py-2">
                {new Date(log.startedAt).toLocaleString("en-US", {
                  timeZone: "Asia/Kolkata",
                  hour12: true,
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell className="px-4 py-2">
                {Math.round(
                  (new Date(log.endedAt).getTime() -
                    new Date(log.startedAt).getTime()) /
                    1000
                )}{" "}
                s
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CallLogs;
