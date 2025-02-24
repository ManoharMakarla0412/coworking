'use client';

import { useEffect, useState } from 'react';
import { Input } from "../../../components/ui/input";
import { KeyRound } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../components/ui/table";
import { APILog, APIResponse } from '../../@types/api';
import { Button } from '../../../components/ui/button';
import { BASE_URL } from '../../utils/constants';

export default function APILogs() {
  const [logs, setLogs] = useState<APILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const logsPerPage = 10; // Number of logs per page

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/logs`);
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data: APIResponse = await response.json();
        setLogs(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const searchLower = searchQuery.toLowerCase();
    return (
      log.time.toLowerCase().includes(searchLower) ||
      log.resource?.toLowerCase().includes(searchLower) ||
      log.requestHttpMethod.toLowerCase().includes(searchLower) ||
      log.responseHttpCode.toString().includes(searchLower) ||
      log.requestDurationSeconds.toString().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-md text-gray-200 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <KeyRound className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">API Logs</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search all columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1a1a1a] border-[#333] text-gray-300 placeholder:text-gray-500 w-[300px]"
          />
        </div>

        {/* Table */}
        <div className="border border-[#333] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#333] hover:bg-[#1a1a1a]">
                <TableHead className="text-gray-400 font-medium">Time</TableHead>
                <TableHead className="text-gray-400 font-medium">Resource</TableHead>
                <TableHead className="text-gray-400 font-medium">Request Duration (Seconds)</TableHead>
                <TableHead className="text-gray-400 font-medium">Request HTTP Method</TableHead>
                <TableHead className="text-gray-400 font-medium">Response HTTP Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-400">
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <TableRow 
                    key={log.id}
                    className="border-b border-[#333] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <TableCell className="font-mono">{formatDate(log.time)}</TableCell>
                    <TableCell className="capitalize">{log.resource || 'N/A'}</TableCell>
                    <TableCell>{log.requestDurationSeconds.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="bg-[#0066cc] text-white px-3 py-1 rounded-md text-sm font-medium">
                        {log.requestHttpMethod}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`${
                        log.responseHttpCode >= 200 && log.responseHttpCode < 300 
                          ? 'bg-[#2d8a49]' 
                          : 'bg-red-500'
                        } text-white px-3 py-1 rounded-md text-sm font-medium`}
                      >
                        {log.responseHttpCode}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </Button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
