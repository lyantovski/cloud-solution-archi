# Cloud Solution Architect Recruitment Site

Attract top-tier cloud architects to apply for Microsoft's Cloud Solution Architect position through an engaging, professional recruitment experience.

**Experience Qualities**:
1. **Professional** - Conveys Microsoft's enterprise credibility and the seniority of the role
2. **Inspiring** - Showcases the impact and growth opportunities of the position  
3. **Accessible** - Makes complex technical requirements digestible and actionable

**Complexity Level**: Content Showcase (information-focused)
The site primarily presents job information and collects applications, with minimal interactive state beyond form handling.

## Essential Features

### Hero Section with Job Overview
- **Functionality**: Prominently displays the job title, company, and key selling points
- **Purpose**: Immediately communicate the opportunity and capture interest
- **Trigger**: Page load
- **Progression**: Hero view → CTA visibility → scroll engagement
- **Success criteria**: Clear value proposition visible within 3 seconds

### Detailed Job Description
- **Functionality**: Organized presentation of responsibilities, qualifications, and role impact
- **Purpose**: Help candidates assess fit and understand expectations
- **Trigger**: User scrolls or clicks "Learn More"
- **Progression**: Overview → detailed sections → qualification assessment
- **Success criteria**: Information is scannable with clear hierarchy

### Application Form
- **Functionality**: Collect candidate information and CV upload
- **Purpose**: Convert interested visitors into applicants
- **Trigger**: User clicks "Apply Now" CTA
- **Progression**: Form display → information entry → CV upload → submission confirmation
- **Success criteria**: Form completion rate >60%, successful submissions stored

### Requirements Checker
- **Functionality**: Interactive checklist to help candidates self-assess qualification alignment
- **Purpose**: Encourage qualified candidates while setting clear expectations
- **Trigger**: User clicks "Check Your Fit"
- **Progression**: Checklist display → selection → feedback → application encouragement
- **Success criteria**: 70% of users who complete checker proceed to apply

## Edge Case Handling
- **Large file uploads**: File size validation with clear error messages
- **Network interruptions**: Form data persistence during submission
- **Mobile browsing**: Responsive design for professional mobile experience
- **Accessibility**: Keyboard navigation and screen reader compatibility

## Design Direction
The design should feel cutting-edge yet trustworthy, reflecting Microsoft's innovation leadership while maintaining corporate professionalism suitable for senior-level recruitment.

## Color Selection
Complementary (opposite colors) - Using Microsoft's brand blue with warm accent colors to create professional trust while highlighting key actions and opportunities.

- **Primary Color**: Deep Azure Blue (oklch(0.45 0.15 240)) - Communicates Microsoft's brand authority and technical expertise
- **Secondary Colors**: Cool Gray (oklch(0.25 0.02 240)) for supporting text and Professional White (oklch(0.98 0.01 240)) for clean backgrounds
- **Accent Color**: Energetic Orange (oklch(0.65 0.18 45)) - Highlights CTAs and opportunities for career growth
- **Foreground/Background Pairings**: 
  - Background (Professional White): Dark Blue text (oklch(0.25 0.02 240)) - Ratio 12.1:1 ✓
  - Primary (Deep Azure): White text (oklch(0.98 0.01 240)) - Ratio 8.2:1 ✓
  - Accent (Energetic Orange): White text (oklch(0.98 0.01 240)) - Ratio 4.9:1 ✓
  - Card (Light Gray): Dark Blue text (oklch(0.25 0.02 240)) - Ratio 11.3:1 ✓

## Font Selection
Typography should convey modern professionalism and technical credibility, using clean sans-serif fonts that enhance readability of complex technical content.

- **Typographic Hierarchy**:
  - H1 (Hero Title): Inter Bold/48px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/32px/normal letter spacing  
  - H3 (Subsections): Inter Medium/24px/normal letter spacing
  - Body (Content): Inter Regular/16px/relaxed line height
  - Caption (Meta info): Inter Regular/14px/muted color

## Animations
Subtle animations should reinforce the cutting-edge nature of cloud technology while maintaining professional restraint appropriate for enterprise recruitment.

- **Purposeful Meaning**: Smooth transitions communicate technological sophistication and attention to detail
- **Hierarchy of Movement**: Hero elements fade in on load, form sections slide in on scroll, CTAs have gentle hover states

## Component Selection
- **Components**: Card for job sections, Dialog for application form, Button for CTAs, Checkbox for requirements checker, Input/Textarea for form fields, Badge for skill tags
- **Customizations**: Custom hero section with gradient background, specialized requirements checker component, file upload with progress indicator
- **States**: Buttons show loading states during form submission, form inputs provide validation feedback, success states for completed actions
- **Icon Selection**: Phosphor icons for technical concepts (Cloud, Code, Users), UI actions (Upload, Check, Arrow)
- **Spacing**: Consistent 8px grid system with generous 24px section spacing
- **Mobile**: Stacked layout on mobile, collapsible job sections, simplified navigation with sticky apply button