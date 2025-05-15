# CrowdPe - Crowdfunding Platform

CrowdPe is a modern crowdfunding platform that enables users to create and manage fundraising campaigns, accept donations, and build a community around their projects.

## Features

- User Authentication (Email/Password)
- Campaign Creation and Management
- Real-time Updates and Comments
- Campaign Progress Tracking
- Milestone Management
- Responsive Design

## Project Structure

```
crowdfunding-platform/
│
├── public/
│   ├── index.html                    # Homepage (explore campaigns)
│   │
│   ├── pages/                        # HTML pages
│   │   ├── login.html               
│   │   ├── signup.html              
│   │   ├── dashboard.html           
│   │   ├── campaign.html            
│   │   ├── create-campaign.html     
│   │   └── profile.html             
│   │
│   ├── assets/
│   │   ├── css/                     # Stylesheets
│   │   ├── js/                      # JavaScript files
│   │   └── media/                   # User uploaded content
│   │
│   └── favicon.ico
│
├── firebase.json                     # Firebase configuration
├── .firebaserc                      # Firebase project settings
└── README.md                        # Project documentation
```

## Setup

1. Clone the repository
2. Set up Firebase project
3. Update Firebase configuration in `public/assets/js/config.js`
4. Deploy to Firebase hosting or run locally

## Development

To run the project locally:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Start local server: `firebase serve`

## Deployment

To deploy to Firebase Hosting:

1. Build the project (if needed)
2. Run: `firebase deploy`

## Technologies Used

- HTML5/CSS3
- JavaScript (ES6+)
- Firebase
  - Authentication
  - Firestore
  - Storage
  - Hosting
