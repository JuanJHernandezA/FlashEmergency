# Priority 18 - Guided AI Emergency Flow

Status: TODO

## Goal

Improve the AI Assistant by adding a guided emergency flow.

The user should not always need to start by typing a free-form message.

The flow must guide the user through quick emergency categories and then ask contextual questions.

---

## 1. Initial Question

When starting a new AI conversation, display:

"What happened?"

Show quick action buttons:

- Burn
- Cut
- Fall
- Choking
- Chest Pain
- Other

Use Lucide React icons.

Do not use emojis.

---

## 2. Quick Selection

When the user selects a category:

- Add the selected situation as a user message.
- Save it to the current AI conversation.
- Send the context to the existing AI service.
- The AI must ask relevant follow-up questions.

Do not create a new chat for every question.

---

## 3. Contextual Questions

The AI should ask questions based on the selected emergency.

Examples:

### Burn

Ask:

- What caused the burn?
- How large is the affected area?
- Is the skin blistered?
- Is the person conscious?

### Cut

Ask:

- How deep is the wound?
- Is there heavy bleeding?
- Is the bleeding controlled?
- Is the person conscious?

### Fall

Ask:

- Did the person hit their head?
- Is the person conscious?
- Can they move?
- Is there severe pain?

### Choking

Ask:

- Is the person conscious?
- Can they breathe?
- Can they speak or cough?

### Chest Pain

Ask:

- Is the person conscious?
- Is the pain severe?
- Is there difficulty breathing?
- Does the pain spread to the arm, jaw or back?

### Other

Allow the user to describe the emergency using text.

---

## 4. Emergency Context

Include the following context in the AI request:

- Selected emergency type.
- User language.
- Detected country.
- Local emergency number.
- Current location if available.

The AI must use the correct local emergency number.

The AI must never invent an emergency number.

---

## 5. Critical Emergency Detection

If the user describes a potentially life-threatening situation:

- Clearly recommend calling the local emergency number.
- Show the emergency number prominently.
- Provide a Call Emergency button.
- Do not bury the emergency action inside a long AI response.

---

## 6. UI

Create a clean guided flow:

Question:

"What happened?"

Quick actions:

[Burn] [Cut] [Fall]

[Choking] [Chest Pain] [Other]

After selecting an option:

- Show the selected category.
- Display the next AI question.
- Allow quick answers when appropriate.
- Keep the normal text input available.

The user must be able to switch to free text at any time.

---

## 7. Conversation Persistence

Every selected category, user answer and AI response must be saved immediately.

The conversation must continue working when:

- Navigating to another page.
- Returning to the AI Assistant.
- Opening the conversation from History.

Use the existing IndexedDB architecture.

---

## 8. Accessibility

- Keyboard accessible.
- Clear focus states.
- Large touch targets.
- Good color contrast.
- Screen reader labels.
- Light and dark mode support.

---

## Requirements

- Reuse the existing AI service.
- Reuse the existing conversation persistence.
- Do not create a second chat system.
- Do not add unnecessary dependencies.
- Use TypeScript strict mode.
- Use existing design tokens.
- Use Lucide React icons.
- Do not use emojis.
- Keep the application compiling.