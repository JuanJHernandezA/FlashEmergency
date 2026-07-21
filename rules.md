# rules.md

# 🚨 SafeAid AI - Project Rules & Specification

## Project Name

SafeAid AI

---

# Project Overview

SafeAid AI is a web application designed to assist users during emergency situations by providing immediate access to nearby emergency services, AI-powered first aid guidance, and tools to quickly share their location with trusted contacts.

The application aims to reduce response time during emergencies by centralizing critical information in one place.

This application is intended as an emergency assistant and **does not replace professional medical services or emergency responders.**

---

# Problem Statement

During an emergency people often:

- Panic and don't know what to do.
- Don't know where the nearest hospital is.
- Lose valuable time searching Google.
- Cannot accurately describe their location.
- Need quick first aid instructions before professional help arrives.

SafeAid AI solves these problems in a single application.

---

# Objectives

The application must allow users to:

- Obtain their current location.
- Find nearby emergency services.
- Receive AI-assisted first aid guidance.
- Share their current location with emergency contacts.
- Access emergency information as quickly as possible.

---

# Target Users

- Students
- Families
- Elderly people
- Drivers
- Tourists
- Outdoor adventurers
- Anyone carrying a smartphone

---

# Core Features

## 1. Current Location

The application must request permission to access the user's GPS location.

Information obtained:

- Latitude
- Longitude
- Accuracy

Browser API

- Geolocation API

---

## 2. Interactive Map

Display an interactive map centered on the user's location.

The map should include nearby:

- Hospitals
- Clinics
- Pharmacies
- Police stations
- Fire stations

Technology

- Leaflet
- OpenStreetMap

---

## 3. Nearby Emergency Services

Automatically search nearby emergency services based on GPS location.

Results should display:

- Name
- Distance
- Address
- Route button
- Open in Maps button

Service

- Overpass API

---

## 4. Emergency Categories

The application must provide quick-access emergency buttons.

Examples:

- Bleeding
- Heart attack
- Burns
- Fractures
- Choking
- Poisoning
- Car accident
- Allergic reaction
- Animal bite
- Snake bite
- Loss of consciousness

---

## 5. AI Emergency Assistant

Users can describe the emergency using text or voice.

Example:

"My father isn't breathing."

Gemini analyzes the request and returns:

- Immediate actions
- Safety precautions
- Things to avoid
- Recommended next step

Important:

Responses must always remind the user to contact emergency services.

The AI must never diagnose diseases or replace medical professionals.

---

## 6. Voice Input

Allow users to speak instead of typing.

Browser API

Speech Recognition API

Examples

- I burned my hand.
- My child is choking.
- Someone fainted.
- I need help.

---

## 7. Voice Response

The assistant should be capable of reading instructions aloud.

Browser API

Speech Synthesis API

Useful when:

- User cannot read.
- User is driving.
- User is assisting another person.

---

## 8. Share My Location

One-click button to share the user's location.

Browser API

Web Share API

Shared message example:

Need help!

My current location:

https://maps.google.com/?q=<latitude>,<longitude>

---

## 9. Copy Coordinates

Allow copying GPS coordinates to clipboard.

Browser API

Clipboard API

---

## 10. SOS Button

Large floating emergency button.

When pressed:

- Vibrates phone
- Opens share dialog
- Speaks confirmation
- Displays emergency contacts

Browser APIs

- Vibration API
- Web Share API
- Speech Synthesis

---

## 11. Emergency Contacts

Allow users to save trusted contacts.

Example:

- Mom
- Dad
- Brother
- Friend

Stored locally.

---

## 12. History

Store previous emergency searches.

Examples

July 18

- Hospital search

July 20

- Burn assistance

Storage

IndexedDB

---

## 13. Offline Mode

If internet is unavailable:

The application should still show:

- Last known location
- Saved emergency contacts
- Offline first aid guides

Technology

Service Workers

IndexedDB

---

# User Flow

Home

↓

Grant GPS permission

↓

Map loads

↓

Nearby services appear

↓

Select emergency

↓

Receive AI guidance

↓

Share location if needed

↓

Navigate to nearest emergency service

---

