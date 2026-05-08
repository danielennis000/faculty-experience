import { ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { courses } from '../data/mockData';

export default function CourseSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b-4 border-gold bg-primary px-6 py-4 text-primary-foreground">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </div>
          <span className="text-lg font-bold tracking-tight">Faculty Insight Assistant</span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6">
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Select a demo course
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Choose a Canvas-like course to open the simulated faculty workspace and agentic flows.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((course) => (
            <Card
              key={course.courseId}
              className="flex flex-col transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-xl leading-snug">{course.courseName}</CardTitle>
                <CardDescription>{course.term}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{course.instructorName}</p>
              </CardContent>
              <CardFooter className="border-t border-border/60 pt-6">
                <Button asChild className="w-full sm:w-auto">
                  <Link to={`/dashboard/${course.courseId}`}>
                    Enter workspace
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
