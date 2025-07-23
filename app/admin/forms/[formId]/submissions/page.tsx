'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define the types for our data
type Submission = Record<string, any>;
type SubmissionsData = {
  name: string;
  submissions: Submission[];
};

export default function SubmissionsPage({ params }: { params: { formId: string } }) {
  const [data, setData] = useState<SubmissionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`/api/forms/${params.formId}/submissions`);
        if (!res.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const responseData = await res.json();
        setData(responseData);
      } catch (err) {
        setError('Could not load submissions. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [params.formId]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading submissions...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }
  
  const headers = data && data.submissions.length > 0 ? Object.keys(data.submissions[0]) : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Submissions for: {data?.name}</h1>
      <Card>
        <CardContent className="p-0">
          {data && data.submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.submissions.map((submission, index) => (
                  <TableRow key={index}>
                    {headers.map(header => (
                      <TableCell key={header}>
                        {typeof submission[header] === 'boolean' ? String(submission[header]) : submission[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-6 text-center">No submissions have been recorded for this form yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 