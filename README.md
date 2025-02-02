# Trip Planner

## Overview

This Trip Planner is a travel planning application that generates a day-by-day itinerary for a specified destination using OpenAI's GPT model. It consists of a Node.js/Express backend and a React frontend.

## How to Run the Program

### Prerequisites

- **Node.js & npm**: Ensure they are installed on your system.
- **OpenAI API Key**: Obtain an API key from OpenAI and set it in your environment variables.

### Steps to Run

1. **Configure Environment Variables**

   Create a `.env` file in the `server` directory and add your OpenAI API key:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Install Dependencies**

   Install all necessary Node.js and React packages for both server and frontend:

   ```bash
   npm run install-scripts
   ```

3. **Start the Application**

   There are two separate commands to start both parts of the application:

   - **Start the Backend:**

     Open a terminal or command prompt and run:

     ```bash
     npm run start-backend
     ```

     The server will be running on the default port 3001 or the port specified in your environment variables.

   - **Start the Frontend:**

     In another terminal or command prompt, run:

     ```bash
     npm run start-frontend
     ```

     The frontend will run on the default port, typically 3000.

## Design Decisions

### Backend (Node.js/Express)

- **Langchain Integration**: Utilizes Langchain for efficient prompt templating and management, facilitating structured interaction with the OpenAI model.
- **OpenAI Model**: Leverages OpenAI's GPT model to generate travel itineraries based on destination, number of days, and start date.
- **Input Validation**: Ensures all required input fields are present and correctly formatted before processing.
- **Comprehensive Error Handling**: Gracefully handles JSON parsing errors and network issues, providing meaningful feedback to users.
- **Modular Structure**: Adopts a separation of concerns with clearly defined prompt templates and environment variables for sensitive information.

### Frontend (React)

- **Minimalistic Design**: Emphasizes a clean, responsive design that centers the form initially, then transitions to reveal the itinerary.
- **Loading Indicator**: Implements a spinner during API requests to enhance the user experience.
- **Responsive Layout**: Ensures compatibility across various devices with a fluid layout and animations.

## Future Considerations

- **Enhanced Activity Suggestions**: Utilize additional APIs to integrate real-time event data or weather forecasts.
- **User Preferences**: Incorporate user input for personalized itineraries, such as preferred activities or dietary options.
- **Scalable Architecture**: Separate service layers and consider using a message queue for handling high-volume request processing.
