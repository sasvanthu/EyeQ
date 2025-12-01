import React from 'react';
import AdminLayout from '@/components/eyeq/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Upload, Briefcase } from 'lucide-react';

const Portfolio: React.FC = () => {
  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h3 className='text-3xl font-bold tracking-tight'>Portfolio & Projects</h3>
          <p className='text-muted-foreground mt-1'>Portfolio generator and project showcase management.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className="border-border bg-card hover:border-amber-500/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                  <Wand2 className="h-6 w-6" />
                </div>
                <CardTitle>Portfolio Generator</CardTitle>
              </div>
              <CardDescription>One-click portfolio creation with AI bio and skills</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Automatically generate professional portfolios for members based on their profile data and activity.
              </p>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                Generate Portfolio
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:border-amber-500/30 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                  <Upload className="h-6 w-6" />
                </div>
                <CardTitle>Project Listing</CardTitle>
              </div>
              <CardDescription>Upload projects and add GitHub links</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage and showcase member projects. Add new projects manually or import from repositories.
              </p>
              <Button variant="outline" className="w-full">
                Upload Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Portfolio;
