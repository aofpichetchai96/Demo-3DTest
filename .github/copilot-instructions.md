<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# OEM รองเท้านันยาง - Copilot Instructions

## Project Overview
This is a custom rubber shoe OEM website built with Next.js, TypeScript, and 3D visualization. The project includes:

- **3D Shoe Customization**: Using Three.js and React Three Fiber for 3D rendering
- **Authentication System**: NextAuth.js for member-only access
- **Product Customization**: Model selection, color customization, and size options
- **Collection Management**: Save and manage custom shoe designs
- **Billing System**: Generate quotes and invoices
- **Responsive Design**: Mobile-friendly interface inspired by Nike's customization page

## Key Technologies
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **3D Rendering**: Three.js, React Three Fiber (@react-three/fiber), Drei (@react-three/drei)
- **Authentication**: NextAuth.js with JWT tokens
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Lucide React icons, Class Variance Authority
- **State Management**: Zustand (via Drei dependencies)

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow Next.js App Router patterns
- Implement responsive design with Tailwind CSS
- Use proper 3D scene optimization techniques
- Implement proper error handling and loading states
- Follow accessibility best practices

## File Structure
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - Reusable React components
- `/src/lib/` - Utility functions and configurations
- `/src/types/` - TypeScript type definitions
- `/src/hooks/` - Custom React hooks
- `/src/styles/` - Global styles and Tailwind configuration

## 3D Development Notes
- Use React Three Fiber for declarative 3D scenes
- Implement proper camera controls and lighting
- Optimize 3D models for web performance
- Use Drei helpers for common 3D operations
- Implement proper texture and material management

## UI/UX Requirements
- Design should be modern and professional
- Implement Nike-style customization interface
- Ensure smooth 3D interactions
- Provide intuitive color and material selection
- Include proper loading states for 3D assets
