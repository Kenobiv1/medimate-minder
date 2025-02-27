# Medimate Minder

An easy-to-use application that helps you manage your daily medication schedule. With Medimate Minder, you can add new medications, set alarms, track medication history, and configure settings such as dark mode.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage](#usage)
  - [Dashboard](#dashboard)
  - [Adding and Configuring Medications](#adding-and-configuring-medications)
  - [Medication Alarms](#medication-alarms)
  - [Medication History](#medication-history)
  - [Settings](#settings)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Add New Medications**: Enter the name, dosage, and alarms for a new medication.
- **Configure Medications**: Update medication details or modify alarms.
- **Medication Alarms**: Get reminders for each medication based on your scheduled times.
- **Medication History**: Track your medication intake history (taken or missed).
- **Dark Mode Support**: Toggle between light and dark themes.
- **Emergency Contact**: One-click emergency contact calling (configurable).

## Tech Stack

- **React** (TypeScript) + **Vite** for the frontend
- **Tailwind CSS** + [shadcn/ui](https://ui.shadcn.com/) for styling
- **React Router** for navigation
- **React Query** for data fetching and caching (if used)
- **sonner** / **Radix Toast** for notifications
- Additional libraries: **date-fns**, **lucide-react**, etc.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone** the repository:

   ```bash
   git clone <REPO_URL>
   cd <REPO_NAME>
