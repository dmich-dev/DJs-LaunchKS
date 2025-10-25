import { ExternalLink, DollarSign, Clock, MapPin, Award } from 'lucide-react';
import { type Resource } from '@/types/db';

interface ResourceListProps {
  resources: Resource[];
}

const resourceTypeLabels: Record<string, string> = {
  course: 'Course',
  certification: 'Certification',
  program: 'Program',
  job_listing: 'Job Listing',
  article: 'Article',
  video: 'Video',
  other: 'Resource',
};

const resourceTypeColors: Record<string, string> = {
  course: 'bg-blue-100 text-blue-800 border-blue-200',
  certification: 'bg-purple-100 text-purple-800 border-purple-200',
  program: 'bg-green-100 text-green-800 border-green-200',
  job_listing: 'bg-orange-100 text-orange-800 border-orange-200',
  article: 'bg-gray-100 text-gray-800 border-gray-200',
  video: 'bg-red-100 text-red-800 border-red-200',
  other: 'bg-slate-100 text-slate-800 border-slate-200',
};

export function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No resources available for this milestone
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full border ${
                    resourceTypeColors[resource.type] ||
                    resourceTypeColors.other
                  }`}
                >
                  {resourceTypeLabels[resource.type] || 'Resource'}
                </span>
                {resource.isAccredited && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success border border-success/20">
                    <Award className="w-3 h-3" />
                    Accredited
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-lg text-primary">
                {resource.title}
              </h4>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              View
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {resource.description && (
            <p className="text-sm text-muted-foreground mb-3">
              {resource.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">{resource.cost}</span>
            </div>

            {resource.duration && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{resource.duration}</span>
              </div>
            )}

            {resource.location && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="capitalize">{resource.location}</span>
              </div>
            )}

            {resource.provider && (
              <div className="text-muted-foreground">
                <span className="font-medium">Provider:</span> {resource.provider}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
