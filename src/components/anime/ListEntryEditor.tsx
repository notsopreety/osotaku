import { useState, useEffect } from 'react';
import { Minus, Plus, Calendar as CalendarIcon, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Media, MediaList, MediaListStatus, FuzzyDate } from '@/types/anime';

interface ListEntryEditorProps {
  anime: Media;
  entry?: MediaList | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ListEntryData) => void;
  onDelete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export interface ListEntryData {
  mediaId: number;
  status: MediaListStatus;
  score: number;
  progress: number;
  repeat: number;
  notes: string;
  startedAt?: { year?: number; month?: number; day?: number };
  completedAt?: { year?: number; month?: number; day?: number };
}

const STATUS_OPTIONS: { value: MediaListStatus; label: string }[] = [
  { value: 'CURRENT', label: 'Watching' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PLANNING', label: 'Planning' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'DROPPED', label: 'Dropped' },
  { value: 'REPEATING', label: 'Rewatching' },
];

function fuzzyDateToDate(fuzzy?: FuzzyDate): Date | undefined {
  if (!fuzzy?.year) return undefined;
  return new Date(fuzzy.year, (fuzzy.month || 1) - 1, fuzzy.day || 1);
}

function dateToFuzzyDate(date?: Date): { year?: number; month?: number; day?: number } | undefined {
  if (!date) return undefined;
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function ListEntryEditor({
  anime,
  entry,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: ListEntryEditorProps) {
  const [status, setStatus] = useState<MediaListStatus>('PLANNING');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(0);
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [finishDate, setFinishDate] = useState<Date | undefined>();

  const maxEpisodes = anime.episodes || 0;
  const title = anime.title?.english || anime.title?.romaji || 'Unknown';

  useEffect(() => {
    if (entry) {
      setStatus(entry.status || 'PLANNING');
      setScore(entry.score || 0);
      setProgress(entry.progress || 0);
      setRepeat(entry.repeat || 0);
      setNotes(entry.notes || '');
      setStartDate(fuzzyDateToDate(entry.startedAt));
      setFinishDate(fuzzyDateToDate(entry.completedAt));
    } else {
      setStatus('PLANNING');
      setScore(0);
      setProgress(0);
      setRepeat(0);
      setNotes('');
      setStartDate(undefined);
      setFinishDate(undefined);
    }
  }, [entry, isOpen]);

  const handleSave = () => {
    onSave({
      mediaId: anime.id,
      status,
      score,
      progress,
      repeat,
      notes,
      startedAt: dateToFuzzyDate(startDate),
      completedAt: dateToFuzzyDate(finishDate),
    });
  };

  const handleProgressChange = (delta: number) => {
    const newProgress = Math.max(0, Math.min(maxEpisodes || 9999, progress + delta));
    setProgress(newProgress);
    
    // Auto-set status based on progress
    if (newProgress > 0 && status === 'PLANNING') {
      setStatus('CURRENT');
      if (!startDate) setStartDate(new Date());
    }
    if (maxEpisodes && newProgress >= maxEpisodes && status !== 'COMPLETED') {
      setStatus('COMPLETED');
      if (!finishDate) setFinishDate(new Date());
    }
  };

  const handleStatusChange = (newStatus: MediaListStatus) => {
    setStatus(newStatus);
    
    // Auto-set dates
    if (newStatus === 'CURRENT' && !startDate) {
      setStartDate(new Date());
    }
    if (newStatus === 'COMPLETED') {
      if (!startDate) setStartDate(new Date());
      if (!finishDate) setFinishDate(new Date());
      if (maxEpisodes && progress < maxEpisodes) {
        setProgress(maxEpisodes);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {anime.coverImage?.medium && (
              <img
                src={anime.coverImage.medium}
                alt={title}
                className="w-12 h-16 object-cover rounded"
              />
            )}
            <span className="line-clamp-2">{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => handleStatusChange(v as MediaListStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Score */}
          <div className="space-y-2">
            <Label>Score</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={score}
                onChange={(e) => setScore(Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label>Episode Progress</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleProgressChange(-1)}
                disabled={progress <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                min={0}
                max={maxEpisodes || 9999}
                value={progress}
                onChange={(e) => setProgress(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleProgressChange(1)}
                disabled={maxEpisodes ? progress >= maxEpisodes : false}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                / {maxEpisodes || '?'}
              </span>
            </div>
          </div>

          {/* Rewatches */}
          <div className="space-y-2">
            <Label>Rewatches</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRepeat(Math.max(0, repeat - 1))}
                disabled={repeat <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                min={0}
                value={repeat}
                onChange={(e) => setRepeat(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRepeat(repeat + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Finish Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !finishDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {finishDate ? format(finishDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={finishDate}
                    onSelect={setFinishDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this anime..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {entry && onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Remove
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} disabled={isSaving || isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isDeleting}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
