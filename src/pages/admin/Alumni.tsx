import React from 'react';
import AdminLayout from '@/components/eyeq/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Building2, MessageCircle } from 'lucide-react';

const Alumni: React.FC = () => {
  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h3 className='text-3xl font-bold tracking-tight'>Alumni Network</h3>
          <p className='text-muted-foreground mt-1'>Connect with alumni, view companies, and manage opportunities.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className="border-border bg-card hover:border-amber-500/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <CardTitle>Alumni Profiles</CardTitle>
              </div>
              <CardDescription>Showcase alumni and connect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse the directory of past members and their achievements.
              </p>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">Explore Directory</Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:border-amber-500/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle>Companies & Openings</CardTitle>
              </div>
              <CardDescription>View alumni companies and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Discover where alumni are working and find job openings.
              </p>
              <Button variant="outline" className="w-full">See Jobs</Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:border-amber-500/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-md bg-green-500/10 text-green-500">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <CardTitle>Connect</CardTitle>
              </div>
              <CardDescription>Messaging & mentorship requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Reach out to alumni for mentorship or advice.
              </p>
              <Button variant="outline" className="w-full">Message Alumni</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Alumni;
