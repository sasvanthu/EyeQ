export const mockStats = {
  totalMembers: 264,
  pendingApprovals: 6,
  eventsConducted: 42,
  activeMembers: 190,
};

export const mockMembers = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `Member ${i + 1}`,
  email: `member${i + 1}@eyeq.club`,
  role: ['Member', 'PR', 'Events', 'Tech Lead', 'Vice President'][i % 5],
  joined: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 30).toISOString(),
  approved: i % 6 !== 0,
}));

export const mockEvents = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Event #${i + 1}`,
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * (i + 1)).toISOString(),
  attendees: Math.floor(Math.random() * 120) + 10,
  prize: i % 3 === 0 ? `₹ ${500 + i * 250}` : null,
  type: ['Workshop', 'Hackathon', 'Meetup'][i % 3],
  // attendee ids referencing mockMembers
  attendeeIds: Array.from({ length: Math.floor(Math.random()*10)+3 }).map(() => Math.floor(Math.random() * 20) + 1),
}));

export const mockActivities = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `Member Activity ${i + 1}`,
  user: `Member ${Math.floor(Math.random() * 20) + 1}`,
  timeAgo: `${Math.floor(Math.random() * 60)}m ago`,
}));

// Global attendance logs for events
export const mockAttendanceLogs = mockEvents.flatMap((e) => (
  (e.attendeeIds || []).map((memberId, idx) => ({
    id: `${e.id}-${idx}`,
    eventId: e.id,
    memberId,
    time: new Date(new Date(e.date).getTime() + Math.floor(Math.random()*1000*60*60*4)).toISOString(),
  }))
));

export const mockAchievements = [
  { id: 1, title: 'Hackathon Winner - VisionX 2024', description: 'Our team won first place for real-time tracking.', date: new Date(Date.now() - 1000*60*60*24*120).toISOString(), eventId: 3 },
  { id: 2, title: 'Open Source Release', description: 'Released the club project on GitHub with 100 stars.', date: new Date(Date.now() - 1000*60*60*24*40).toISOString(), eventId: 7 },
  { id: 3, title: 'Industry Talk', description: 'Guest lecture from AI Lead at CompanyX.', date: new Date(Date.now() - 1000*60*60*24*10).toISOString(), eventId: 11 },
];

export const mockMemberGrowth = Array.from({ length: 12 }).map((_, i) => ({ month: i+1, members: 120 + i*10 + Math.floor(Math.random()*20) }));
