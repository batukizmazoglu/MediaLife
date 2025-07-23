'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Form objesi için tip tanımı
 type Form = {
  id: string;
  name: string;
  published: boolean;
  createdAt: string;
};

export default function AdminDashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const handlePublishToggle = async (form: Form) => {
    const newStatus = !form.published;
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update the state locally to reflect the change instantly
      setForms(forms.map(f => f.id === form.id ? { ...f, published: newStatus } : f));
      toast.success(`Form ${newStatus ? 'published' : 'unpublished'}.`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update form status.');
    }
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch('/api/forms');
        if (!res.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await res.json();
        setForms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Forms</h1>
        <Button asChild>
          <Link href="/playground">Create New Form</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.length > 0 ? (
          forms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <CardTitle>{form.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {form.published ? 'Published' : 'Draft'}</p>
                <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href={`/admin/forms/${form.id}/submissions`}>View Submissions</Link>
                </Button>
                {form.published && (
                  <Button asChild variant="outline" className="mt-2 w-full">
                    <Link href={`/forms/${form.id}`} target="_blank">View Live Form</Link>
                  </Button>
                )}
                <Button onClick={() => handlePublishToggle(form)} variant="secondary" className="mt-2 w-full">
                  {form.published ? 'Unpublish' : 'Publish'}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>You have not created any forms yet.</p>
        )}
      </div>
    </div>
  );
} 