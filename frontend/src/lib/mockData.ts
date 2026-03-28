export type CognitiveState = 'focus' | 'distracted' | 'confused' | 'fatigued' | 'idle';

export const cognitiveStateConfig: Record<CognitiveState, { label: string; color: string; icon: string; description: string }> = {
  focus: { label: 'Focus', color: 'cognitive-focus', icon: '🎯', description: 'Deep work mode — consistent typing, minimal distractions' },
  distracted: { label: 'Distracted', color: 'cognitive-distracted', icon: '🔀', description: 'High tab switching and erratic mouse movement detected' },
  confused: { label: 'Confused', color: 'cognitive-confused', icon: '❓', description: 'Elevated backspace rate and repeated error patterns' },
  fatigued: { label: 'Fatigued', color: 'cognitive-fatigued', icon: '😴', description: 'Declining typing speed and increasing idle periods' },
  idle: { label: 'Idle', color: 'cognitive-idle', icon: '⏸️', description: 'No significant activity detected' },
};

export const currentState: { state: CognitiveState; confidence: number; explanation: string } = {
  state: 'focus',
  confidence: 87,
  explanation: 'Consistent typing speed with minimal tab switching and steady mouse movement patterns.',
};

export const metrics = [
  { id: 'typing', label: 'Typing Speed', value: 6.2, unit: 'keys/sec', status: 'good' as const, trend: [5.1, 5.8, 6.0, 5.9, 6.2, 6.1, 6.3, 6.2, 6.0, 6.2] },
  { id: 'backspace', label: 'Backspace Rate', value: 4.1, unit: '%', status: 'good' as const, trend: [5.2, 4.8, 4.5, 4.3, 4.1, 4.2, 4.0, 4.1, 4.3, 4.1] },
  { id: 'mouse', label: 'Mouse Variance', value: 142, unit: 'px/s', status: 'warning' as const, trend: [90, 105, 120, 135, 142, 138, 145, 150, 142, 142] },
  { id: 'tabs', label: 'Tab Switching', value: 2.3, unit: '/min', status: 'good' as const, trend: [1.5, 1.8, 2.0, 2.1, 2.3, 2.2, 2.4, 2.3, 2.1, 2.3] },
  { id: 'idle', label: 'Idle Time', value: 8, unit: '%', status: 'good' as const, trend: [12, 10, 9, 8, 8, 9, 7, 8, 8, 8] },
  { id: 'errors', label: 'Error Rate', value: 1.8, unit: '%', status: 'good' as const, trend: [3.2, 2.8, 2.4, 2.1, 1.8, 1.9, 1.7, 1.8, 2.0, 1.8] },
];

export const contributions = [
  { name: 'Typing Consistency', value: 35, color: 'hsl(199, 89%, 48%)' },
  { name: 'Tab Switching', value: 25, color: 'hsl(172, 66%, 50%)' },
  { name: 'Backspace Rate', value: 20, color: 'hsl(280, 67%, 55%)' },
  { name: 'Idle Time', value: 10, color: 'hsl(38, 92%, 50%)' },
  { name: 'Mouse Movement', value: 10, color: 'hsl(220, 10%, 55%)' },
];

export const timelineData = [
  { time: '9:00', state: 'idle', label: 'Idle' },
  { time: '9:15', state: 'focus', label: 'Focus' },
  { time: '10:00', state: 'focus', label: 'Focus' },
  { time: '10:30', state: 'distracted', label: 'Distracted' },
  { time: '10:45', state: 'focus', label: 'Focus' },
  { time: '11:30', state: 'confused', label: 'Confused' },
  { time: '11:45', state: 'focus', label: 'Focus' },
  { time: '12:00', state: 'fatigued', label: 'Fatigued' },
  { time: '12:30', state: 'idle', label: 'Idle' },
  { time: '13:00', state: 'focus', label: 'Focus' },
  { time: '13:45', state: 'focus', label: 'Focus' },
  { time: '14:00', state: 'distracted', label: 'Distracted' },
  { time: '14:15', state: 'focus', label: 'Focus' },
  { time: '14:45', state: 'focus', label: 'Focus' },
];

export const systemActions = [
  { action: 'Focus Mode Enabled', time: '10:32 AM', state: 'distracted' as CognitiveState, icon: '🎯' },
  { action: 'Notifications Blocked', time: '10:32 AM', state: 'distracted' as CognitiveState, icon: '🔕' },
  { action: 'Break Suggested', time: '12:01 PM', state: 'fatigued' as CognitiveState, icon: '☕' },
  { action: 'Ambient Sound Activated', time: '1:02 PM', state: 'focus' as CognitiveState, icon: '🎵' },
  { action: 'Screen Dimming Applied', time: '12:05 PM', state: 'fatigued' as CognitiveState, icon: '🌙' },
];

export const queuedNotifications = [
  { app: 'Slack', title: 'New message from Sarah', preview: 'Hey, can you review the PR...', time: '10:33 AM' },
  { app: 'Email', title: 'Meeting reminder', preview: 'Standup in 15 minutes', time: '10:40 AM' },
  { app: 'GitHub', title: 'PR #142 approved', preview: 'Your pull request has been...', time: '10:45 AM' },
  { app: 'Slack', title: 'Channel: #engineering', preview: 'Deployment complete for v2.1...', time: '11:02 AM' },
];