# Browser APIs

## Geolocation API

Purpose

Obtain current GPS location.

---

## Web Share API

Purpose

Share emergency location.

---

## Speech Recognition API

Purpose

Voice input.

---

## Speech Synthesis API

Purpose

Read instructions aloud.

---

## Notification API

Optional

Remind user to seek professional help.

---

## Clipboard API

Purpose

Copy coordinates.

---

## Vibration API

Purpose

Feedback when SOS button is pressed.

---

## IndexedDB

Purpose

Store:

- Contacts
- History
- Offline guides

---

## Service Workers

Purpose

Offline support.

---

# External APIs

## OpenStreetMap

Purpose

Display maps.

Cost

Free

---

## Overpass API

Purpose

Find nearby:

- Hospitals
- Pharmacies
- Police
- Fire stations

Cost

Free

---

## Gemini API

Purpose

AI assistant.

Responsibilities

- Explain first aid
- Interpret emergency descriptions
- Generate emergency instructions
- Answer follow-up questions

---

# Suggested Technology Stack

Frontend

- React
- TypeScript
- Vite
- TailwindCSS

Maps

- Leaflet
- React Leaflet

Backend (Optional)

- Node.js
- Express

Storage

- IndexedDB

Deployment

- AWS Amplify
- Vercel
- Netlify

---

# UI Pages

## Home

Contains

- Hero
- Start button
- About section

---

## Emergency Dashboard

Contains

- Interactive map
- Current location
- Nearby services
- SOS button

---

## AI Assistant

Contains

- Chat
- Voice input
- Voice response

---

## Emergency Contacts

Contains

- CRUD contacts

---

## History

Contains

- Previous searches
- Previous AI conversations

---

# Color Palette

Primary

