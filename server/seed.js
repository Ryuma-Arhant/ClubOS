require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');
const Club     = require('./models/Club');
const Event    = require('./models/Event');
const Message  = require('./models/Message');
const Album    = require('./models/Album');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing...');
  await Promise.all([
    User.deleteMany({}), Club.deleteMany({}),
    Event.deleteMany({}), Message.deleteMany({}), Album.deleteMany({}),
  ]);

  const hash = pwd => bcrypt.hashSync(pwd, 10);

  // Users
  const users = await User.insertMany([
    { name: 'Dr. Sarah Chen', email: 'superadmin@uni.edu', password: hash('password123'), role: 'Super Admin', roleVariant: 'gold' },
    { name: 'Alex Rivera',    email: 'clubadmin@uni.edu',  password: hash('password123'), role: 'Club Admin',  roleVariant: 'amber' },
    { name: 'Jamie Park',     email: 'coadmin@uni.edu',    password: hash('password123'), role: 'Co-Admin',    roleVariant: 'blue' },
    { name: 'Maya Johnson',   email: 'student@uni.edu',    password: hash('password123'), role: 'Student',     roleVariant: 'purple' },
  ]);
  const [superAdmin, clubAdmin, coAdmin, student] = users;

  // Clubs
  const clubs = await Club.insertMany([
    { name: 'Computer Science Club', category: 'Tech',       status: 'Active',   department: 'CS',         founded: 2019, admin: clubAdmin._id, members: [clubAdmin._id, coAdmin._id, student._id] },
    { name: 'Drama Society',          category: 'Arts',       status: 'Active',   department: 'Arts',        founded: 2015 },
    { name: 'Environmental Club',     category: 'Science',    status: 'Active',   department: 'Science',     founded: 2018 },
    { name: 'Music Ensemble',         category: 'Arts',       status: 'Active',   department: 'Music',       founded: 2012 },
    { name: 'Chess Club',             category: 'Games',      status: 'Active',   department: 'Recreation',  founded: 2020 },
    { name: 'Philosophy Circle',      category: 'Humanities', status: 'Pending',  department: 'Humanities',  founded: 2026 },
    { name: 'Innovation Hub',         category: 'Tech',       status: 'Pending',  department: 'Engineering', founded: 2026 },
    { name: 'Film Society',           category: 'Arts',       status: 'Archived', department: 'Arts',        founded: 2014 },
    { name: 'Photography Society',    category: 'Arts',       status: 'Pending',  department: 'Arts',        founded: 2026, submittedBy: 'r.patel@uni.edu' },
    { name: 'Blockchain Club',        category: 'Tech',       status: 'Pending',  department: 'Tech',        founded: 2026, submittedBy: 'k.alex@uni.edu' },
    { name: 'Debate Union',           category: 'Humanities', status: 'Pending',  department: 'Humanities',  founded: 2026, submittedBy: 'm.priya@uni.edu' },
    { name: 'Robotics Lab',           category: 'Engineering',status: 'Pending',  department: 'Engineering', founded: 2026, submittedBy: 't.wilson@uni.edu' },
  ]);
  const csClub = clubs[0];

  // Events
  await Event.insertMany([
    { name: 'Annual Tech Showcase',       club: 'CS Club',             clubId: csClub._id, date: '2026-04-28', time: '6:00 PM',  location: 'Main Auditorium',     category: 'Showcase',    status: 'Published', capacity: 120, description: 'Annual showcase of student projects and innovations in CS.',   createdBy: clubAdmin._id },
    { name: 'Coding Workshop #4',         club: 'CS Club',             clubId: csClub._id, date: '2026-05-03', time: '2:00 PM',  location: 'Lab B-204',           category: 'Workshop',    status: 'Draft',     capacity: 40,  description: 'Hands-on session covering advanced React patterns.',            createdBy: clubAdmin._id },
    { name: 'Industry Networking Night',  club: 'CS Club',             clubId: csClub._id, date: '2026-05-10', time: '7:00 PM',  location: 'Event Hall C',        category: 'Networking',  status: 'Ongoing',   capacity: 60,  description: 'Meet professionals from top tech companies.',                   createdBy: clubAdmin._id },
    { name: 'Hackathon Prep Session',     club: 'CS Club',             clubId: csClub._id, date: '2026-05-07', time: '3:00 PM',  location: 'Lab A-101',           category: 'Workshop',    status: 'Published', capacity: 50,  description: 'Prep session for the upcoming inter-university hackathon.',     createdBy: coAdmin._id },
    { name: 'Nature Photography Walk',    club: 'Photography Society', date: '2026-05-01', time: '9:00 AM',  location: 'Botanical Garden',    category: 'Outing',      status: 'Published', capacity: 30,  description: 'Guided photography walk through the campus botanical garden.' },
    { name: 'Portrait Workshop',          club: 'Photography Society', date: '2026-05-14', time: '1:00 PM',  location: 'Studio Room 3',       category: 'Workshop',    status: 'Draft',     capacity: 20,  description: 'Learn professional portrait lighting techniques.' },
    { name: 'Green Campus Cleanup',       club: 'Environmental Club',  date: '2026-05-05', time: '8:00 AM',  location: 'Campus Grounds',      category: 'Social',      status: 'Published', capacity: 80,  description: 'Join us for a morning campus cleanup drive.' },
    { name: 'Sustainability Panel',       club: 'Environmental Club',  date: '2026-05-18', time: '5:00 PM',  location: 'Lecture Hall 2',      category: 'Talk',        status: 'Draft',     capacity: 100, description: 'Panel discussion on sustainable practices in university life.' },
    { name: 'Spring Music Concert',       club: 'Music Ensemble',      date: '2026-05-22', time: '8:00 PM',  location: 'Performing Arts Hall', category: 'Performance', status: 'Published', capacity: 150, description: 'End-of-semester live concert featuring all ensembles.' },
    { name: 'Chess Tournament',           club: 'Chess Club',          date: '2026-05-09', time: '10:00 AM', location: 'Student Union Room 4', category: 'Competition', status: 'Published', capacity: 32,  description: 'Round-robin tournament open to all skill levels.' },
    { name: 'Debate Finals',              club: 'Debate Union',        date: '2026-05-15', time: '4:00 PM',  location: 'Main Auditorium',     category: 'Competition', status: 'Draft',     capacity: 200, description: 'Semester-final debate on global policy topics.' },
    { name: 'Film Screening Night',       club: 'Drama Society',       date: '2026-05-20', time: '7:30 PM',  location: 'Media Room 1',        category: 'Social',      status: 'Published', capacity: 60,  description: 'Screening of student-produced short films.' },
  ]);

  // Seed some RSVPs
  const events = await Event.find();
  const rsvpCounts = [87, 0, 52, 31, 22, 0, 38, 0, 94, 18, 0, 41];
  for (let i = 0; i < events.length; i++) {
    events[i].rsvps = new Array(rsvpCounts[i]).fill(student._id);
    await events[i].save();
  }

  // Messages for CS Club
  await Message.insertMany([
    { clubId: csClub._id, userId: clubAdmin._id, sender: 'Alex Rivera', avatar: 'A', text: 'Hey everyone! Reminder that Tech Showcase is next Friday.' },
    { clubId: csClub._id, userId: student._id,   sender: 'Maya Johnson', avatar: 'M', text: 'Looking forward to it! Do we need to bring our own laptops?' },
    { clubId: csClub._id, userId: coAdmin._id,   sender: 'Jamie Park',   avatar: 'J', text: 'Yes — please bring your own laptop and install the required tools beforehand.' },
    { clubId: csClub._id, userId: student._id,   sender: 'Maya Johnson', avatar: 'M', text: "I'll prepare the presentation slides and share them tonight." },
    { clubId: csClub._id, userId: coAdmin._id,   sender: 'Jamie Park',   avatar: 'J', text: "Perfect, thanks Maya! Also make sure to RSVP if you haven't yet 🎉" },
    { clubId: csClub._id, userId: clubAdmin._id, sender: 'Alex Rivera', avatar: 'A', text: 'Shared the event doc in the Events tab. Check it out!' },
  ]);

  // Gallery albums for CS Club
  await Album.insertMany([
    { clubId: csClub._id, name: 'Tech Showcase 2026',   visibility: 'Members Only', photos: [{seed:10},{seed:11},{seed:22}] },
    { clubId: csClub._id, name: 'Club Orientation Day', visibility: 'Public',       photos: [{seed:20},{seed:21},{seed:33}] },
    { clubId: csClub._id, name: 'Hackathon 2025',       visibility: 'Members Only', photos: [{seed:30},{seed:31},{seed:44}] },
    { clubId: csClub._id, name: 'Holiday Social',       visibility: 'Public',       photos: [{seed:40},{seed:41},{seed:55}] },
    { clubId: csClub._id, name: 'Workshop Series',      visibility: 'Members Only', photos: [{seed:50},{seed:51},{seed:66}] },
    { clubId: csClub._id, name: 'Welcome Picnic',       visibility: 'Public',       photos: [{seed:60},{seed:61},{seed:77}] },
  ]);

  console.log('Seeded successfully!');
  console.log('\nDemo credentials (all passwords: password123):');
  console.log('  Super Admin: superadmin@uni.edu');
  console.log('  Club Admin:  clubadmin@uni.edu');
  console.log('  Co-Admin:    coadmin@uni.edu');
  console.log('  Student:     student@uni.edu');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