export const automationLogs = [
  { id: 1, timestamp: '2024-01-15 10:32:14', state: 'distracted' as CognitiveState, action: 'Enabled Focus Mode', trigger: 'Tab switching > 5/min for 2min', result: 'Success' },
  { id: 2, timestamp: '2024-01-15 10:32:14', state: 'distracted' as CognitiveState, action: 'Blocked Notifications', trigger: 'Focus Mode activation', result: 'Success' },
  { id: 3, timestamp: '2024-01-15 12:01:30', state: 'fatigued' as CognitiveState, action: 'Suggested Break', trigger: 'Typing speed < 3 keys/sec for 5min', result: 'Acknowledged' },
  { id: 4, timestamp: '2024-01-15 12:05:00', state: 'fatigued' as CognitiveState, action: 'Applied Screen Dimming', trigger: 'Fatigue state > 3min', result: 'Success' },
  { id: 5, timestamp: '2024-01-15 13:02:10', state: 'focus' as CognitiveState, action: 'Activated Ambient Sound', trigger: 'Focus state sustained > 5min', result: 'Success' },
  { id: 6, timestamp: '2024-01-15 14:00:45', state: 'distracted' as CognitiveState, action: 'Sent Gentle Alert', trigger: 'Mouse variance spike detected', result: 'Dismissed' },
  { id: 7, timestamp: '2024-01-15 11:30:22', state: 'confused' as CognitiveState, action: 'Opened Help Overlay', trigger: 'Error rate > 5% for 3min', result: 'Success' },
  { id: 8, timestamp: '2024-01-15 09:15:00', state: 'idle' as CognitiveState, action: 'Sent Wake-Up Prompt', trigger: 'No activity for 10min', result: 'Acknowledged' },
];

export const behaviorData = {
  typingPattern: Array.from({ length: 30 }, (_, i) => ({
    time: `${Math.floor(i / 2 + 9)}:${i % 2 === 0 ? '00' : '30'}`,
    speed: 4 + Math.random() * 4,
    errors: Math.random() * 5,
  })),
  mouseHeatmap: Array.from({ length: 20 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    intensity: Math.random(),
  })),
  tabSwitching: Array.from({ length: 12 }, (_, i) => ({
    hour: `${i + 9}:00`,
    count: Math.floor(Math.random() * 15 + 2),
  })),
  idleDistribution: [
    { range: '0-1 min', count: 45 },
    { range: '1-3 min', count: 28 },
    { range: '3-5 min', count: 12 },
    { range: '5-10 min', count: 6 },
    { range: '10+ min', count: 3 },
  ],
};

export const detectionStates = [
  {
    state: 'Focus' as const,
    color: 'cognitive-focus',
    definition: 'A state of sustained, productive engagement where the user demonstrates consistent behavioral patterns aligned with deep work.',
    signals: ['Typing speed > 5 keys/sec', 'Backspace rate < 5%', 'Tab switching < 3/min', 'Idle time < 10%', 'Mouse movement consistent'],
    thresholds: { confidence: '> 75%', duration: '> 2 min sustained', minSignals: '3 of 5 signals aligned' },
    scenario: 'Developer writing code for 20 minutes with minimal interruptions, consistent typing rhythm, and rare tab switches to check documentation.',
  },
  {
    state: 'Distracted' as const,
    color: 'cognitive-distracted',
    definition: 'A state characterized by frequent context switching and erratic behavior patterns suggesting loss of task focus.',
    signals: ['Tab switching > 5/min', 'Mouse movement erratic', 'Typing speed irregular', 'Frequent app switches', 'Short interaction bursts'],
    thresholds: { confidence: '> 70%', duration: '> 1 min sustained', minSignals: '2 of 5 signals aligned' },
    scenario: 'User switching between email, Slack, and social media every 15-30 seconds with quick scroll patterns and minimal typing.',
  },
  {
    state: 'Confused' as const,
    color: 'cognitive-confused',
    definition: 'A state where behavioral patterns suggest the user is struggling with comprehension or decision-making.',
    signals: ['Backspace rate > 15%', 'Error rate > 5%', 'Repeated navigation to same pages', 'Long pauses between actions', 'Typing-delete cycles'],
    thresholds: { confidence: '> 65%', duration: '> 1.5 min sustained', minSignals: '2 of 5 signals aligned' },
    scenario: 'User repeatedly typing and deleting code, revisiting documentation pages, and making frequent undo operations.',
  },
  {
    state: 'Fatigued' as const,
    color: 'cognitive-fatigued',
    definition: 'A state of declining cognitive performance typically occurring after extended work periods.',
    signals: ['Typing speed declining trend', 'Increasing idle gaps', 'Mouse movement slowing', 'Error rate increasing', 'Longer response times'],
    thresholds: { confidence: '> 70%', duration: '> 3 min sustained', minSignals: '3 of 5 signals aligned' },
    scenario: 'After 3 hours of focused work, user shows progressively slower typing, longer pauses, and increasing typo rates.',
  },
];
