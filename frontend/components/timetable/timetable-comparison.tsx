'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, GitCompare, Plus, Minus, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface TeacherSubject {
  teacher: {
    name: string;
  };
  subject: {
    name: string;
  };
}

interface TimetableEntry {
  dayId: string;
  periodId: number;
  teacherSubject?: TeacherSubject;
}

interface ComparisonData {
  history1: {
    id: string;
    version: number;
    generatedAt: string;
  };
  history2: {
    id: string;
    version: number;
    generatedAt: string;
  };
  changes: {
    added: TimetableEntry[];
    removed: TimetableEntry[];
    modified: Array<{
      dayId: string;
      periodId: number;
      from: TeacherSubject;
      to: TeacherSubject;
    }>;
  };
}

interface TimetableComparisonProps {
  historyId1: string;
  historyId2: string;
  onBack: () => void;
}

export default function TimetableComparison({
  historyId1,
  historyId2,
  onBack,
}: TimetableComparisonProps) {
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComparison();
  }, [historyId1, historyId2]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<ComparisonData>(
        `/timetable-history/history/compare/${historyId1}/${historyId2}`,
      );
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison');
    } finally {
      setLoading(false);
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
        <div className="text-muted-foreground">Loading comparison...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-destructive">{error}</div>
        <Button onClick={fetchComparison} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!comparison) {
    return null;
  }

  const totalChanges =
    comparison.changes.added.length +
    comparison.changes.removed.length +
    comparison.changes.modified.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Timetable Comparison</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <GitCompare className="w-4 h-4" />
              Version {comparison.history1.version} → Version {comparison.history2.version}
            </div>
          </div>
        </div>
        <Badge variant={totalChanges === 0 ? 'secondary' : 'default'}>
          {totalChanges === 0 ? 'No Changes' : `${totalChanges} Change${totalChanges !== 1 ? 's' : ''}`}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Version {comparison.history1.version}</CardTitle>
            <CardDescription>{formatDate(comparison.history1.generatedAt)}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Version {comparison.history2.version}</CardTitle>
            <CardDescription>{formatDate(comparison.history2.generatedAt)}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {totalChanges === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No changes detected between these versions</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comparison.changes.added.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-500" />
                  Added ({comparison.changes.added.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comparison.changes.added.map((entry, index) => (
                    <div
                      key={`added-${index}`}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <div className="font-medium">
                          {entry.teacherSubject?.subject.name || 'Unknown Subject'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.teacherSubject?.teacher.name || 'Unknown Teacher'}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Day {entry.dayId} • Period {entry.periodId}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {comparison.changes.removed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Minus className="w-5 h-5 text-red-500" />
                  Removed ({comparison.changes.removed.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comparison.changes.removed.map((entry, index) => (
                    <div
                      key={`removed-${index}`}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div>
                        <div className="font-medium">
                          {entry.teacherSubject?.subject.name || 'Unknown Subject'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.teacherSubject?.teacher.name || 'Unknown Teacher'}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                        Day {entry.dayId} • Period {entry.periodId}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {comparison.changes.modified.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
                  Modified ({comparison.changes.modified.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comparison.changes.modified.map((entry, index) => (
                    <div
                      key={`modified-${index}`}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          Day {entry.dayId} • Period {entry.periodId}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">From</div>
                          <div className="font-medium text-red-600">
                            {entry.from.subject.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.from.teacher.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">To</div>
                          <div className="font-medium text-green-600">
                            {entry.to.subject.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.to.teacher.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
