# profileAngular

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [File Structure](#file-structure)
- [Installation](#installation)
- [Development Server](#development-server)

---

## Overview
**A modern Angular application that allows users to edit and manage their profile information. This project uses Angular's reactive forms for efficient form handling, along with features for file uploads and dynamic form validation.

> Built with [Angular](https://angular.io/) and [Tailwind CSS](https://tailwindcss.com/) for a seamless user experience.

## Features

- **Edit Profile**: Modify the user's first name, last name, email, phone number, and profile picture.
- **Validation**: Form fields have validation with error messages.
- **Image Upload**: Upload and preview profile images with a max size of 2MB.
- **Dynamic Feedback**: Displays loading indicators, success messages, and error messages.
- **No-Changes Protection**: Prevents saving if no changes are made, prompting the user to either modify or cancel.
- **Responsive Design**: Fully responsive UI, optimized for both desktop and mobile devices.

## File Structure
```plaintext
profileAngular/
├── src/
    └── app/
        ├── edit-profile/
            ├── edit-profile.component.html
            └── edit-profile.component.ts
        ├── model/
            ├── profile.ts
            └── toast.ts
        ├── profile/
            ├── profile.component.html
            └── profile.component.ts
        ├── services/
            ├── notification.ts
            └── profile.ts
        ├── toast/
            ├── toast.component.html
            └── toast.component.ts
  
```

## Installation

**To get started with the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DavidTchintcharauli/profileAngular.git
   ```
   
2. **Navigate into the project directory:**

  ```bash
  cd UserProfileEditApp
  ```

3. **Install the project dependencies:**
  ```bash
  npm install
  ```
## Development Server
  1. **Run the development server using the following command:
  
  ```bash
  ng serve
  ```
  2. Navigate to http://localhost:4200/ in your browser.
