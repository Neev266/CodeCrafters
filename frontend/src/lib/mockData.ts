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
  typingPatternLastWeek: Array.from({ length: 30 }, (_, i) => ({
    time: `${Math.floor(i / 2 + 9)}:${i % 2 === 0 ? '00' : '30'}`,
    speed: 3 + Math.random() * 3.5,
    errors: Math.random() * 7,
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
  peakFocusHours: [
    { hour: '10:00–11:00', score: 92, isPeak: true },
    { hour: '11:00–12:00', score: 88, isPeak: true },
    { hour: '9:00–10:00', score: 74, isPeak: false },
    { hour: '13:00–14:00', score: 71, isPeak: false },
    { hour: '14:00–15:00', score: 65, isPeak: false },
    { hour: '15:00–16:00', score: 58, isPeak: false },
  ],
  topDistractions: [
    { name: 'YouTube', value: 34, color: 'hsl(0, 72%, 51%)' },
    { name: 'WhatsApp', value: 28, color: 'hsl(10, 80%, 55%)' },
    { name: 'Instagram', value: 18, color: 'hsl(20, 75%, 55%)' },
    { name: 'Twitter/X', value: 12, color: 'hsl(0, 65%, 60%)' },
    { name: 'Reddit', value: 8, color: 'hsl(15, 70%, 52%)' },
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

// MOCK DATA — Live state explanation signals
export const liveStateSignals = {
  state: 'focus' as CognitiveState,
  signals: [
    { label: 'Typing consistency', firing: true },
    { label: 'Tab switching low', firing: true },
    { label: 'Backspace rate normal', firing: true },
    { label: 'Mouse variance stable', firing: false },
    { label: 'Idle time < 10%', firing: true },
  ],
};

// MOCK DATA — Dashboard widgets
export const focusStreak = {
  days: 7,
  bestStreak: 14,
};

export const todayFocusScore = {
  score: 78,
  delta: +12,
  yesterdayScore: 66,
};

export const topEmotion = {
  label: 'Calm',
  value: 85,
  color: 'hsl(142, 71%, 45%)',
  dotClass: 'bg-success',
};

export const stressActiveSince = 32; // minutes

// MOCK DATA — Emotion analysis
export const emotionTimelineBlocks = [
  { time: '9:00', emotion: 'calm', label: 'Calm', color: 'hsl(142, 71%, 45%)' },
  { time: '9:30', emotion: 'engaged', label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
  { time: '10:00', emotion: 'engaged', label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
  { time: '10:30', emotion: 'curious', label: 'Curious', color: 'hsl(172, 66%, 50%)' },
  { time: '11:00', emotion: 'stressed', label: 'Stressed', color: 'hsl(38, 92%, 50%)' },
  { time: '11:30', emotion: 'frustrated', label: 'Frustrated', color: 'hsl(0, 72%, 51%)' },
  { time: '12:00', emotion: 'calm', label: 'Calm', color: 'hsl(142, 71%, 45%)' },
  { time: '12:30', emotion: 'calm', label: 'Calm', color: 'hsl(142, 71%, 45%)' },
  { time: '13:00', emotion: 'engaged', label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
  { time: '13:30', emotion: 'curious', label: 'Curious', color: 'hsl(172, 66%, 50%)' },
  { time: '14:00', emotion: 'engaged', label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
  { time: '14:30', emotion: 'stressed', label: 'Stressed', color: 'hsl(38, 92%, 50%)' },
  { time: '15:00', emotion: 'calm', label: 'Calm', color: 'hsl(142, 71%, 45%)' },
  { time: '15:30', emotion: 'engaged', label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
];

export const emotionsInAction = [
  { emotion: 'Stressed', percent: 23, color: 'hsl(38, 92%, 50%)', actions: ['Focus Mode activated 2×', 'Game suggested 3×'] },
  { emotion: 'Curious', percent: 64, color: 'hsl(172, 66%, 50%)', actions: ['No action taken'] },
  { emotion: 'Frustrated', percent: 12, color: 'hsl(0, 72%, 51%)', actions: ['Help overlay triggered 1×', 'Break suggested 1×'] },
  { emotion: 'Engaged', percent: 72, color: 'hsl(199, 89%, 48%)', actions: ['Ambient sound activated 1×'] },
  { emotion: 'Calm', percent: 85, color: 'hsl(142, 71%, 45%)', actions: ['No action taken'] },
];

export const moodCalendar = Array.from({ length: 35 }, (_, i) => {
  const day = i + 1;
  if (day > 28) return { day: day - 28, hasData: false, emotion: null, color: null };
  const emotions = [
    { emotion: 'calm', color: 'hsl(142, 71%, 45%)' },
    { emotion: 'engaged', color: 'hsl(199, 89%, 48%)' },
    { emotion: 'stressed', color: 'hsl(38, 92%, 50%)' },
    { emotion: 'curious', color: 'hsl(172, 66%, 50%)' },
    { emotion: 'frustrated', color: 'hsl(0, 72%, 51%)' },
  ];
  const pick = emotions[Math.floor(Math.random() * emotions.length)];
  return { day, hasData: day <= 28, emotion: pick.emotion, color: pick.color };
});

export const recoveryGamesHistory = [
  { id: 1, datetime: '2024-01-15 10:45', game: 'Breathing Pacer', duration: '90s', stressBefore: 78, stressAfter: 52, outcome: 'Improved' as const },
  { id: 2, datetime: '2024-01-15 14:30', game: 'Memory Pattern', duration: '2m 10s', stressBefore: 65, stressAfter: 48, outcome: 'Improved' as const },
  { id: 3, datetime: '2024-01-14 11:20', game: 'Reaction Tap', duration: '1m 30s', stressBefore: 55, stressAfter: 58, outcome: 'No change' as const },
  { id: 4, datetime: '2024-01-14 16:00', game: 'Breathing Pacer', duration: '90s', stressBefore: 82, stressAfter: 60, outcome: 'Improved' as const },
  { id: 5, datetime: '2024-01-13 12:15', game: 'Memory Pattern', duration: '1m 55s', stressBefore: 70, stressAfter: 50, outcome: 'Improved' as const },
];

export const gamesThisWeek = {
  count: 5,
  avgStressReduction: 19,
};

export const weeklyReport = {
  userName: 'Alex',
  weekRange: 'Jan 8 – Jan 14, 2024',
  totalFocusHours: 28.5,
  streak: 7,
  dominantEmotion: { label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
  bestFocusWindow: '10am–12pm',
  productivityDelta: +14,
  gamesPlayed: 5,
  avgStressReduction: 19,
  weeklyBreakdown: [
    { day: 'Mon', focusScore: 72, state: 'focus', emotion: 'Engaged', automationNote: 'Focus Mode x2' },
    { day: 'Tue', focusScore: 68, state: 'distracted', emotion: 'Stressed', automationNote: 'Game suggested' },
    { day: 'Wed', focusScore: 85, state: 'focus', emotion: 'Calm', automationNote: 'Ambient sound' },
    { day: 'Thu', focusScore: 78, state: 'focus', emotion: 'Curious', automationNote: '—' },
    { day: 'Fri', focusScore: 65, state: 'fatigued', emotion: 'Frustrated', automationNote: 'Break x1' },
    { day: 'Sat', focusScore: 90, state: 'focus', emotion: 'Engaged', automationNote: 'Focus Mode x1' },
    { day: 'Sun', focusScore: 55, state: 'idle', emotion: 'Calm', automationNote: '—' },
  ],
};

export const screenTimeSummary = {
  total: '7h 42m',
  productive: 58,
  distraction: 24,
  idle: 18,
};

export const topAppsToday = [
  { name: 'VS Code', emoji: '💻', time: '3h 12m', percent: 42, type: 'productive' as const },
  { name: 'Chrome', emoji: '🌐', time: '1h 48m', percent: 23, type: 'productive' as const },
  { name: 'Terminal', emoji: '⬛', time: '45m', percent: 10, type: 'productive' as const },
  { name: 'YouTube', emoji: '▶️', time: '38m', percent: 8, type: 'distraction' as const },
  { name: 'WhatsApp', emoji: '💬', time: '29m', percent: 6, type: 'distraction' as const },
  { name: 'Figma', emoji: '🎨', time: '22m', percent: 5, type: 'productive' as const },
  { name: 'Slack', emoji: '📢', time: '18m', percent: 4, type: 'productive' as const },
  { name: 'Instagram', emoji: '📸', time: '10m', percent: 2, type: 'distraction' as const },
];

export const timelineStories = [
  {
    id: 1,
    start: '9:05 AM',
    end: '9:28 AM',
    state: 'idle' as CognitiveState,
    narrative: 'Your day started slowly — 23 minutes of light browsing before the first real engagement.',
    apps: [{ name: 'Chrome', percent: 70 }, { name: 'Slack', percent: 30 }],
    emotion: { label: 'Calm', color: 'hsl(142, 71%, 45%)' },
    automation: null,
  },
  {
    id: 2,
    start: '9:28 AM',
    end: '10:45 AM',
    state: 'focus' as CognitiveState,
    narrative: 'You entered deep focused coding — 77 minutes of uninterrupted flow with VS Code as your primary window.',
    apps: [{ name: 'VS Code', percent: 68 }, { name: 'Chrome', percent: 22 }, { name: 'Terminal', percent: 10 }],
    emotion: { label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
    automation: '🎵 Ambient Sound activated',
  },
  {
    id: 3,
    start: '10:45 AM',
    end: '11:15 AM',
    state: 'distracted' as CognitiveState,
    narrative: 'Context switching spiked — you bounced between 6 different tabs and 3 apps in 30 minutes.',
    apps: [{ name: 'Chrome', percent: 55 }, { name: 'WhatsApp', percent: 30 }, { name: 'YouTube', percent: 15 }],
    emotion: { label: 'Stressed', color: 'hsl(38, 92%, 50%)' },
    automation: '🎯 Focus Mode activated',
  },
  {
    id: 4,
    start: '11:15 AM',
    end: '11:38 AM',
    state: 'confused' as CognitiveState,
    narrative: 'High backspace rate and repeated undo cycles suggest you were wrestling with a complex problem.',
    apps: [{ name: 'VS Code', percent: 80 }, { name: 'Chrome', percent: 20 }],
    emotion: { label: 'Frustrated', color: 'hsl(0, 72%, 51%)' },
    automation: '❓ Help overlay suggested',
  },
  {
    id: 5,
    start: '11:38 AM',
    end: '12:30 PM',
    state: 'focus' as CognitiveState,
    narrative: 'You pushed through and found your groove — 52 minutes of steady, productive coding work.',
    apps: [{ name: 'VS Code', percent: 75 }, { name: 'Terminal', percent: 15 }, { name: 'Chrome', percent: 10 }],
    emotion: { label: 'Curious', color: 'hsl(172, 66%, 50%)' },
    automation: null,
  },
  {
    id: 6,
    start: '12:30 PM',
    end: '1:15 PM',
    state: 'idle' as CognitiveState,
    narrative: 'Lunch break — no significant activity for 45 minutes. Good recovery time detected.',
    apps: [{ name: 'YouTube', percent: 60 }, { name: 'Chrome', percent: 40 }],
    emotion: { label: 'Calm', color: 'hsl(142, 71%, 45%)' },
    automation: null,
  },
  {
    id: 7,
    start: '1:15 PM',
    end: '2:45 PM',
    state: 'focus' as CognitiveState,
    narrative: 'Your longest focus block of the day — 90 minutes of sustained deep work, your personal best this week.',
    apps: [{ name: 'VS Code', percent: 70 }, { name: 'Figma', percent: 20 }, { name: 'Chrome', percent: 10 }],
    emotion: { label: 'Engaged', color: 'hsl(199, 89%, 48%)' },
    automation: '🔕 Notifications blocked',
  },
  {
    id: 8,
    start: '2:45 PM',
    end: '3:30 PM',
    state: 'fatigued' as CognitiveState,
    narrative: 'Cognitive fatigue set in after the extended focus session — typing slowed and error rate climbed.',
    apps: [{ name: 'Chrome', percent: 50 }, { name: 'Slack', percent: 35 }, { name: 'VS Code', percent: 15 }],
    emotion: { label: 'Calm', color: 'hsl(142, 71%, 45%)' },
    automation: '☕ Break suggested',
  },
];