Red (#DC2626)

Secondary

Blue (#2563EB)

Background

White (#FFFFFF)

Text

Gray (#1F2937)

Success

Green (#16A34A)

Warning

Yellow (#FACC15)

Danger

Dark Red (#991B1B)

---

# Accessibility

The application should:

- Use large buttons.
- High contrast colors.
- Large typography.
- Keyboard navigation.
- Screen reader compatibility.
- Voice assistance.

---

# Future Improvements

- Video call with emergency contact.
- Fall detection using device sensors.
- Smartwatch integration.
- Earthquake alerts.
- Flood alerts.
- Weather alerts.
- Automatic emergency SMS.
- Multi-language support.
- Emergency QR Code.
- AED (Defibrillator) locations.
- Blood bank locations.

---

# AI Prompt Rules

The AI assistant must:

✔ Stay calm.

✔ Give step-by-step instructions.

✔ Recommend contacting emergency services.

✔ Never invent medical facts.

✔ Never prescribe medication.

✔ Never replace a doctor.

✔ Clearly state when immediate professional assistance is required.

---

# Disclaimer

SafeAid AI is an informational emergency assistant.

It does not replace:

- Doctors
- Hospitals
- Ambulances
- Emergency services

Always contact your local emergency services in life-threatening situations.

---

# Success Criteria

The project is considered complete when:

- User can obtain current location.
- Nearby emergency services are displayed.
- Interactive map works correctly.
- AI provides emergency guidance.
- Voice input works.
- Voice output works.
- Location can be shared.
- Emergency contacts are stored.
- Application works as a PWA.
- Basic offline functionality is available.

---

# Project Vision

SafeAid AI aims to become an accessible emergency assistant capable of helping anyone, anywhere, by combining browser APIs, artificial intelligence, and free geolocation services into a single, easy-to-use web application that can make a difference during the first critical minutes of an emergency.

---

# Design System

The application must have a modern, clean and trustworthy design.

The design should inspire confidence, safety and simplicity.

Avoid dark themes.

Primary design inspiration:

- Google Material Design
- Apple Human Interface
- Stripe Dashboard
- Linear.app

Style

- Minimalist
- Modern
- Responsive
- Rounded corners
- Soft shadows
- Smooth animations

---

# Color Palette

Primary

Blue 600
#2563EB

Primary Hover

Blue 700
#1D4ED8

Secondary

Sky 500
#0EA5E9

Success

Green 600
#16A34A

Warning

Amber 500
#F59E0B

Danger

Red 600
#DC2626

Background

#F8FAFC

Cards

#FFFFFF

Border

#E2E8F0

Text Primary

#0F172A

Text Secondary

#64748B

---

# UI Components

Buttons

- Rounded XL
- Large touch targets
- Icon + Text
- Hover animations
- Loading states

Cards

- Rounded 2xl
- Shadow-md
- White background

Inputs

- Rounded
- Floating labels
- Icon support

Dialogs

- Blur background
- Rounded corners

Navigation

- Sticky Navbar
- Mobile Bottom Navigation
- Floating SOS Button

Map

- Full width
- Rounded borders
- Current location marker
- Emergency markers

---

# Icons

Use only:

Lucide React

Avoid multiple icon libraries.

---

# Typography

Font

Poppins

Fallback

sans-serif

Sizes

Hero

48px

Title

32px

Subtitle

24px

Body

16px

Caption

14px

Buttons

16px

Font Weight

400

500

600

700

---

# Animations

Use Framer Motion.

Animations should be subtle.

Examples

- Fade
- Slide Up
- Scale
- Button Hover
- Loading Skeleton

Avoid excessive animations.

---

# Responsive Design

Support

- Mobile First
- Tablet
- Desktop

Breakpoints

sm

md

lg

xl

All pages must be responsive.

---

# Tech Stack

Frontend

- React 19
- TypeScript
- Vite

Styling

- TailwindCSS v4

Routing

- React Router DOM

Maps

- Leaflet
- React Leaflet

HTTP Client

- Axios

State Management

- TanStack Query

Forms

- React Hook Form

Validation

- Zod

Icons

- Lucide React

Animations

- Framer Motion

Notifications

- Sonner

AI

- Google Gemini API

Storage

- IndexedDB

Deployment

- AWS Amplify
or
- Vercel

---

# Folder Structure

src/

assets/

components/

components/ui/

components/layout/

components/map/

components/chat/

components/emergency/

hooks/

pages/

services/

types/

utils/

contexts/

routes/

styles/

constants/

lib/

---

# Code Style

Always use

TypeScript

Never use

JavaScript

Rules

- Strict typing
- Functional Components
- Custom Hooks
- Reusable Components
- No duplicated code
- No inline styles
- No unnecessary comments

---

# Naming Convention

Components

PascalCase

Example

EmergencyCard.tsx

Hooks

camelCase

Example

useLocation.ts

Pages

PascalCase

Example

HomePage.tsx

Constants

UPPER_SNAKE_CASE

Types

PascalCase

Interfaces

Prefix with I

Example

IEmergency

Enums

PascalCase

---

# Performance

Lazy load pages.

Lazy load map.

Optimize images.

Avoid unnecessary re-renders.

Memoize expensive calculations.

Use React Query cache.

---

# Accessibility

All buttons must have aria-label.

Images require alt text.

Keyboard navigation required.

High color contrast.

Screen reader compatibility.

Large clickable areas.

---

# PWA

The application should be installable.

Support offline mode.

Cache assets.

Show install prompt.

---

# Git Rules

Use feature branches.

Commit convention

feat:

fix:

refactor:

docs:

style:

test:

chore:

---

# Quality Standards

Every feature should:

✔ Be responsive

✔ Have loading states

✔ Handle errors

✔ Handle empty states

✔ Follow the Design System

✔ Follow TypeScript strict mode

✔ Be reusable

✔ Be accessible

✔ Be production-ready

---

# UI Philosophy

Every screen should communicate:

Safety

Trust

Speed

Clarity

The user should be able to perform any emergency action within three taps or less.

# Development Workflow

The AI assistant must never generate the entire application in a single response.

Instead, development must follow incremental milestones.

Each milestone should:

- compile successfully;
- keep the application runnable;
- avoid placeholders whenever possible;
- include proper TypeScript typing;
- follow the folder structure;
- be production-ready.

After completing a milestone, stop and wait for the next instruction.

Never modify unrelated files.

Never introduce new libraries unless explicitly requested.

Always prefer reusable components over duplicated code.