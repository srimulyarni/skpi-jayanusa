import { CheckCircle, FileText, Lock, PenLine, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepStatus = 'done' | 'current' | 'locked';

type Step = {
    label: string;
    description: string;
    status: StepStatus;
    count: number;
    countLabel: string;
};

const STEP_ICONS = [PenLine, CheckCircle, Send, FileText];

const stepStyles: Record<StepStatus, { node: string; ring: string; icon: string; line: string }> = {
    done: {
        node: 'bg-green-600 border-green-600',
        ring: '',
        icon: 'text-white',
        line: 'bg-green-500',
    },
    current: {
        node: 'bg-blue-600 border-blue-600',
        ring: 'ring-4 ring-blue-200 animate-pulse-ring',
        icon: 'text-white',
        line: 'bg-gray-200',
    },
    locked: {
        node: 'bg-gray-200 border-gray-200',
        ring: '',
        icon: 'text-gray-400',
        line: 'bg-gray-200',
    },
};

export function SkpiJourneyMap({ steps }: { steps: Step[] }) {
    return (
        <div className="space-y-6">
            <div className="hidden sm:flex items-start justify-between">
                {steps.map((step, i) => {
                    const style = stepStyles[step.status];
                    const Icon = step.status === 'done' ? CheckCircle : step.status === 'locked' ? Lock : STEP_ICONS[i];

                    return (
                        <div key={i} className="flex flex-1 items-start">
                            <div className="flex flex-col items-center">
                                <div className={cn('flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all', style.node, style.ring)}>
                                    <Icon className={cn('h-5 w-5', style.icon)} />
                                </div>
                                <div className="mt-2 text-center">
                                    <p className={cn('text-sm font-medium', step.status === 'locked' ? 'text-gray-400' : 'text-foreground')}>{step.label}</p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                    {step.countLabel && (
                                        <p className={cn('mt-1 text-xs font-medium', step.status === 'done' ? 'text-green-600' : step.status === 'current' ? 'text-blue-600' : 'text-gray-400')}>
                                            {step.count} {step.countLabel}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {i < steps.length - 1 && (
                                <div className="mt-6 flex-1 px-2">
                                    <div className={cn('h-1 w-full rounded-full transition-all', step.status === 'done' ? 'bg-green-500' : 'bg-gray-200')} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="sm:hidden space-y-3">
                {steps.map((step, i) => {
                    const style = stepStyles[step.status];
                    const Icon = step.status === 'done' ? CheckCircle : step.status === 'locked' ? Lock : STEP_ICONS[i];

                    return (
                        <div key={i} className="flex items-center gap-3">
                            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2', style.node, style.ring)}>
                                <Icon className={cn('h-4 w-4', style.icon)} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={cn('text-sm font-medium', step.status === 'locked' ? 'text-gray-400' : 'text-foreground')}>{step.label}</p>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                            </div>
                            {step.countLabel && (
                                <span className={cn('shrink-0 text-xs font-medium', step.status === 'done' ? 'text-green-600' : step.status === 'current' ? 'text-blue-600' : 'text-gray-400')}>
                                    {step.count} {step.countLabel}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
