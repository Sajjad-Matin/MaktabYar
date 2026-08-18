'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Eye, GitCompare } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface TimetableHistory {
  id: string;
  version: number;
  generatedAt: string;
  class: {
    id: string;
    name: string;
  };
}

interface TimetableHistoryProps {
  classId: string;
  className: string;
  onBack: () => void;
  onViewHistory: (historyId: string) => void;
  onCompare: (historyId1: string, historyId2: string) => void;
}

export default function TimetableHistory({
  classId,
  className,
  onBack,
  onViewHistory,
  onCompare,
}: TimetableHistoryProps) {
  const [history, setHistory] = useState<TimetableHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [classId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<TimetableHistory[]>(
        `/timetable-history/classes/${classId}/history`,
      );
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForCompare = (historyId: string) => {
    if (selectedForCompare === historyId) {
      setSelectedForCompare(null);
    } else if (selectedForCompare) {
      onCompare(selectedForCompare, historyId);
      setSelectedForCompare(null);
    } else {
      setSelectedForCompare(historyId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-destructive">{error}</div>
        <Button onClick={fetchHistory} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Calendar className="w-12 h-12 text-muted-foreground" />
        <div className="text-muted-foreground">No history available for this class</div>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Timetable
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Timetable History</h2>
            <p className="text-muted-foreground">{className}</p>
          </div>
        </div>
        {selectedForCompare && (
          <div className="text-sm text-muted-foreground">
            Select another version to compare
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <Card
            key={item.id}
            className={`transition-all hover:shadow-md ${
              selectedForCompare === item.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Version {item.version}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.generatedAt)}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={item.version === history[0].version ? 'default' : 'secondary'}>
                  {item.version === history[0].version ? 'Latest' : 'Historical'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onViewHistory(item.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  onClick={() => handleSelectForCompare(item.id)}
                  variant={selectedForCompare === item.id ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  {selectedForCompare === item.id ? 'Cancel' : 'Compare'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
